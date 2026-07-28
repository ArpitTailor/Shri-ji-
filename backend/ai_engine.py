import datetime
from database import query_db
import random

class AIFoodRecommender:
    @staticmethod
    def get_time_based_context():
        hour = datetime.datetime.now().hour
        if 5 <= hour < 11:
            return {
                "title": "Breakfast Favorites", 
                "subtitle": "Start your day with freshly brewed coffee, warm dosas, and breakfast bowls.",
                "keywords": ["coffee", "tea", "dosa", "idli", "poha", "breakfast", "sandwich", "toast", "pancakes"]
            }
        elif 11 <= hour < 16:
            return {
                "title": "Lunch Bestsellers", 
                "subtitle": "Hearty biryanis, full thalis, gourmet burgers, and healthy salads.",
                "keywords": ["thali", "biryani", "rice", "curry", "burger", "salad", "roti", "naan", "dal"]
            }
        elif 16 <= hour < 19:
            return {
                "title": "Evening Snacks & Refreshments", 
                "subtitle": "Crispy appetizers, boba teas, pizzas, and artisan pastries.",
                "keywords": ["snack", "tea", "coffee", "boba", "pizza", "fries", "samosa", "chaat", "pastry"]
            }
        else:
            return {
                "title": "Late Night Comfort Food", 
                "subtitle": "Sizzling noodles, decadent desserts, pizzas, and rich curry bowls.",
                "keywords": ["noodles", "pizza", "dessert", "ice cream", "cake", "biryani", "comfort", "bowl"]
            }

    @staticmethod
    def _score_item(item, keywords):
        score = 0
        text_to_search = (item.get('name', '') + " " + item.get('description', '') + " " + item.get('cuisine_type', '')).lower()
        
        # Base score from rating
        score += float(item.get('rating') or 0) * 2
        
        # Bonus for bestseller
        if item.get('is_bestseller'):
            score += 5
            
        # Keyword matching bonus (Personalization / Contextualization)
        for kw in keywords:
            if kw in text_to_search:
                score += 15 # High weight for contextual matching
                
        # Small random factor to keep recommendations fresh
        score += random.uniform(0, 5)
        
        return score

    @staticmethod
    def get_recommendations(user_id=None, limit=10):
        context = AIFoodRecommender.get_time_based_context()
        
        # Fetch a pool of candidate items
        sql = """
            SELECT f.*, r.name as restaurant_name, r.cuisine_type, r.delivery_time, r.rating as restaurant_rating
            FROM food_items f
            JOIN restaurants r ON f.restaurant_id = r.id
            WHERE f.rating >= 4.0 OR f.is_bestseller = 1
        """
        candidates = query_db(sql)
        
        # Score and rank candidates using advanced Python logic
        keywords = context["keywords"]
        scored_items = []
        for item in candidates:
            score = AIFoodRecommender._score_item(item, keywords)
            scored_items.append((score, item))
            
        # Sort by score descending
        scored_items.sort(key=lambda x: x[0], reverse=True)
        
        # Pick the top N
        recommended_items = [item for score, item in scored_items[:limit]]
        
        # Get top trending restaurants
        trending_sql = """
            SELECT * FROM restaurants
            WHERE rating >= 4.2
            ORDER BY total_ratings DESC, rating DESC
            LIMIT 6
        """
        trending_restaurants = query_db(trending_sql)
        
        return {
            "meal_context": {
                "title": context["title"],
                "subtitle": context["subtitle"]
            },
            "recommended_dishes": recommended_items,
            "trending_restaurants": trending_restaurants
        }
