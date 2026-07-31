# Shri ji - AI-Powered Food Delivery Application

Shri ji is a modern, high-performance food delivery application featuring a dynamic React frontend and a scalable Python/Flask backend. It incorporates an advanced AI Recommendation Engine, real-time caching, and a fully functional Progressive Web App (PWA) architecture.

## 🚀 Features

### 🧠 Advanced AI Recommendation Engine
- **Context-Aware Suggestions:** Dynamically recommends food items based on the time of day (Breakfast, Lunch, Evening Snacks, Late Night).
- **Personalized Scoring:** Ranks dishes based on ratings, bestseller status, and keyword matching.
- **Trending Highlights:** Identifies and showcases top-trending restaurants.

### 🍔 Frontend (React + Vite)
- **Fast & Responsive UI:** Built with React 19 and Vite for lightning-fast HMR and optimized builds.
- **Progressive Web App (PWA):** Includes `manifest.json` and service worker (`sw.js`) support for offline capabilities and app-like experience.
- **Modern Styling:** Sleek, responsive design utilizing the latest web standards.
- **Components:** Modular architecture including Modals (e.g., `RestaurantModal`), dynamic routing, and state management.

### ⚙️ Backend (Python + Flask)
- **Robust API:** RESTful endpoints for Authentication, Restaurants, Categories, Orders, Cart, Wishlist, and Coupons.
- **Optimized Performance:** 
  - GZIP Compression for payload minimization.
  - LRU Caching decorators for heavy read endpoints (categories, restaurants, dishes).
  - WAL Mode enabled in SQLite for concurrent reads/writes.
- **Production Server:** Configured with `waitress` for high-concurrency production serving (`serve.py`).
- **Database:** SQLite (`shri_ji.db`) with structured tables for Users, Orders, Food Items, Categories, and Admin metrics.

### 🛒 Core Functionality
- **User Authentication:** Secure JWT/Bearer-token-like auth and password hashing.
- **Order Management:** Complete checkout flow, order status tracking, and history.
- **Wishlist & Favorites:** Save your favorite restaurants.
- **Coupons & Notifications:** In-app notification system and coupon validation engine.
- **Admin Dashboard:** Revenue tracking, order management, and restaurant onboarding.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, FontAwesome, React-Icons
- **Backend:** Python 3, Flask, Flask-CORS, Waitress
- **Database:** SQLite3
- **Security:** Werkzeug Security (Password Hashing)

## 📂 Project Structure

```text
shree-ji/
├── backend/
│   ├── app.py             # Main Flask application & API routes
│   ├── ai_engine.py       # AI Food Recommendation logic
│   ├── models.py          # Database models (User, Restaurant, Order, etc.)
│   ├── database.py        # SQLite connection & helper methods
│   ├── serve.py           # Waitress production server script
│   ├── seed_data.py       # Initial database population script
│   ├── schema.sql         # SQL schema definitions
│   └── shri_ji.db         # SQLite database
├── frontend/
│   ├── src/               # React source code & components
│   ├── public/            # Static assets
│   ├── index.html         # Main HTML template
│   ├── package.json       # Node dependencies and scripts
│   └── vite.config.js     # Vite configuration
├── LICENSE                # MIT License
└── README.md              # Project documentation
```

## 🚀 How to Run Locally

### 1. Start the Backend

```bash
cd backend
python serve.py
```
*The backend will start on `http://localhost:5050`*

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```
*The frontend will start on `http://localhost:5173` (Vite default)*

## 📄 License

This project is licensed under the [MIT License](LICENSE).
