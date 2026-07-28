import os
from dotenv import load_dotenv
load_dotenv()

import time
import gzip
from functools import wraps
from flask import Flask, render_template, request, jsonify, session, redirect, url_for, send_from_directory, make_response
from flask_cors import CORS
import secrets
import json
import datetime
from seed_data import seed
from database import query_db, execute_db
from models import UserModel, RestaurantModel, FoodItemModel, OrderModel, AdminModel
from ai_engine import AIFoodRecommender

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='')
cors_origins = os.environ.get("CORS_ORIGINS", "*").split(",") if "," in os.environ.get("CORS_ORIGINS", "*") else os.environ.get("CORS_ORIGINS", "*")
CORS(app, resources={r"/api/*": {"origins": cors_origins}})
app.secret_key = os.environ.get("SECRET_KEY", secrets.token_hex(24))

# --- CACHING & COMPRESSION ---
CACHE = {}
def cache_endpoint(timeout=60):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            cache_key = request.url
            if cache_key in CACHE:
                cached_data, timestamp = CACHE[cache_key]
                if time.time() - timestamp < timeout:
                    return cached_data
            
            response = f(*args, **kwargs)
            CACHE[cache_key] = (response, time.time())
            return response
        return decorated_function
    return decorator

@app.after_request
def compress_response(response):
    accept_encoding = request.headers.get('Accept-Encoding', '')
    if 'gzip' not in accept_encoding.lower():
        return response
    if response.status_code < 200 or response.status_code >= 300:
        return response
    if getattr(response, 'direct_passthrough', False):
        return response
    if response.content_length is not None and response.content_length < 500:
        return response
    
    gzip_buffer = gzip.compress(response.get_data())
    response.set_data(gzip_buffer)
    response.headers['Content-Encoding'] = 'gzip'
    response.headers['Content-Length'] = len(gzip_buffer)
    return response

# Run Seed on Startup
seed()

# --- HELPER FUNC FOR AUTH ---
def get_current_user():
    user_id = session.get('user_id')
    if not user_id:
        # Check authorization header for Bearer token simulated auth
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            if token.isdigit():
                user_id = int(token)
    if user_id:
        return UserModel.get_by_id(user_id)
    return None

# --- HTML & PWA ROUTES (REACT SPA) ---
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/manifest.json')
def serve_manifest():
    return send_from_directory(app.static_folder, 'manifest.json')

@app.route('/sw.js')
def serve_sw():
    return send_from_directory(app.static_folder, 'sw.js')

# --- API ENDPOINTS ---

# 1. Auth API
@app.route('/api/auth/register', methods=['POST'])
def api_register():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone', '')
    address = data.get('address', '')

    if not name or not email or not password:
        return jsonify({'error': 'Name, email and password are required.'}), 400

    existing = UserModel.get_by_email(email)
    if existing:
        return jsonify({'error': 'Email is already registered.'}), 400

    user = UserModel.create_user(name, email, password, role='customer', phone=phone, address=address)
    session['user_id'] = user['id']
    return jsonify({
        'message': 'Registration successful!',
        'user': user,
        'token': str(user['id'])
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def api_login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    user = UserModel.get_by_email(email)
    if not user or not UserModel.verify_password(user['password_hash'], password):
        return jsonify({'error': 'Invalid email or password.'}), 401

    session['user_id'] = user['id']
    clean_user = {k: v for k, v in user.items() if k != 'password_hash'}
    return jsonify({
        'message': 'Login successful!',
        'user': clean_user,
        'token': str(user['id'])
    })

@app.route('/api/auth/logout', methods=['POST'])
def api_logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out successfully.'})

@app.route('/api/auth/me', methods=['GET'])
def api_me():
    user = get_current_user()
    if not user:
        return jsonify({'authenticated': False}), 200
    return jsonify({'authenticated': True, 'user': user})

# 2. Categories API
@app.route('/api/categories', methods=['GET'])
@cache_endpoint(timeout=int(os.environ.get("CACHE_TIMEOUT_CATEGORIES", 300)))
def api_categories():
    categories = query_db("SELECT * FROM categories ORDER BY id ASC")
    return jsonify(categories)

# 3. Restaurants API
@app.route('/api/restaurants', methods=['GET'])
@cache_endpoint(timeout=int(os.environ.get("CACHE_TIMEOUT_RESTAURANTS", 30)))
def api_restaurants():
    search = request.args.get('search')
    category = request.args.get('category')
    cuisine = request.args.get('cuisine')
    sort_by = request.args.get('sort_by')
    min_rating = request.args.get('min_rating')

    restaurants = RestaurantModel.get_all(
        search=search,
        category=category,
        cuisine=cuisine,
        sort_by=sort_by,
        min_rating=min_rating
    )
    return jsonify(restaurants)

@app.route('/api/restaurants/<int:rest_id>', methods=['GET'])
def api_restaurant_detail(rest_id):
    restaurant = RestaurantModel.get_by_id(rest_id)
    if not restaurant:
        return jsonify({'error': 'Restaurant not found.'}), 404
    return jsonify(restaurant)

# 4. Search & Dishes API
@app.route('/api/dishes', methods=['GET'])
@cache_endpoint(timeout=int(os.environ.get("CACHE_TIMEOUT_DISHES", 30)))
def api_dishes():
    search = request.args.get('search')
    is_veg = request.args.get('is_veg')
    if is_veg is not None:
        is_veg = is_veg.lower() in ['true', '1', 'yes']
    dishes = FoodItemModel.get_all(search=search, is_veg=is_veg)
    return jsonify(dishes)

# 5. AI Recommendations API
@app.route('/api/recommendations', methods=['GET'])
def api_recommendations():
    user = get_current_user()
    user_id = user['id'] if user else None
    limit = int(os.environ.get("AI_RECOMMENDATIONS_LIMIT", 8))
    recommendations = AIFoodRecommender.get_recommendations(user_id=user_id, limit=limit)
    return jsonify(recommendations)

# 6. Orders & Checkout API
@app.route('/api/orders', methods=['POST'])
def api_create_order():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized. Please log in to checkout.'}), 401

    data = request.get_json() or {}
    restaurant_id = data.get('restaurant_id')
    items = data.get('items', [])
    subtotal = float(data.get('subtotal', 0))
    tax = float(data.get('tax', 0))
    delivery_fee = float(data.get('delivery_fee', 0))
    discount = float(data.get('discount', 0))
    total_amount = float(data.get('total_amount', 0))
    address = data.get('address') or user.get('address') or "Default Delivery Address"
    payment_method = data.get('payment_method', 'Card')

    if not restaurant_id or not items:
        return jsonify({'error': 'Cart is empty or restaurant missing.'}), 400

    items_json = json.dumps(items)
    order = OrderModel.create_order(
        user_id=user['id'],
        restaurant_id=restaurant_id,
        items_json=items_json,
        subtotal=subtotal,
        tax=tax,
        delivery_fee=delivery_fee,
        discount=discount,
        total_amount=total_amount,
        address=address,
        payment_method=payment_method
    )

    return jsonify({
        'message': 'Order placed successfully!',
        'order': order
    }), 201

@app.route('/api/orders', methods=['GET'])
def api_get_orders():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized.'}), 401
    orders = OrderModel.get_user_orders(user['id'])
    for o in orders:
        o['items'] = json.loads(o['items_json'])
    return jsonify(orders)

@app.route('/api/orders/<int:order_id>', methods=['GET'])
def api_order_status(order_id):
    order = OrderModel.get_by_id(order_id)
    if not order:
        return jsonify({'error': 'Order not found.'}), 404
    order['items'] = json.loads(order['items_json'])
    return jsonify(order)

# 7. Wishlist API
@app.route('/api/wishlist', methods=['GET', 'POST'])
def api_wishlist():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Unauthorized.'}), 401

    if request.method == 'GET':
        favs = query_db("""
            SELECT r.* FROM wishlist w
            JOIN restaurants r ON w.restaurant_id = r.id
            WHERE w.user_id = ?
        """, (user['id'],))
        return jsonify(favs)

    elif request.method == 'POST':
        data = request.get_json() or {}
        rest_id = data.get('restaurant_id')
        if not rest_id:
            return jsonify({'error': 'Restaurant ID required.'}), 400

        existing = query_db("SELECT * FROM wishlist WHERE user_id = ? AND restaurant_id = ?", (user['id'], rest_id), one=True)
        if existing:
            execute_db("DELETE FROM wishlist WHERE id = ?", (existing['id'],))
            return jsonify({'message': 'Removed from wishlist.', 'in_wishlist': False})
        else:
            execute_db("INSERT INTO wishlist (user_id, restaurant_id) VALUES (?, ?)", (user['id'], rest_id))
            return jsonify({'message': 'Added to wishlist!', 'in_wishlist': True})

# 8. Notifications & Coupons API
@app.route('/api/notifications', methods=['GET'])
def api_notifications():
    user = get_current_user()
    if not user:
        return jsonify([])
    notes = query_db("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC", (user['id'],))
    return jsonify(notes)

@app.route('/api/coupons/verify', methods=['POST'])
def api_verify_coupon():
    data = request.get_json() or {}
    code = data.get('code', '').strip().upper()
    amount = float(data.get('amount', 0))

    coupon = query_db("SELECT * FROM coupons WHERE code = ? AND is_active = 1", (code,), one=True)
    if not coupon:
        return jsonify({'valid': False, 'message': 'Invalid coupon code.'}), 400

    if amount < coupon['min_order_amount']:
        return jsonify({'valid': False, 'message': f"Minimum order amount is ${coupon['min_order_amount']:.2f}."}), 400

    calc_discount = (amount * coupon['discount_percent']) / 100.0
    final_discount = min(calc_discount, coupon['max_discount'])

    return jsonify({
        'valid': True,
        'code': coupon['code'],
        'discount_percent': coupon['discount_percent'],
        'discount_amount': round(final_discount, 2),
        'message': f"Coupon applied! You saved ${final_discount:.2f}"
    })

# 9. Admin API
@app.route('/api/admin/dashboard', methods=['GET'])
def api_admin_dashboard():
    user = get_current_user()
    if not user or user['role'] != 'admin':
        return jsonify({'error': 'Admin access required.'}), 403
    stats = AdminModel.get_dashboard_stats()
    return jsonify(stats)

@app.route('/api/admin/orders/<int:order_id>/status', methods=['PUT'])
def api_admin_update_order(order_id):
    user = get_current_user()
    if not user or user['role'] != 'admin':
        return jsonify({'error': 'Admin access required.'}), 403
    data = request.get_json() or {}
    status = data.get('status')
    if not status:
        return jsonify({'error': 'Status required.'}), 400

    updated = OrderModel.update_status(order_id, status)
    return jsonify({'message': f'Order status updated to {status}', 'order': updated})

@app.route('/api/admin/restaurants', methods=['POST'])
def api_admin_add_restaurant():
    user = get_current_user()
    if not user or user['role'] != 'admin':
        return jsonify({'error': 'Admin access required.'}), 403

    data = request.get_json() or {}
    name = data.get('name')
    cuisine = data.get('cuisine_type')
    img = data.get('image_url') or "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
    address = data.get('address', 'Downtown')

    rest_id = execute_db("""
        INSERT INTO restaurants (name, description, cuisine_type, rating, total_ratings, delivery_time, distance_km, price_for_two, offer_text, image_url, address)
        VALUES (?, ?, ?, 4.5, 10, 25, 2.0, 400, 'Special 10% OFF', ?, ?)
    """, (name, f"Fresh {cuisine} cuisine.", cuisine, img, address))

    return jsonify({'message': 'Restaurant added successfully!', 'id': rest_id}), 201

# --- SPA FALLBACK ROUTE ---
@app.route('/<path:path>')
def serve_static_or_spa(path):
    if path.startswith('api/'):
        return jsonify({'error': 'API endpoint not found'}), 404
    try:
        return send_from_directory(app.static_folder, path)
    except Exception:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", 5050))
    debug = os.environ.get("FLASK_DEBUG", "True").lower() in ("true", "1", "yes")
    print(f"Launching Savoria Server on http://{host}:{port} (debug={debug})...")
    app.run(debug=debug, host=host, port=port)
