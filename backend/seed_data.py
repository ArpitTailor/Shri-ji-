import werkzeug.security as security
from database import init_db, execute_db, query_db, get_db

def seed():
    init_db()
    conn = get_db()
    cur = conn.cursor()
    
    # Check if already seeded
    cur.execute("SELECT COUNT(*) as count FROM restaurants")
    if cur.fetchone()['count'] > 0:
        print("Database is already seeded.")
        conn.close()
        return

    print("Seeding database with 30+ restaurants and 100+ menu items...")

    # 1. Seed Users
    pass_hash = security.generate_password_hash("password123")
    admin_hash = security.generate_password_hash("admin123")
    
    cur.execute("""
        INSERT INTO users (name, email, password_hash, role, phone, address, avatar)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, ("Alex Morgan", "alex@example.com", pass_hash, "customer", "+1 (555) 234-5678", "742 Evergreen Terrace, Apt 4B, New York", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"))

    cur.execute("""
        INSERT INTO users (name, email, password_hash, role, phone, address, avatar)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, ("Shri Ji Admin", "admin@shriji.com", admin_hash, "admin", "+1 (555) 999-0000", "HQ Tower 1, Tech District", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"))

    # 2. Seed Categories
    categories_data = [
        ("Pizza", "pizza", "fa-pizza-slice", "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80"),
        ("Burger", "burger", "fa-hamburger", "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"),
        ("Biryani", "biryani", "fa-bowl-rice", "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80"),
        ("Chinese", "chinese", "fa-utensils", "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80"),
        ("South Indian", "south-indian", "fa-concierge-bell", "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=600&q=80"),
        ("Fast Food", "fast-food", "fa-hotdog", "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=600&q=80"),
        ("Desserts", "desserts", "fa-ice-cream", "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80"),
        ("Beverages", "beverages", "fa-glass-martini-alt", "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=600&q=80"),
        ("Healthy Meals", "healthy", "fa-leaf", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80")
    ]

    cat_id_map = {}
    for name, slug, icon, img in categories_data:
        cur.execute("INSERT INTO categories (name, slug, icon, image_url) VALUES (?, ?, ?, ?)", (name, slug, icon, img))
        cat_id_map[slug] = cur.lastrowid

    # 3. Seed Restaurants (30+ Restaurants)
    restaurants_data = [
        # Pizza
        {
            "name": "Lucia Woodfire Pizzeria", "cuisine": "Italian, Woodfired Pizza", "rating": 4.8, "ratings_cnt": 340,
            "delivery_time": 25, "distance": 1.8, "price": 450, "offer": "20% OFF up to $10", "is_open": 1, "is_promoted": 1,
            "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1200&q=80",
            "address": "42 Little Italy Way, Downtown", "slug_cat": "pizza"
        },
        {
            "name": "Artisan Crust & Co.", "cuisine": "Gourmet Pizza, Pastas", "rating": 4.6, "ratings_cnt": 210,
            "delivery_time": 30, "distance": 3.1, "price": 500, "offer": "Free Garlic Bread", "is_open": 1, "is_promoted": 0,
            "image": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
            "address": "88 Bakery Lane, Westside", "slug_cat": "pizza"
        },
        {
            "name": "Napoli Neapolitan Pizza", "cuisine": "Authentic Italian", "rating": 4.7, "ratings_cnt": 410,
            "delivery_time": 35, "distance": 4.2, "price": 600, "offer": "15% OFF", "is_open": 1, "is_promoted": 1,
            "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=1200&q=80",
            "address": "15 Heritage Street", "slug_cat": "pizza"
        },
        {
            "name": "Cheesy Crust House", "cuisine": "Deep Dish & Thin Crust", "rating": 4.4, "ratings_cnt": 180,
            "delivery_time": 20, "distance": 1.2, "price": 350, "offer": "$5 Flat Off", "is_open": 1, "is_promoted": 0,
            "image": "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=1200&q=80",
            "address": "90 Central Avenue", "slug_cat": "pizza"
        },

        # Burger
        {
            "name": "The Sizzle & Smash Burger", "cuisine": "American Gourmet Burgers", "rating": 4.9, "ratings_cnt": 620,
            "delivery_time": 22, "distance": 2.0, "price": 380, "offer": "Buy 1 Get 1 Free Drink", "is_open": 1, "is_promoted": 1,
            "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80",
            "address": "104 Broadway St", "slug_cat": "burger"
        },
        {
            "name": "Black Truffle Burger Bar", "cuisine": "Craft Burgers & Fries", "rating": 4.7, "ratings_cnt": 290,
            "delivery_time": 28, "distance": 2.9, "price": 480, "offer": "25% OFF on $25+", "is_open": 1, "is_promoted": 0,
            "image": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1200&q=80",
            "address": "12 Boulevard Ave", "slug_cat": "burger"
        },
        {
            "name": "Velvet Bun Shack", "cuisine": "Brioche Burgers & Shakes", "rating": 4.5, "ratings_cnt": 150,
            "delivery_time": 18, "distance": 1.4, "price": 320, "offer": "Free Fries with Any Burger", "is_open": 1, "is_promoted": 0,
            "image": "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=80",
            "address": "33 Harbor Drive", "slug_cat": "burger"
        },
        {
            "name": "Monster Stack Grill", "cuisine": "Loaded Burgers, BBQ Wings", "rating": 4.6, "ratings_cnt": 310,
            "delivery_time": 32, "distance": 3.8, "price": 420, "offer": "10% OFF", "is_open": 1, "is_promoted": 0,
            "image": "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=1200&q=80",
            "address": "77 Oakwood Plaza", "slug_cat": "burger"
        },

        # Biryani
        {
            "name": "Nawab's Royal Biryani House", "cuisine": "Hyderabadi & Dum Biryani", "rating": 4.9, "ratings_cnt": 850,
            "delivery_time": 30, "distance": 2.3, "price": 450, "offer": "Complimentary Mirchi Ka Salan", "is_open": 1, "is_promoted": 1,
            "image": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=1200&q=80",
            "address": "1 Royal Palace Road", "slug_cat": "biryani"
        },
        {
            "name": "Behrouz Royal Feast", "cuisine": "Mughlai & Claypot Biryani", "rating": 4.8, "ratings_cnt": 540,
            "delivery_time": 35, "distance": 3.5, "price": 550, "offer": "20% OFF code: ROYAL", "is_open": 1, "is_promoted": 0,
            "image": "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80",
            "address": "22 Sultan Lane", "slug_cat": "biryani"
        },
        {
            "name": "Zaffran Charcoal Biryani", "cuisine": "Lucknowi & Charcoal Handi", "rating": 4.7, "ratings_cnt": 290,
            "delivery_time": 28, "distance": 2.1, "price": 400, "offer": "Free Gulab Jamun", "is_open": 1, "is_promoted": 0,
            "image": "https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80",
            "address": "55 Market Square", "slug_cat": "biryani"
        },

        # Chinese
        {
            "name": "Golden Dragon Asian Wok", "cuisine": "Szechuan, Dim Sum, Ramen", "rating": 4.8, "ratings_cnt": 470,
            "delivery_time": 25, "distance": 2.7, "price": 420, "offer": "15% OFF On Bowls", "is_open": 1, "is_promoted": 1,
            "image": "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=80",
            "address": "19 Chinatown Promenade", "slug_cat": "chinese"
        },
        {
            "name": "Bamboo Kitchen & Dimsum Bar", "cuisine": "Cantonese & Asian Fusion", "rating": 4.6, "ratings_cnt": 310,
            "delivery_time": 30, "distance": 3.0, "price": 480, "offer": "Complimentary Spring Rolls", "is_open": 1, "is_promoted": 0,
            "image": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1200&q=80",
            "address": "88 Lotus Way", "slug_cat": "chinese"
        },
        {
            "name": "Red Lantern Noodle House", "cuisine": "Street Noodles & Dumplings", "rating": 4.5, "ratings_cnt": 190,
            "delivery_time": 22, "distance": 1.9, "price": 300, "offer": "10% OFF", "is_open": 1, "is_promoted": 0,
            "image": "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=1200&q=80",
            "address": "14 Jade Alley", "slug_cat": "chinese"
        },

        # South Indian
        {
            "name": "Dakshin Dosa & Tiffin House", "cuisine": "South Indian, Authentic Dosa", "rating": 4.9, "ratings_cnt": 780,
            "delivery_time": 20, "distance": 1.5, "price": 250, "offer": "Filter Coffee Free", "is_open": 1, "is_promoted": 1,
            "image": "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80",
            "address": "101 Coconut Grove Rd", "slug_cat": "south-indian"
        },
        {
            "name": "Malabar Spices & Curries", "cuisine": "Kerala Seafood & Appam", "rating": 4.7, "ratings_cnt": 340,
            "delivery_time": 32, "distance": 3.4, "price": 450, "offer": "15% OFF", "is_open": 1, "is_promoted": 0,
            "image": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=80",
            "address": "62 Coast Line St", "slug_cat": "south-indian"
        },
        {
            "name": "Idli & Vada Corner", "cuisine": "Pure Veg South Tiffins", "rating": 4.6, "ratings_cnt": 230,
            "delivery_time": 15, "distance": 1.1, "price": 200, "offer": "Fast 15 Mins Delivery", "is_open": 1, "is_promoted": 0,
            "image": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=1200&q=80",
            "address": "5 Temple Road", "slug_cat": "south-indian"
        },

        # Fast Food
        {
            "name": "Crunchy Chick'n Coop", "cuisine": "Fried Chicken & Loaded Wraps", "rating": 4.7, "ratings_cnt": 510,
            "delivery_time": 22, "distance": 2.2, "price": 350, "offer": "Bucket Special 25% OFF", "is_open": 1, "is_promoted": 1,
            "image": "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=1200&q=80",
            "address": "40 Fast Track Blvd", "slug_cat": "fast-food"
        },
        {
            "name": "Street Taco Express", "cuisine": "Mexican Street Tacos & Burritos", "rating": 4.6, "ratings_cnt": 320,
            "delivery_time": 20, "distance": 1.7, "price": 300, "offer": "Taco Tuesday Buy 2 Get 1", "is_open": 1, "is_promoted": 0,
            "image": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1200&q=80",
            "address": "12 Sonora Lane", "slug_cat": "fast-food"
        },
        {
            "name": "Sub Supreme Sandwiches", "cuisine": "Artisan Subs & Salads", "rating": 4.5, "ratings_cnt": 200,
            "delivery_time": 18, "distance": 1.3, "price": 280, "offer": "Free Beverage", "is_open": 1, "is_promoted": 0,
            "image": "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=1200&q=80",
            "address": "81 University Way", "slug_cat": "fast-food"
        },

        # Desserts
        {
            "name": "Sweet Alchemy Gelato", "cuisine": "Artisan Gelato & Desserts", "rating": 4.9, "ratings_cnt": 680,
            "delivery_time": 20, "distance": 1.6, "price": 320, "offer": "Free Waffle Cone", "is_open": 1, "is_promoted": 1,
            "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80",
            "address": "25 Sugar Hill Road", "slug_cat": "desserts"
        },
        {
            "name": "The Cocoa Lounge & Bakery", "cuisine": "Cakes, Pastries, Chocolate", "rating": 4.8, "ratings_cnt": 410,
            "delivery_time": 25, "distance": 2.4, "price": 400, "offer": "20% OFF Cakes", "is_open": 1, "is_promoted": 0,
            "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
            "address": "9 Sweet Tooth Lane", "slug_cat": "desserts"
        },
        {
            "name": "Glazed Donut Boutique", "cuisine": "Gourmet Donuts & Coffee", "rating": 4.7, "ratings_cnt": 290,
            "delivery_time": 18, "distance": 1.5, "price": 260, "offer": "Buy 6 Get 2 Free", "is_open": 1, "is_promoted": 0,
            "image": "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=80",
            "address": "14 Baker Street", "slug_cat": "desserts"
        },

        # Beverages
        {
            "name": "The Boba & Brew Studio", "cuisine": "Bubble Tea, Smoothies, Iced Coffees", "rating": 4.8, "ratings_cnt": 490,
            "delivery_time": 15, "distance": 1.0, "price": 220, "offer": "Buy 1 Get 1 50% OFF", "is_open": 1, "is_promoted": 1,
            "image": "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=80",
            "address": "78 Cyber Hub", "slug_cat": "beverages"
        },
        {
            "name": "Artisan Roasters & Cold Brew", "cuisine": "Specialty Coffee, Matcha", "rating": 4.9, "ratings_cnt": 520,
            "delivery_time": 18, "distance": 1.4, "price": 280, "offer": "Free Cookie", "is_open": 1, "is_promoted": 0,
            "image": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=1200&q=80",
            "address": "3 Beans Alley", "slug_cat": "beverages"
        },
        {
            "name": "Juice Republic & Elixirs", "cuisine": "Fresh Cold Pressed Juices", "rating": 4.6, "ratings_cnt": 210,
            "delivery_time": 15, "distance": 1.2, "price": 240, "offer": "10% OFF Detox Packs", "is_open": 1, "is_promoted": 0,
            "image": "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=1200&q=80",
            "address": "45 Green Way", "slug_cat": "beverages"
        },

        # Healthy
        {
            "name": "Green Goddess Bowl Bar", "cuisine": "Keto, Quinoa Bowls, Salads", "rating": 4.9, "ratings_cnt": 610,
            "delivery_time": 22, "distance": 1.9, "price": 380, "offer": "Free Kombucha Shot", "is_open": 1, "is_promoted": 1,
            "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
            "address": "12 Organic Park", "slug_cat": "healthy"
        },
        {
            "name": "The Avocado Social", "cuisine": "Avocado Toasts & Poke Bowls", "rating": 4.8, "ratings_cnt": 370,
            "delivery_time": 25, "distance": 2.1, "price": 420, "offer": "15% OFF Health Plan", "is_open": 1, "is_promoted": 0,
            "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
            "address": "90 Wellness Blvd", "slug_cat": "healthy"
        },
        {
            "name": "Clean Protein Kitchen", "cuisine": "High Protein Meals & Wraps", "rating": 4.7, "ratings_cnt": 280,
            "delivery_time": 20, "distance": 1.8, "price": 360, "offer": "$4 Off First Order", "is_open": 1, "is_promoted": 0,
            "image": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
            "address": "33 Fitness Drive", "slug_cat": "healthy"
        },
        {
            "name": "Swiggy Specials", "cuisine": "Indian Thalis & Curries", "rating": 4.8, "ratings_cnt": 1200,
            "delivery_time": 25, "distance": 2.5, "price": 350, "offer": "50% OFF Up to $5", "is_open": 1, "is_promoted": 1,
            "image": "https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=1200&q=80",
            "address": "Local Cloud Kitchen", "slug_cat": "south-indian"
        },
        {
            "name": "Zomato Legends", "cuisine": "Punjabi & North Indian", "rating": 4.9, "ratings_cnt": 3200,
            "delivery_time": 30, "distance": 3.0, "price": 400, "offer": "Legendary Taste", "is_open": 1, "is_promoted": 1,
            "image": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=1200&q=80",
            "address": "Premium Delivery Hub", "slug_cat": "biryani"
        },
        {
            "name": "Domino's Style", "cuisine": "Fast Food & Pizza", "rating": 4.4, "ratings_cnt": 5400,
            "delivery_time": 20, "distance": 1.2, "price": 250, "offer": "Free Delivery", "is_open": 1, "is_promoted": 1,
            "image": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80",
            "address": "Express Store", "slug_cat": "pizza"
        },
        {
            "name": "Shri Ji Pure Veg", "cuisine": "Pure Veg, North Indian, Thalis", "rating": 4.9, "ratings_cnt": 850,
            "delivery_time": 25, "distance": 2.2, "price": 300, "offer": "30% OFF Pure Veg Fest", "is_open": 1, "is_promoted": 1,
            "image": "https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=800&q=80",
            "banner": "https://images.unsplash.com/photo-1589302168068-964664d93cb0?auto=format&fit=crop&w=1200&q=80",
            "address": "Main Market Square", "slug_cat": "south-indian"
        }
    ]

    rest_id_map = {}
    for r in restaurants_data:
        cur.execute("""
            INSERT INTO restaurants (name, description, cuisine_type, rating, total_ratings, delivery_time, distance_km, price_for_two, offer_text, is_open, is_promoted, image_url, banner_url, address)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (r["name"], f"Experience premium {r['cuisine']} crafted with fresh artisan ingredients.", r["cuisine"], r["rating"], r["ratings_cnt"], r["delivery_time"], r["distance"], r["price"], r["offer"], r["is_open"], r["is_promoted"], r["image"], r["banner"], r["address"]))
        rest_id = cur.lastrowid
        rest_id_map[r["name"]] = (rest_id, cat_id_map[r["slug_cat"]])

    # 4. Seed Food Items (100+ Food Items)
    import random
    dishes_dataset = []
    
    brand_items = [
        ("Swiggy Specials", []),
        ("Zomato Legends", []),
        ("Domino's Style", [])
    ]
    
    # Generate 100 diverse dishes mapped to the restaurants
    base_images = [
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=80"
    ]
    
    # Add ~50 items to Swiggy, Zomato, Dominos each to total ~150
    for brand_idx, brand_name in enumerate(["Swiggy Specials", "Zomato Legends", "Domino's Style"]):
        items = []
        for i in range(50):
            is_veg = random.choice([True, False])
            food_types = ["Burger", "Pizza", "Thali", "Biryani", "Noodles", "Pasta", "Roll", "Wrap", "Fries"]
            items.append((
                f"{brand_name.split()[0]} Signature {random.choice(food_types)} {i+1}",
                f"Premium highly rated dish delivered fast by {brand_name.split()[0]}.",
                random.randint(39, 299),
                is_veg,
                random.choice([True, False]),
                round(random.uniform(4.0, 5.0), 1),
                random.choice(base_images),
                random.choice(["Mild", "Medium", "Spicy"]),
                random.randint(100, 2000)
            ))
        brand_items[brand_idx][1].extend(items)
        
    for r in restaurants_data:
        items = []
        for i in range(10):
            is_veg = random.choice([True, False])
            items.append((
                f"{r['cuisine'].split(',')[0]} Special Item {random.randint(1, 999)}",
                f"Delicious {r['cuisine']} preparation with fresh ingredients.",
                random.randint(39, 299),
                is_veg,
                random.choice([True, False]),
                round(random.uniform(4.0, 5.0), 1),
                random.choice(base_images),
                random.choice(["Mild", "Medium", "Spicy"]),
                random.randint(200, 1000)
            ))
        dishes_dataset.append((r["name"], items))
        
    dishes_dataset.extend(brand_items)
    
    # Previous dishes data mapped
    old_dishes_dataset = [
        # Pizza Dishes
        ("Lucia Woodfire Pizzeria", [
            ("Margherita Con Bufala", "Fresh Mozzarella di Bufala, San Marzano tomato sauce, fresh basil, extra virgin olive oil.", 171, True, True, 4.9, "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80", "Mild", 520),
            ("Truffle & Wild Mushroom Pizza", "Black truffle cream base, caramelized onions, wild shiitake & porcini, thyme.", 277, True, True, 4.8, "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80", "Medium", 610),
            ("Spicy Pepperoni & Honey", "Crispy artisan pepperoni, hot chili oil, raw wildflower honey drizzle.", 268, False, True, 4.9, "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80", "Spicy", 680),
            ("Quattro Formaggi", "Gorgonzola piccante, smoked scamorza, fontina, and aged parmesan.", 176, True, False, 4.7, "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80", "Mild", 700)
        ]),
        ("Artisan Crust & Co.", [
            ("Prosciutto & Arugula Pizza", "Prosciutto di Parma, wild arugula, shaved parmesan, balsamic reduction.", 96, False, True, 4.8, "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80", "Mild", 590),
            ("Pesto Genovese & Sundried Tomato", "Housemade basil pesto, cherry tomatoes, toasted pine nuts, goat cheese.", 76, True, False, 4.6, "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80", "Mild", 550),
            ("Charred Garlic & Spinach Calzone", "Folded sourdough crust filled with creamy ricotta and roasted garlic.", 51, True, False, 4.5, "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80", "Medium", 580)
        ]),
        ("Napoli Neapolitan Pizza", [
            ("Classic Marinara (Vegan)", "San Marzano tomatoes, sliced garlic, oregano, fresh basil oil.", 252, True, False, 4.7, "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80", "Mild", 440),
            ("Diavola Spicy Salami", "Spicy Calabrian salami, crushed red chili, smoked mozzarella.", 225, False, True, 4.9, "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80", "Spicy", 650)
        ]),
        ("Cheesy Crust House", [
            ("Loaded BBQ Chicken Deep Dish", "Rich BBQ chicken breast, melted cheddar, crispy bacon, green onions.", 78, False, True, 4.6, "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80", "Medium", 750),
            ("Double Layer Pepperoni Feast", "Over 50 slices of crispy pepperoni with double mozzarella layer.", 225, False, False, 4.5, "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80", "Medium", 820)
        ]),

        # Burger Dishes
        ("The Sizzle & Smash Burger", [
            ("Double Truffle Smash Burger", "Two smash patties, truffle aioli, melted Swiss, crispy shallots, brioche bun.", 139, False, True, 4.9, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80", "Medium", 780),
            ("Smokey Bacon & Cheddar Monster", "Angus beef patty, applewood smoked bacon, sharp cheddar, Shri Ji sauce.", 70, False, True, 4.8, "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80", "Medium", 840),
            ("Spicy Nashville Hot Chicken Burger", "Crispy fried chicken thigh dipped in chili oil, dill pickles, slaw.", 266, False, True, 4.9, "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80", "Spicy", 710),
            ("Beyond Plant Smash Burger", "Plant-based patty, vegan cheddar, caramelized onions, house pickle.", 252, True, False, 4.7, "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80", "Mild", 560)
        ]),
        ("Black Truffle Burger Bar", [
            ("Wagyu Steakhouse Burger", "100% Wagyu beef patty, white cheddar, bourbon glaze, sautéed mushrooms.", 75, False, True, 4.9, "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80", "Medium", 890),
            ("Loaded Parmesan Truffle Fries", "Hand-cut potato fries tossed in truffle oil, parmesan, chives.", 231, True, True, 4.8, "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80", "Mild", 420)
        ]),
        ("Velvet Bun Shack", [
            ("Classic Cheeseburger Deluxe", "Single beef patty, double American cheese, secret sauce, soft potato bun.", 276, False, False, 4.6, "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80", "Mild", 620),
            ("Avocado & Goat Cheese Burger", "Grilled beef patty, fresh avocado mash, tangy goat cheese, arugula.", 179, False, False, 4.7, "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80", "Mild", 670)
        ]),
        ("Monster Stack Grill", [
            ("Triple Stack BBQ Bacon", "Three beef smash patties, triple cheese, smoked brisket points, BBQ glaze.", 118, False, True, 4.8, "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80", "Spicy", 1100),
            ("Buffalo Chicken Wings (10 pcs)", "Crispy wings coated in tangy spicy buffalo sauce with blue cheese dip.", 52, False, True, 4.7, "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80", "Spicy", 690)
        ]),

        # Biryani Dishes
        ("Nawab's Royal Biryani House", [
            ("Hyderabadi Dum Chicken Biryani", "Slow-cooked saffron basmati rice layered with marinated tender chicken and aromatics.", 53, False, True, 4.9, "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80", "Medium", 720),
            ("Royal Mutton Dum Biryani", "Succulent mutton pieces slow-cooked in handi with aged basmati & fried onions.", 193, False, True, 4.9, "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80", "Spicy", 850),
            ("Paneer Tikka Dum Biryani", "Char-grilled cottage cheese cubes simmered in spiced basmati rice.", 184, True, False, 4.7, "https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=800&q=80", "Medium", 640),
            ("Mirchi Ka Salan & Raita Combo", "Traditional spicy green chili curry served with cool cucumber mint raita.", 208, True, False, 4.6, "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80", "Spicy", 180)
        ]),
        ("Behrouz Royal Feast", [
            ("Subz-E-Gulzar Veg Biryani", "Garden fresh veggies, cashews, and caramelized onions layered in fragrant rice.", 122, True, True, 4.8, "https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=800&q=80", "Mild", 580),
            ("Murgh Makhani Biryani", "Creamy butter chicken gravy infused with biryani spices and basmati rice.", 198, False, True, 4.8, "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80", "Medium", 790)
        ]),
        ("Zaffran Charcoal Biryani", [
            ("Lucknowi Awadhi Chicken Biryani", "Mildly spiced fragrant white basmati rice with kewra essence & juicy chicken.", 192, False, False, 4.7, "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80", "Mild", 680),
            ("Charcoal Smoked Egg Biryani", "Boiled eggs tossed in spicy masala layered in fragrant charcoal smoked rice.", 131, False, False, 4.6, "https://images.unsplash.com/photo-1642821373181-696a54913e93?auto=format&fit=crop&w=800&q=80", "Medium", 590)
        ]),

        # Chinese Dishes
        ("Golden Dragon Asian Wok", [
            ("Schezwan Dragon Chili Chicken", "Crispy chicken tossed in fiery Schezwan pepper sauce with scallions.", 161, False, True, 4.8, "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80", "Spicy", 540),
            ("Hong Kong Style Hakka Noodles", "Wok-tossed noodles with colorful bell peppers, cabbage, and sesame glaze.", 139, True, True, 4.7, "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=800&q=80", "Medium", 480),
            ("Steamed Chicken Crystal Dim Sum (6pcs)", "Translucent dumplings stuffed with minced chicken, ginger, and scallions.", 133, False, True, 4.9, "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80", "Mild", 320),
            ("Classic Kung Pao Paneer", "Crispy paneer cubes, roasted peanuts, chili peppers in sweet tangy soy glaze.", 218, True, False, 4.6, "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80", "Medium", 510)
        ]),
        ("Bamboo Kitchen & Dimsum Bar", [
            ("Pork & Shrimp Siu Mai Dumplings", "Traditional open-topped dumplings topped with flying fish roe.", 103, False, True, 4.9, "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80", "Mild", 350),
            ("Spicy Dan Dan Pork Ramen Bowl", "Rich sesame chili broth, minced pork, bok choy, springy wheat noodles.", 113, False, True, 4.8, "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80", "Spicy", 630)
        ]),
        ("Red Lantern Noodle House", [
            ("Garlic Butter Fried Rice", "Fragrant jasmine rice fried with roasted garlic, farm eggs, and spring onion.", 296, False, False, 4.5, "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=800&q=80", "Mild", 490),
            ("Crispy Honey Chili Lotus Stem", "Thinly sliced lotus stem tossed in chili garlic honey reduction.", 296, True, False, 4.6, "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80", "Medium", 380)
        ]),

        # South Indian Dishes
        ("Dakshin Dosa & Tiffin House", [
            ("Ghee Roast Mysore Masala Dosa", "Crispy golden crepe smeared with spicy red chutney, filled with potato masala.", 232, True, True, 4.9, "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80", "Medium", 420),
            ("Steamed Button Idli Sambar Platter", "Mini fluffy rice cakes submerged in piping hot spiced lentil soup with coconut chutney.", 183, True, True, 4.8, "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80", "Mild", 310),
            ("Crispy Medu Vada (3 pcs)", "Golden fried savory lentil donuts served with peanut and tomato chutneys.", 74, True, False, 4.7, "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80", "Mild", 350),
            ("Degree Filter Coffee", "Traditional South Indian frothy chicory coffee served in brass davarah cup.", 221, True, True, 4.9, "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80", "Mild", 120)
        ]),
        ("Malabar Spices & Curries", [
            ("Kerala Mutton Stew & Fluffy Appam", "Tender mutton cooked in coconut milk stew served with soft lace appams.", 197, False, True, 4.8, "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80", "Medium", 580),
            ("Karimeen Pollichathu (Banana Leaf Fish)", "Pearlspot fish marinated in Malabar spices grilled inside banana leaf.", 179, False, True, 4.9, "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80", "Spicy", 520)
        ]),
        ("Idli & Vada Corner", [
            ("Onion Rava Masala Dosa", "Super crispy semolina crepe dotted with green chilies, onions, and cashews.", 149, True, False, 4.6, "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80", "Medium", 390),
            ("Cheese Burst Chili Dosa", "Modern twist with melted mozzarella, chopped chilies, and coriander.", 114, True, False, 4.5, "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80", "Spicy", 480)
        ]),

        # Fast Food Dishes
        ("Crunchy Chick'n Coop", [
            ("Crispy Tender Bucket (8 pcs)", "Golden fried crispy chicken tenders served with honey mustard and garlic dip.", 148, False, True, 4.8, "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80", "Medium", 850),
            ("Spicy Zinger Crunch Wrap", "Crispy chicken fillet, shredded lettuce, melted cheese in toasted tortilla.", 99, False, True, 4.7, "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=80", "Spicy", 620)
        ]),
        ("Street Taco Express", [
            ("Carne Asada Beef Tacos (3 pcs)", "Grilled skirt steak on soft corn tortillas topped with cilantro and guacamole.", 244, False, True, 4.8, "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80", "Medium", 490),
            ("Loaded Quesabirria with Consomé", "Crispy slow-braised beef tacos melted with Chihuahua cheese and dip broth.", 157, False, True, 4.9, "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80", "Spicy", 680)
        ]),
        ("Sub Supreme Sandwiches", [
            ("Italian Meatball Sub", "Savory beef meatballs in marinara topped with melted provolone on sourdough hoagie.", 122, False, False, 4.6, "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80", "Medium", 580),
            ("Turkey Avocado Cranberry Club", "Sliced roasted turkey breast, crisp bacon, avocado, and tangy cranberry jam.", 154, False, False, 4.7, "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80", "Mild", 510)
        ]),

        # Desserts Dishes
        ("Sweet Alchemy Gelato", [
            ("Belgian Dark Chocolate & Hazelnut Scoop", "Rich double dark chocolate gelato laced with roasted Italian hazelnuts.", 258, True, True, 4.9, "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80", "Mild", 280),
            ("Pistachio Sicily Gelato Tub (500ml)", "Authentic Sicilian pistachio gelato made with 100% Bronte pistachio paste.", 87, True, True, 4.9, "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80", "Mild", 540)
        ]),
        ("The Cocoa Lounge & Bakery", [
            ("Molten Chocolate Lava Cake", "Warm chocolate cake with a gushing dark chocolate center served with vanilla gelato.", 178, True, True, 4.8, "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80", "Mild", 450),
            ("New York Basque Burnt Cheesecake", "Creamy, caramelized top cheesecake with fresh raspberry compote.", 263, True, True, 4.9, "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80", "Mild", 480)
        ]),
        ("Glazed Donut Boutique", [
            ("Salted Caramel Biscoff Donut Box (4pcs)", "Fluffy brioche donuts glazed with caramelized Biscoff drip & crushed cookies.", 86, True, False, 4.7, "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80", "Mild", 520),
            ("Nutella Filled Bombone Donut", "Stuffed with warm Nutella cocoa hazelnut cream and dusted with powdered sugar.", 258, True, True, 4.8, "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80", "Mild", 340)
        ]),

        # Beverages Dishes
        ("The Boba & Brew Studio", [
            ("Brown Sugar Boba Milk Tea", "Fresh tapioca pearls slow-cooked in brown sugar syrup with organic milk & tea.", 147, True, True, 4.9, "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80", "Mild", 310),
            ("Taro Coconut Cloud Milk Tea", "Sweet taro root tea topped with fluffy coconut cream foam and boba pearls.", 104, True, False, 4.7, "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80", "Mild", 330)
        ]),
        ("Artisan Roasters & Cold Brew", [
            ("Vanilla Oat Milk Cold Brew", "Steeped for 20 hours, blended with Madagascar vanilla bean syrup and oat milk.", 71, True, True, 4.8, "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80", "Mild", 180),
            ("Ceremonial Iced Matcha Latte", "First-harvest Uji ceremonial matcha whisked with almond milk and agave.", 112, True, True, 4.9, "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80", "Mild", 140)
        ]),
        ("Juice Republic & Elixirs", [
            ("Green Glow Cold Pressed Juice", "Organic kale, green apple, cucumber, lemon, and ginger juice.", 216, True, False, 4.7, "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80", "Mild", 110),
            ("Dragonfruit Acai Smoothie Bowl", "Pureed acai berries topped with dragonfruit cubes, chia seeds, and granola.", 145, True, True, 4.8, "https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80", "Mild", 320)
        ]),

        # Healthy Dishes
        ("Green Goddess Bowl Bar", [
            ("Warm Quinoa & Grilled Salmon Bowl", "Wild salmon fillet, tricolor quinoa, roasted sweet potatoes, avocado, lemon tahini.", 297, False, True, 4.9, "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80", "Mild", 480),
            ("Mediterranean Falafel & Hummus Bowl", "Housemade crispy chickpea falafel, beetroot hummus, cucumbers, sumac salad.", 71, True, True, 4.8, "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80", "Mild", 420)
        ]),
        ("The Avocado Social", [
            ("Sourdough Avocado Toast Con Egg", "Thick artisan sourdough slice, smashed hass avocado, poached egg, chili flakes.", 202, False, True, 4.8, "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80", "Medium", 390),
            ("Spicy Ahi Tuna Poke Bowl", "Sushigrade tuna cubes, edamame, seaweed salad, spicy mayo, furikake.", 80, False, True, 4.9, "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80", "Spicy", 520)
        ]),
        ("Clean Protein Kitchen", [
            ("Grilled Chicken Wrap", "Whole wheat wrap with grilled chicken breast and tzatziki.", 164, False, True, 4.6, "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80", "Mild", 230),
            ("Lentil & Quinoa Bowl", "High protein plant bowl with roasted vegetables.", 74, True, False, 4.5, "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80", "Mild", 210)
        ]),
        ("Shri Ji Pure Veg", [
            ("Plain Maggi", "Classic hot and spicy plain Maggi noodles.", 40, True, True, 4.5, "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80", "Medium", 300),
            ("Veg Maggi", "Maggi noodles cooked with mixed fresh vegetables.", 40, True, True, 4.6, "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80", "Medium", 320),
            ("Paneer Maggi", "Maggi loaded with soft paneer chunks and spices.", 80, True, False, 4.7, "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80", "Spicy", 380),
            ("Corn Cheese Maggi", "Cheesy Maggi loaded with sweet corn.", 90, True, True, 4.8, "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=800&q=80", "Mild", 400),
            ("Veg Chinese Pasta", "Indo-Chinese style spicy veg pasta.", 50, True, False, 4.4, "https://images.unsplash.com/photo-1555949258-eb67b1ef0ce7?auto=format&fit=crop&w=800&q=80", "Spicy", 350),
            ("Red Sauce Pasta", "Tangy tomato-based red sauce pasta with herbs.", 70, True, True, 4.7, "https://images.unsplash.com/photo-1555949258-eb67b1ef0ce7?auto=format&fit=crop&w=800&q=80", "Medium", 380),
            ("Tandoori Pasta", "Fusion pasta with smoky tandoori flavors.", 80, True, False, 4.5, "https://images.unsplash.com/photo-1555949258-eb67b1ef0ce7?auto=format&fit=crop&w=800&q=80", "Spicy", 400),
            ("White Sauce Pasta", "Creamy and cheesy white sauce pasta.", 80, True, True, 4.8, "https://images.unsplash.com/photo-1555949258-eb67b1ef0ce7?auto=format&fit=crop&w=800&q=80", "Mild", 450),
            ("Veg Chowmein", "Classic street-style vegetable chowmein.", 50, True, True, 4.6, "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80", "Medium", 400),
            ("Hakka Noodles", "Stir-fried noodles with crisp veggies and soy sauce.", 60, True, False, 4.7, "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80", "Mild", 420),
            ("Paneer Noodles", "Noodles tossed with spiced paneer cubes.", 70, True, False, 4.8, "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80", "Medium", 480),
            ("Manchurian Noodles", "A delicious combo of Hakka Noodles and Veg Manchurian.", 80, True, True, 4.9, "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80", "Spicy", 550),
            ("French Fries", "Classic salted potato fries.", 50, True, True, 4.5, "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=800&q=80", "Mild", 310),
            ("Peri Peri Fries", "Crispy fries tossed in spicy peri peri seasoning.", 60, True, True, 4.7, "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=800&q=80", "Spicy", 320),
            ("Tandoori French Fries", "Fries with a smoky tandoori twist.", 70, True, False, 4.6, "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=800&q=80", "Medium", 340),
            ("Cheese Fries", "French fries topped with melted cheese.", 80, True, True, 4.8, "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=800&q=80", "Mild", 410),
            ("Simple Burger", "Classic veg patty burger with fresh veggies.", 40, True, False, 4.3, "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80", "Mild", 350),
            ("Tikki Burger", "Aloo tikki burger with tangy sauces.", 60, True, True, 4.6, "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80", "Medium", 380),
            ("Tandoori Tikki Burger", "Tikki burger infused with tandoori mayo.", 70, True, False, 4.7, "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80", "Medium", 400),
            ("Tandoori Cheese Burger", "Tandoori burger with a slice of melting cheese.", 80, True, True, 4.8, "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80", "Medium", 430),
            ("Paneer Cheese Burger", "Premium burger with paneer patty and extra cheese.", 90, True, True, 4.9, "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80", "Mild", 480),
            ("Mini Pizza", "Small-sized classic cheese and veg pizza.", 100, True, False, 4.4, "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80", "Mild", 400),
            ("Big Pizza", "Large veg loaded pizza for sharing.", 150, True, True, 4.7, "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80", "Medium", 800),
            ("Corn Cheese Paneer Pizza", "Delightful pizza topped with corn, cheese, and paneer.", 250, True, True, 4.9, "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80", "Mild", 900),
            ("Tandoori Cheese Paneer Pizza", "Desi style tandoori paneer and cheese pizza.", 300, True, True, 4.9, "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80", "Medium", 950),
            ("Chole Bhature", "Spicy Punjabi chole served with two fluffy bhature.", 70, True, True, 4.8, "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80", "Spicy", 600),
            ("Extra Bhatura", "One extra fluffy bhatura.", 40, True, False, 4.5, "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80", "Mild", 250),
            ("Manchurian Dry", "Crispy veg balls tossed in dark soy and garlic.", 50, True, True, 4.6, "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80", "Spicy", 300),
            ("Manchurian Gravy", "Veg balls in a rich and spicy Chinese gravy.", 60, True, False, 4.5, "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80", "Spicy", 350),
            ("Paneer Tikka", "Char-grilled paneer cubes marinated in spices.", 100, True, True, 4.8, "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80", "Medium", 400),
            ("Simple Bhel", "Light and tangy street style bhelpuri.", 207, True, False, 4.4, "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=800&q=80", "Medium", 200),
            ("Chana Bhel", "Bhelpuri with boiled chana for extra protein.", 40, True, False, 4.5, "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=800&q=80", "Medium", 250),
            ("Paneer Bhel", "Bhelpuri loaded with fresh paneer bits.", 60, True, True, 4.7, "https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&w=800&q=80", "Medium", 300),
            ("Hot Coffee", "Steaming cup of freshly brewed hot coffee.", 64, True, False, 4.6, "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80", "Mild", 100),
            ("Cold Coffee", "Refreshing chilled blended coffee.", 50, True, True, 4.8, "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80", "Mild", 250),
            ("Cold Coffee with Ice Cream", "Cold coffee topped with a thick scoop of vanilla ice cream.", 80, True, True, 4.9, "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80", "Mild", 400),
            ("Sada Patties", "Plain puff pastry filled with spiced potatoes.", 245, True, False, 4.2, "https://images.unsplash.com/photo-1628191081698-ef22485eb1f8?auto=format&fit=crop&w=800&q=80", "Mild", 250),
            ("Mayonnaise Patties", "Potato puff pastry with a generous filling of mayonnaise.", 175, True, False, 4.4, "https://images.unsplash.com/photo-1628191081698-ef22485eb1f8?auto=format&fit=crop&w=800&q=80", "Mild", 300),
            ("Masala Patties", "Puff pastry with an extra spicy potato and peas filling.", 40, True, True, 4.5, "https://images.unsplash.com/photo-1628191081698-ef22485eb1f8?auto=format&fit=crop&w=800&q=80", "Spicy", 260),
            ("Tandoori Patties", "Puff pastry flavored with smoky tandoori spices.", 45, True, False, 4.6, "https://images.unsplash.com/photo-1628191081698-ef22485eb1f8?auto=format&fit=crop&w=800&q=80", "Medium", 280),
            ("Cheese Patties", "Puff pastry filled with melted cheese.", 50, True, True, 4.8, "https://images.unsplash.com/photo-1628191081698-ef22485eb1f8?auto=format&fit=crop&w=800&q=80", "Mild", 350),
            ("Paneer Patties", "Puff pastry filled with spiced paneer crumble.", 60, True, True, 4.7, "https://images.unsplash.com/photo-1628191081698-ef22485eb1f8?auto=format&fit=crop&w=800&q=80", "Medium", 330),
            ("Corn Cheese Patties", "Patties with sweet corn and cheese filling.", 60, True, False, 4.6, "https://images.unsplash.com/photo-1628191081698-ef22485eb1f8?auto=format&fit=crop&w=800&q=80", "Mild", 360),
            ("Tandoori Paneer Patties", "Paneer patties seasoned with tandoori spices.", 60, True, True, 4.8, "https://images.unsplash.com/photo-1628191081698-ef22485eb1f8?auto=format&fit=crop&w=800&q=80", "Medium", 350),
            ("Cheese Paneer Patties", "Loaded with both paneer and cheese.", 70, True, True, 4.9, "https://images.unsplash.com/photo-1628191081698-ef22485eb1f8?auto=format&fit=crop&w=800&q=80", "Mild", 400),
            ("Paneer Cheese Tandoori Patties", "The ultimate patties with paneer, cheese, and tandoori flavor.", 80, True, True, 4.9, "https://images.unsplash.com/photo-1628191081698-ef22485eb1f8?auto=format&fit=crop&w=800&q=80", "Medium", 420),
            ("Simple Sandwich", "Classic veg sandwich with chutney and butter.", 40, True, False, 4.4, "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80", "Mild", 300),
            ("Tandoori Sandwich", "Sandwich with a spicy tandoori filling.", 60, True, True, 4.6, "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80", "Medium", 340),
            ("Cheese Paneer Sandwich", "Grilled sandwich loaded with paneer and cheese.", 70, True, True, 4.8, "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80", "Mild", 420),
            ("Corn Cheese Paneer Sandwich", "Deluxe sandwich with corn, cheese, and paneer.", 80, True, True, 4.9, "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80", "Mild", 450),
            ("Paneer Tandoori Cheese Sandwich", "Premium sandwich with tandoori paneer and melting cheese.", 90, True, True, 4.9, "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80", "Medium", 480),
            ("Pav Bhaji", "Mumbai style spicy vegetable mash served with buttered pav.", 50, True, True, 4.7, "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80", "Spicy", 500),
            ("Cheese Pav Bhaji", "Pav bhaji topped with a generous layer of grated cheese.", 70, True, True, 4.8, "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80", "Medium", 580),
            ("Paneer Pav Bhaji", "Pav bhaji enriched with paneer cubes.", 80, True, True, 4.9, "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80", "Medium", 600),
            ("Extra Pav", "One pair of extra butter-toasted pav.", 219, True, False, 4.5, "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80", "Mild", 150)
        ])
    ]
    
    dishes_dataset.extend(old_dishes_dataset)

    total_dishes = 0
    for r_name, dishes in dishes_dataset:
        if r_name in rest_id_map:
            rest_id, cat_id = rest_id_map[r_name]
            for d_name, desc, price, veg, bestseller, rating, img, spice, cal in dishes:
                cur.execute("""
                    INSERT INTO food_items (restaurant_id, category_id, name, description, price, is_veg, is_bestseller, rating, image_url, spice_level, calories)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (rest_id, cat_id, d_name, desc, price, 1 if veg else 0, 1 if bestseller else 0, rating, img, spice, cal))
                total_dishes += 1

    # 5. Seed Coupons
    coupons = [
        ("SHRIJI20", 20, 15.00, 20.00),
        ("FIRST50", 50, 25.00, 30.00),
        ("FEAST15", 15, 10.00, 15.00),
        ("FREEDEL", 100, 5.00, 0.00)
    ]
    for code, pct, max_d, min_o in coupons:
        cur.execute("INSERT INTO coupons (code, discount_percent, max_discount, min_order_amount) VALUES (?, ?, ?, ?)", (code, pct, max_d, min_o))

    # 6. Seed Sample Notifications
    notifications = [
        (1, "Welcome to Shri Ji!", "Enjoy 20% off your first order using code SHRIJI20.", "promo"),
        (1, "Order #SAV-9821 Delivered", "Your order from Lucia Woodfire Pizzeria was delivered successfully. Bon appétit!", "order")
    ]
    for uid, title, msg, ntype in notifications:
        cur.execute("INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)", (uid, title, msg, ntype))

    # 7. Seed Sample Reviews
    reviews = [
        (1, 1, "Alex Morgan", 5.0, "Absolute perfection! The Truffle & Wild Mushroom pizza has a heavenly crust."),
        (1, 5, "Alex Morgan", 4.9, "Double Truffle Smash burger was juicy, fresh, and arrived steaming hot in 20 mins!")
    ]
    for uid, rid, uname, rat, comm in reviews:
        cur.execute("INSERT INTO reviews (user_id, restaurant_id, user_name, rating, comment) VALUES (?, ?, ?, ?, ?)", (uid, rid, uname, rat, comm))

    conn.commit()
    conn.close()
    print(f"Seeding completed! Created {len(restaurants_data)} restaurants and {total_dishes} food items.")

if __name__ == "__main__":
    seed()
