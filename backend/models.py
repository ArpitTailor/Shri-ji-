from database import query_db, execute_db
import werkzeug.security as security

class UserModel:
    @staticmethod
    def create_user(name, email, password, role="customer", phone="", address=""):
        pass_hash = security.generate_password_hash(password)
        avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
        user_id = execute_db("""
            INSERT INTO users (name, email, password_hash, role, phone, address, avatar)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (name, email, pass_hash, role, phone, address, avatar))
        return UserModel.get_by_id(user_id)

    @staticmethod
    def get_by_email(email):
        return query_db("SELECT * FROM users WHERE email = ?", (email,), one=True)

    @staticmethod
    def get_by_id(user_id):
        return query_db("SELECT id, name, email, role, phone, address, avatar, created_at FROM users WHERE id = ?", (user_id,), one=True)

    @staticmethod
    def verify_password(stored_hash, password):
        return security.check_password_hash(stored_hash, password)

class RestaurantModel:
    @staticmethod
    def get_all(search=None, category=None, cuisine=None, sort_by=None, min_rating=None):
        sql = "SELECT * FROM restaurants WHERE 1=1"
        params = []
        
        if search:
            sql += " AND (name LIKE ? OR cuisine_type LIKE ? OR description LIKE ?)"
            term = f"%{search}%"
            params.extend([term, term, term])
            
        if cuisine:
            sql += " AND cuisine_type LIKE ?"
            params.append(f"%{cuisine}%")

        if category:
            sql += """ AND id IN (
                SELECT DISTINCT restaurant_id FROM food_items f
                JOIN categories c ON f.category_id = c.id
                WHERE c.slug = ?
            )"""
            params.append(category)
            
        if min_rating:
            sql += " AND rating >= ?"
            params.append(float(min_rating))

        # Sorting
        if sort_by == 'rating':
            sql += " ORDER BY rating DESC"
        elif sort_by == 'delivery_time':
            sql += " ORDER BY delivery_time ASC"
        elif sort_by == 'cost_low':
            sql += " ORDER BY price_for_two ASC"
        elif sort_by == 'cost_high':
            sql += " ORDER BY price_for_two DESC"
        else:
            sql += " ORDER BY is_promoted DESC, rating DESC"

        return query_db(sql, params)

    @staticmethod
    def get_by_id(rest_id):
        restaurant = query_db("SELECT * FROM restaurants WHERE id = ?", (rest_id,), one=True)
        if restaurant:
            restaurant['reviews'] = query_db("SELECT * FROM reviews WHERE restaurant_id = ? ORDER BY created_at DESC", (rest_id,))
            restaurant['menu'] = query_db("""
                SELECT f.*, c.name as category_name, c.slug as category_slug
                FROM food_items f
                JOIN categories c ON f.category_id = c.id
                WHERE f.restaurant_id = ?
                ORDER BY f.is_bestseller DESC, f.rating DESC
            """, (rest_id,))
        return restaurant

class FoodItemModel:
    @staticmethod
    def get_all(search=None, is_veg=None):
        sql = """
            SELECT f.*, r.name as restaurant_name, r.delivery_time, c.name as category_name
            FROM food_items f
            JOIN restaurants r ON f.restaurant_id = r.id
            JOIN categories c ON f.category_id = c.id
            WHERE 1=1
        """
        params = []
        if search:
            sql += " AND (f.name LIKE ? OR f.description LIKE ? OR c.name LIKE ?)"
            term = f"%{search}%"
            params.extend([term, term, term])
        if is_veg is not None:
            sql += " AND f.is_veg = ?"
            params.append(1 if is_veg else 0)
            
        sql += " ORDER BY f.rating DESC LIMIT 60"
        return query_db(sql, params)

class OrderModel:
    @staticmethod
    def create_order(user_id, restaurant_id, items_json, subtotal, tax, delivery_fee, discount, total_amount, address, payment_method):
        import random, string, datetime
        code = 'SAV-' + ''.join(random.choices(string.digits, k=6))
        est_time = (datetime.datetime.now() + datetime.timedelta(minutes=35)).strftime('%Y-%m-%d %H:%M:%S')
        
        order_id = execute_db("""
            INSERT INTO orders (order_code, user_id, restaurant_id, items_json, subtotal, tax, delivery_fee, discount, total_amount, delivery_address, payment_method, estimated_delivery_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (code, user_id, restaurant_id, items_json, subtotal, tax, delivery_fee, discount, total_amount, address, payment_method, est_time))
        
        # Add order notification
        execute_db("""
            INSERT INTO notifications (user_id, title, message, type)
            VALUES (?, ?, ?, ?)
        """, (user_id, f"Order #{code} Confirmed!", f"Your order total ${total_amount:.2f} has been received and sent to the kitchen.", "order"))
        
        return OrderModel.get_by_id(order_id)

    @staticmethod
    def get_by_id(order_id):
        sql = """
            SELECT o.*, r.name as restaurant_name, r.image_url as restaurant_image, r.address as restaurant_address
            FROM orders o
            JOIN restaurants r ON o.restaurant_id = r.id
            WHERE o.id = ?
        """
        return query_db(sql, (order_id,), one=True)

    @staticmethod
    def get_user_orders(user_id):
        sql = """
            SELECT o.*, r.name as restaurant_name, r.image_url as restaurant_image
            FROM orders o
            JOIN restaurants r ON o.restaurant_id = r.id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        """
        return query_db(sql, (user_id,))

    @staticmethod
    def update_status(order_id, status):
        execute_db("UPDATE orders SET status = ? WHERE id = ?", (status, order_id))
        return OrderModel.get_by_id(order_id)

class AdminModel:
    @staticmethod
    def get_dashboard_stats():
        total_revenue = query_db("SELECT SUM(total_amount) as total FROM orders WHERE status != 'Cancelled'", one=True)['total'] or 0.0
        total_orders = query_db("SELECT COUNT(*) as count FROM orders", one=True)['count']
        total_restaurants = query_db("SELECT COUNT(*) as count FROM restaurants", one=True)['count']
        total_users = query_db("SELECT COUNT(*) as count FROM users", one=True)['count']
        
        recent_orders = query_db("""
            SELECT o.*, u.name as user_name, r.name as restaurant_name
            FROM orders o
            JOIN users u ON o.user_id = u.id
            JOIN restaurants r ON o.restaurant_id = r.id
            ORDER BY o.created_at DESC LIMIT 10
        """)
        
        return {
            "total_revenue": round(total_revenue, 2),
            "total_orders": total_orders,
            "total_restaurants": total_restaurants,
            "total_users": total_users,
            "recent_orders": recent_orders
        }
