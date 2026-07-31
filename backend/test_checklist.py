import unittest
import json
import os
import sys

# Ensure app can be imported
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
from database import query_db, execute_db

class TestVerificationChecklist(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = app.test_client()
        cls.app_context = app.app_context()
        cls.app_context.push()

    @classmethod
    def tearDownClass(cls):
        cls.app_context.pop()

    # Checklist Item 1: Authentication API
    def test_01_auth_system(self):
        # Test Register
        reg_res = self.client.post('/api/auth/register', json={
            'name': 'Verification Tester',
            'email': 'verify_test@shriji.com',
            'password': 'password123',
            'phone': '9876543210',
            'address': '123 Tech Park'
        })
        self.assertIn(reg_res.status_code, [201, 400])

        # Test Login
        login_res = self.client.post('/api/auth/login', json={
            'email': 'alex@example.com',
            'password': 'password123'
        })
        self.assertEqual(login_res.status_code, 200)
        data = login_res.get_json()
        self.assertIn('user', data)
        self.assertEqual(data['user']['email'], 'alex@example.com')

        # Test Session Me
        me_res = self.client.get('/api/auth/me', headers={'Authorization': f"Bearer {data['user']['id']}"})
        self.assertEqual(me_res.status_code, 200)
        self.assertTrue(me_res.get_json()['authenticated'])

    # Checklist Item 2: Categories API
    def test_02_categories_api(self):
        res = self.client.get('/api/categories')
        self.assertEqual(res.status_code, 200)
        categories = res.get_json()
        self.assertIsInstance(categories, list)
        self.assertGreater(len(categories), 0)

    # Checklist Item 3: Restaurants API
    def test_03_restaurants_api(self):
        # Fetch all
        res = self.client.get('/api/restaurants')
        self.assertEqual(res.status_code, 200)
        restaurants = res.get_json()
        self.assertGreater(len(restaurants), 0)

        # Detail endpoint
        rest_id = restaurants[0]['id']
        detail_res = self.client.get(f'/api/restaurants/{rest_id}')
        self.assertEqual(detail_res.status_code, 200)
        detail = detail_res.get_json()
        self.assertEqual(detail['id'], rest_id)
        self.assertIn('menu', detail)

    # Checklist Item 4: Search & Dishes API
    def test_04_dishes_search(self):
        res = self.client.get('/api/dishes?search=Burger')
        self.assertEqual(res.status_code, 200)
        dishes = res.get_json()
        self.assertIsInstance(dishes, list)

        res_veg = self.client.get('/api/dishes?is_veg=true')
        self.assertEqual(res_veg.status_code, 200)

    # Checklist Item 5: AI Recommendations Engine
    def test_05_ai_recommendations(self):
        res = self.client.get('/api/recommendations', headers={'Authorization': 'Bearer 1'})
        self.assertEqual(res.status_code, 200)
        rec = res.get_json()
        self.assertIn('meal_context', rec)
        self.assertIn('recommended_dishes', rec)
        self.assertGreater(len(rec['recommended_dishes']), 0)

    # Checklist Item 6: Orders & Checkout API
    def test_06_orders_and_checkout(self):
        payload = {
            'restaurant_id': 1,
            'items': [{'id': 101, 'name': 'Truffle Pasta', 'price': 18.5, 'qty': 2}],
            'subtotal': 37.0,
            'tax': 1.5,
            'delivery_fee': 2.0,
            'discount': 5.0,
            'total_amount': 35.5,
            'address': '456 Gourmet Ave',
            'payment_method': 'Card'
        }
        res = self.client.post('/api/orders', json=payload, headers={'Authorization': 'Bearer 1'})
        self.assertEqual(res.status_code, 201)
        order_data = res.get_json()
        self.assertIn('order', order_data)

        # Get Order status
        order_id = order_data['order']['id']
        status_res = self.client.get(f'/api/orders/{order_id}')
        self.assertEqual(status_res.status_code, 200)

    # Checklist Item 7: Wishlist API
    def test_07_wishlist_api(self):
        # Add rest 1 to wishlist
        res_add = self.client.post('/api/wishlist', json={'restaurant_id': 1}, headers={'Authorization': 'Bearer 1'})
        self.assertEqual(res_add.status_code, 200)

        # Get wishlist
        res_get = self.client.get('/api/wishlist', headers={'Authorization': 'Bearer 1'})
        self.assertEqual(res_get.status_code, 200)
        favs = res_get.get_json()
        self.assertIsInstance(favs, list)

    # Checklist Item 8: Coupons Verification API
    def test_08_coupons_verify(self):
        # Valid coupon
        res = self.client.post('/api/coupons/verify', json={'code': 'SHRIJI20', 'amount': 40.0})
        self.assertEqual(res.status_code, 200)
        coupon_data = res.get_json()
        self.assertTrue(coupon_data['valid'])

        # Invalid coupon
        res_invalid = self.client.post('/api/coupons/verify', json={'code': 'INVALID100', 'amount': 40.0})
        self.assertEqual(res_invalid.status_code, 400)

    # Checklist Item 9: Admin Dashboard & Operations
    def test_09_admin_dashboard_and_management(self):
        # Admin login
        login_res = self.client.post('/api/auth/login', json={
            'email': 'admin@shriji.com',
            'password': 'admin123'
        })
        self.assertEqual(login_res.status_code, 200)
        admin_token = login_res.get_json()['token']

        # Admin Dashboard Stats
        res_dash = self.client.get('/api/admin/dashboard', headers={'Authorization': f'Bearer {admin_token}'})
        self.assertEqual(res_dash.status_code, 200)
        dash = res_dash.get_json()
        self.assertIn('total_revenue', dash)
        self.assertIn('total_orders', dash)

        # Update order status
        orders = query_db("SELECT id FROM orders LIMIT 1")
        if orders:
            oid = orders[0]['id']
            res_status = self.client.put(f'/api/admin/orders/{oid}/status', json={'status': 'Preparing'}, headers={'Authorization': f'Bearer {admin_token}'})
            self.assertEqual(res_status.status_code, 200)

        # Add new restaurant
        res_add_rest = self.client.post('/api/admin/restaurants', json={
            'name': 'Test Gourmet Hub',
            'cuisine_type': 'Italian Fusion',
            'image_url': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
            'address': 'Downtown Financial District'
        }, headers={'Authorization': f'Bearer {admin_token}'})
        self.assertEqual(res_add_rest.status_code, 201)

    # Checklist Item 10: System Verification Checklist & User Notifications
    def test_10_system_verification(self):
        # Test Notifications API
        res_notif = self.client.get('/api/notifications', headers={'Authorization': 'Bearer 1'})
        self.assertEqual(res_notif.status_code, 200)
        notes = res_notif.get_json()
        self.assertIsInstance(notes, list)

        # Test User Profile Orders List API
        res_orders = self.client.get('/api/orders', headers={'Authorization': 'Bearer 1'})
        self.assertEqual(res_orders.status_code, 200)

if __name__ == '__main__':
    unittest.main()
