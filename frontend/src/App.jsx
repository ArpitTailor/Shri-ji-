import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './index.css';

// Components
import Toast from './components/Toast';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import AiWidget from './components/AiWidget';
import RestaurantGrid from './components/RestaurantGrid';
import RestaurantModal from './components/RestaurantModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import AuthModal from './components/AuthModal';
import ProfileModal from './components/ProfileModal';
import WishlistModal from './components/WishlistModal';
import NotificationsModal from './components/NotificationsModal';
import AdminModal from './components/AdminModal';
import LocationModal from './components/LocationModal';

// Redux Actions
import {
  setTheme, setLocationText, showToast, hideToast,
  setSearchQuery, setActiveCategory, setActiveFilter, setActiveSort,
  toggleModal
} from './store/uiSlice';
import { setCredentials, logout } from './store/authSlice';
import { addToCart, updateQty, applyCoupon, clearCart } from './store/cartSlice';
import {
  setRestaurants, setCategories, setAiData, setOrders, addOrder, updateOrderStatus,
  addRestaurant, toggleWishlist, clearNotifications, setSelectedRestId, setDetailedRestaurant, setActiveTrackingOrder
} from './store/dataSlice';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export default function App() {
  const dispatch = useDispatch();
  
  // UI State
  const { theme, locationText, toastMessage, searchQuery, activeCategory, activeFilter, activeSort, modals } = useSelector(state => state.ui);

  // Auth State
  const { user, token } = useSelector(state => state.auth);

  // Cart State
  const cart = useSelector(state => state.cart);

  // Data State
  const { restaurants, categories, aiData, orders, wishlist, notifications, selectedRestId, detailedRestaurant, activeTrackingOrder } = useSelector(state => state.data);

  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PWA Prompt handling
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) {
      dispatch(showToast("App install prompt not available or app already installed."));
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      dispatch(showToast("Thank you for installing Shri Ji App!"));
    }
    setDeferredPrompt(null);
  };

  const handleShowToast = (msg) => {
    dispatch(showToast(msg));
  };

  // Fetch Initial Data
  useEffect(() => {
    fetchRestaurants();
    fetchCategories();
    fetchAiRecommendations();
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/restaurants`);
      if (res.ok) {
        const data = await res.json();
        dispatch(setRestaurants(data));
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/categories`);
      if (res.ok) {
        const data = await res.json();
        dispatch(setCategories(data));
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchAiRecommendations = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/ai/recommendations`);
      if (res.ok) {
        const data = await res.json();
        dispatch(setAiData(data));
      }
    } catch (err) {
      console.error('Error fetching AI recommendations:', err);
    }
  };

  const fetchUserProfile = async (authToken) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(setCredentials({ user: data.user, token: authToken }));
        dispatch(setOrders(data.orders || []));
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const fetchAllOrdersAdmin = async () => {
    if (!token || !user || user.role !== 'admin') return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        dispatch(setOrders(data.recent_orders || []));
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    }
  };

  // Auth Handlers
  const handleLogin = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        dispatch(setCredentials({ user: data.user, token: data.token }));
        dispatch(toggleModal({ modalName: 'auth', isOpen: false }));
        handleShowToast(`Welcome back, ${data.user.name}!`);
        if (data.user.role === 'admin') {
          fetchAllOrdersAdmin();
        } else {
          fetchUserProfile(data.token);
        }
      } else {
        handleShowToast(data.error || 'Login failed');
      }
    } catch (err) {
      handleShowToast('Network error during login');
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        dispatch(setCredentials({ user: data.user, token: data.token }));
        dispatch(toggleModal({ modalName: 'auth', isOpen: false }));
        handleShowToast(`Account created successfully! Welcome, ${data.user.name}!`);
      } else {
        handleShowToast(data.error || 'Registration failed');
      }
    } catch (err) {
      handleShowToast('Network error during registration');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setOrders([]));
    handleShowToast('You have been logged out.');
  };

  // Wishlist Handler
  const handleToggleWishlist = (restId) => {
    dispatch(toggleWishlist(restId));
    if (wishlist.includes(restId)) {
        handleShowToast('Removed from wishlist');
    } else {
        handleShowToast('Added to wishlist');
    }
  };

  // Cart Handlers
  const handleAddToCart = (itemId, itemName, itemPrice, restId, restName) => {
    if (cart.restaurant_id && cart.restaurant_id !== restId && cart.items.length > 0) {
      if (!window.confirm(`Your cart contains items from ${cart.restaurant_name}. Clear cart and add from ${restName}?`)) {
        return;
      }
      dispatch(addToCart({ itemId, itemName, itemPrice, restId, restName, override: true }));
      handleShowToast(`Added ${itemName} to cart`);
      return;
    }
    dispatch(addToCart({ itemId, itemName, itemPrice, restId, restName, override: false }));
    handleShowToast(`Added ${itemName} to cart`);
  };

  const handleBuyNow = (itemId, itemName, itemPrice, restId, restName) => {
    handleAddToCart(itemId, itemName, itemPrice, restId, restName);
    dispatch(toggleModal({ modalName: 'cart', isOpen: true }));
  };

  const handleUpdateQty = (itemId, change) => {
    dispatch(updateQty({ itemId, change }));
  };

  const handleApplyCoupon = (code, subtotal) => {
    if (code === 'SHRIJI20') {
      const discount = subtotal * 0.20;
      dispatch(applyCoupon({ code, discount }));
      handleShowToast('Coupon SHRIJI20 applied! 20% OFF');
    } else if (code === 'GOURMET10') {
      const discount = subtotal * 0.10;
      dispatch(applyCoupon({ code, discount }));
      handleShowToast('Coupon GOURMET10 applied! 10% OFF');
    } else {
      handleShowToast('Invalid or expired coupon code');
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.items.length === 0) {
      handleShowToast('Your cart is empty');
      return;
    }
    dispatch(toggleModal({ modalName: 'cart', isOpen: false }));
    dispatch(toggleModal({ modalName: 'checkout', isOpen: true }));
  };

  const handlePlaceOrder = async (orderPayload) => {
    const payload = {
      ...orderPayload,
      restaurant_id: cart.restaurant_id,
      restaurant_name: cart.restaurant_name,
      items: cart.items
    };

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const createdOrder = data.order || data;
        dispatch(toggleModal({ modalName: 'checkout', isOpen: false }));
        dispatch(clearCart());
        dispatch(addOrder(createdOrder));
        dispatch(setActiveTrackingOrder(createdOrder));
        handleShowToast(`Order Placed! #${createdOrder.order_code || createdOrder.id}`);
      } else {
        handleShowToast('Failed to place order. Please try again.');
      }
    } catch (err) {
      handleShowToast('Network error while placing order');
    }
  };

  // Admin Handlers
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        dispatch(updateOrderStatus({ orderId, status: newStatus }));
        handleShowToast(`Order #${orderId} status updated to ${newStatus}`);
      }
    } catch (err) {
      handleShowToast('Error updating status');
    }
  };

  const handleAddRestaurant = async (restData) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/restaurants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(restData)
      });
      if (res.ok) {
        const data = await res.json();
        const newRest = { ...restData, id: data.id || Date.now() };
        dispatch(addRestaurant(newRest));
        dispatch(toggleModal({ modalName: 'admin', isOpen: false }));
        handleShowToast(`Successfully published kitchen: ${newRest.name}`);
      } else {
        handleShowToast('Error creating restaurant');
      }
    } catch (err) {
      handleShowToast('Network error creating restaurant');
    }
  };

  // Filter and Sort Logic
  const filteredAndSortedRestaurants = useMemo(() => {
    let result = [...restaurants];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.name.toLowerCase().includes(q) ||
        r.cuisine_type.toLowerCase().includes(q) ||
        (r.menu && r.menu.some(m => m.name.toLowerCase().includes(q)))
      );
    }

    if (activeCategory !== 'all') {
      result = result.filter(r => 
        r.cuisine_type.toLowerCase().includes(activeCategory.toLowerCase()) ||
        r.name.toLowerCase().includes(activeCategory.toLowerCase())
      );
    }

    if (activeFilter === 'veg') {
      result = result.filter(r => r.is_pure_veg || (r.menu && r.menu.every(m => m.is_veg)));
    } else if (activeFilter === 'rating') {
      result = result.filter(r => r.rating >= 4.5);
    } else if (activeFilter === 'fast') {
      result = result.filter(r => r.delivery_time <= 25);
    }

    if (activeSort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (activeSort === 'delivery_time') {
      result.sort((a, b) => a.delivery_time - b.delivery_time);
    } else if (activeSort === 'cost_low') {
      result.sort((a, b) => a.price_for_two - b.price_for_two);
    } else if (activeSort === 'cost_high') {
      result.sort((a, b) => b.price_for_two - a.price_for_two);
    }

    return result;
  }, [restaurants, searchQuery, activeCategory, activeFilter, activeSort]);

  const selectedRestObj = restaurants.find(r => r.id === selectedRestId);

  const handleOpenRestaurant = async (id) => {
    dispatch(setSelectedRestId(id));
    dispatch(setDetailedRestaurant(null));
    try {
      const res = await fetch(`${API_BASE}/api/restaurants/${id}`);
      if (res.ok) {
        const data = await res.json();
        dispatch(setDetailedRestaurant(data));
      }
    } catch (err) {
      console.error('Failed to fetch restaurant details:', err);
    }
  };

  return (
    <div className="app-container">
      <Navbar
        theme={theme}
        onToggleTheme={() => dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))}
        locationText={locationText}
        onOpenLocationModal={() => dispatch(toggleModal({ modalName: 'location', isOpen: true }))}
        searchQuery={searchQuery}
        onSearchChange={(val) => dispatch(setSearchQuery(val))}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => dispatch(toggleModal({ modalName: 'wishlist', isOpen: true }))}
        cartCount={cart.items.reduce((sum, i) => sum + i.qty, 0)}
        onToggleCart={() => dispatch(toggleModal({ modalName: 'cart' }))}
        notifCount={notifications.length}
        onOpenNotifications={() => dispatch(toggleModal({ modalName: 'notifications', isOpen: true }))}
        user={user}
        onOpenAuth={() => dispatch(toggleModal({ modalName: 'auth', isOpen: true }))}
        onOpenProfile={() => dispatch(toggleModal({ modalName: 'profile', isOpen: true }))}
        onOpenAdmin={() => {
          fetchAllOrdersAdmin();
          dispatch(toggleModal({ modalName: 'admin', isOpen: true }));
        }}
        onLogout={handleLogout}
        canInstallPwa={!!deferredPrompt}
        onInstallPwa={handleInstallPwa}
      />

      <main className="main-wrapper">
        <Hero 
          onExploreClick={() => {
            const el = document.getElementById('restaurantGridSection');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          canInstallPwa={!!deferredPrompt}
          onInstallPwa={handleInstallPwa}
        />

        <Categories
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={(slug) => {
            dispatch(setActiveCategory(slug));
            const el = document.getElementById('restaurantGridSection');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <AiWidget
          aiData={aiData}
          onRefresh={fetchAiRecommendations}
          onAddToCart={handleAddToCart}
        />

        <RestaurantGrid
          restaurants={filteredAndSortedRestaurants}
          activeFilter={activeFilter}
          onSelectFilter={(val) => dispatch(setActiveFilter(val))}
          activeSort={activeSort}
          onSelectSort={(val) => dispatch(setActiveSort(val))}
          wishlist={new Set(wishlist)}
          onToggleWishlist={handleToggleWishlist}
          onOpenRestaurant={handleOpenRestaurant}
        />
      </main>

      {/* Modals & Drawers */}
      <RestaurantModal
        isOpen={!!selectedRestId}
        restaurant={detailedRestaurant || selectedRestObj}
        onClose={() => dispatch(setSelectedRestId(null))}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      <CartDrawer
        isOpen={modals.cart}
        onClose={() => dispatch(toggleModal({ modalName: 'cart', isOpen: false }))}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onApplyCoupon={handleApplyCoupon}
        onProceedCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={modals.checkout}
        onClose={() => dispatch(toggleModal({ modalName: 'checkout', isOpen: false }))}
        cart={cart}
        user={user}
        onPlaceOrder={handlePlaceOrder}
      />

      <OrderTrackerModal
        isOpen={!!activeTrackingOrder}
        onClose={() => dispatch(setActiveTrackingOrder(null))}
        order={activeTrackingOrder}
        onOrderDelivered={() => {
          handleShowToast('Order Delivered! Bon Appétit!');
        }}
      />

      <AuthModal
        isOpen={modals.auth}
        onClose={() => dispatch(toggleModal({ modalName: 'auth', isOpen: false }))}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      <ProfileModal
        isOpen={modals.profile}
        onClose={() => dispatch(toggleModal({ modalName: 'profile', isOpen: false }))}
        user={user}
        orders={orders}
      />

      <WishlistModal
        isOpen={modals.wishlist}
        onClose={() => dispatch(toggleModal({ modalName: 'wishlist', isOpen: false }))}
        wishlist={new Set(wishlist)}
        restaurants={restaurants}
        onOpenRestaurant={(id) => dispatch(setSelectedRestId(id))}
        onToggleWishlist={handleToggleWishlist}
      />

      <NotificationsModal
        isOpen={modals.notifications}
        onClose={() => dispatch(toggleModal({ modalName: 'notifications', isOpen: false }))}
        notifications={notifications}
        onClear={() => {
          dispatch(clearNotifications());
          handleShowToast('Notifications cleared');
        }}
      />

      <AdminModal
        isOpen={modals.admin}
        onClose={() => dispatch(toggleModal({ modalName: 'admin', isOpen: false }))}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onAddRestaurant={handleAddRestaurant}
      />

      <LocationModal
        isOpen={modals.location}
        onClose={() => dispatch(toggleModal({ modalName: 'location', isOpen: false }))}
        currentLocation={locationText}
        onSelectLocation={(loc) => {
          dispatch(setLocationText(loc));
          dispatch(toggleModal({ modalName: 'location', isOpen: false }));
          handleShowToast(`Location updated to ${loc}`);
        }}
      />

      <Toast message={toastMessage} onClose={() => dispatch(hideToast())} />
    </div>
  );
}
