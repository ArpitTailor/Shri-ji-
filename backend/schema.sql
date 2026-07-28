-- Schema for Savoria Food Delivery Platform
-- Compatible with SQLite and MySQL

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'customer', -- 'customer' or 'admin'
    phone TEXT,
    address TEXT,
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    cuisine_type TEXT NOT NULL,
    rating REAL DEFAULT 4.5,
    total_ratings INTEGER DEFAULT 120,
    delivery_time INTEGER DEFAULT 30, -- in minutes
    distance_km REAL DEFAULT 2.5,
    price_for_two INTEGER DEFAULT 400,
    offer_text TEXT,
    is_open BOOLEAN DEFAULT 1,
    is_promoted BOOLEAN DEFAULT 0,
    image_url TEXT NOT NULL,
    banner_url TEXT,
    address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    image_url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS food_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    is_veg BOOLEAN DEFAULT 1,
    is_bestseller BOOLEAN DEFAULT 0,
    rating REAL DEFAULT 4.5,
    image_url TEXT NOT NULL,
    spice_level TEXT DEFAULT 'Medium', -- 'Mild', 'Medium', 'Spicy'
    calories INTEGER DEFAULT 350,
    preparation_time INTEGER DEFAULT 20,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_code TEXT UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    restaurant_id INTEGER NOT NULL,
    total_amount REAL NOT NULL,
    subtotal REAL NOT NULL,
    tax REAL NOT NULL,
    delivery_fee REAL NOT NULL,
    discount REAL DEFAULT 0,
    status TEXT DEFAULT 'Placed', -- 'Placed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'
    payment_method TEXT DEFAULT 'Card', -- 'Card', 'UPI', 'COD'
    payment_status TEXT DEFAULT 'Paid',
    delivery_address TEXT NOT NULL,
    items_json TEXT NOT NULL,
    estimated_delivery_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    restaurant_id INTEGER NOT NULL,
    user_name TEXT NOT NULL,
    rating REAL NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    restaurant_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, restaurant_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- 'order', 'promo', 'info'
    is_read BOOLEAN DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS coupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    discount_percent INTEGER NOT NULL,
    max_discount REAL DEFAULT 200,
    min_order_amount REAL DEFAULT 299,
    is_active BOOLEAN DEFAULT 1
);
