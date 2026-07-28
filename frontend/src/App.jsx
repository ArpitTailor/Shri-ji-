import React, { useState, useEffect, useMemo } from 'react';
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

export default function App() {
  // Theme & Location
  const [theme, setTheme] = useState(() => localStorage.getItem('savoria_theme') || 'dark');
  const [locationText, setLocationText] = useState(() => localStorage.getItem('savoria_location') || 'Downtown, Tech District');
  
  // Data State
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [aiData, setAiData] = useState(null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('savoria_user_data');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('savoria_token') || null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('savoria_wishlist');
    return new Set(saved ? JSON.parse(saved) : [1, 3]);
  });
  const [notifications, setNotifications] = useState([
    { title: 'Welcome to Savoria!', message: 'Explore artisan kitchens and enjoy 20% off your first gourmet delivery.' },
    { title: 'Live AI Pairing Ready', message: 'Check out our AI recommendations tailored for your evening dining.' }
  ]);
  
  // Cart State
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('savoria_cart');
    return saved ? JSON.parse(saved) : { items: [], restaurant_id: null, restaurant_name: null, discountAmount: 0, appliedCoupon: null };
  });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSort, setActiveSort] = useState('relevance');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedRestId, setSelectedRestId] = useState(null);
  const [detailedRestaurant, setDetailedRestaurant] = useState(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);

  // Toast & PWA
  const [toastMessage, setToastMessage] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Apply theme to html tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('savoria_theme', theme);
  }, [theme]);

  // Save location to localStorage
  useEffect(() => {
    localStorage.setItem('savoria_location', locationText);
  }, [locationText]);

  // Save wishlist & cart
  useEffect(() => {
    localStorage.setItem('savoria_wishlist', JSON.stringify(Array.from(wishlist)));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('savoria_cart', JSON.stringify(cart));
  }, [cart]);

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
      showToast("App install prompt not available or app already installed.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      showToast("Thank you for installing Savoria App!");
    }
    setDeferredPrompt(null);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
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
      const res = await fetch('/api/restaurants');
      if (res.ok) {
        const data = await res.json();
        setRestaurants(data);
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchAiRecommendations = async () => {
    try {
      const res = await fetch('/api/ai/recommendations');
      if (res.ok) {
        const data = await res.json();
        setAiData(data);
      }
    } catch (err) {
      console.error('Error fetching AI recommendations:', err);
    }
  };

  const fetchUserProfile = async (authToken) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setOrders(data.orders || []);
        localStorage.setItem('savoria_user_data', JSON.stringify(data.user));
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
      const res = await fetch('/api/admin/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.recent_orders || []);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    }
  };

  // Auth Handlers
  const handleLogin = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('savoria_token', data.token);
        localStorage.setItem('savoria_user_data', JSON.stringify(data.user));
        setIsAuthOpen(false);
        showToast(`Welcome back, ${data.user.name}!`);
        if (data.user.role === 'admin') {
          fetchAllOrdersAdmin();
        } else {
          fetchUserProfile(data.token);
        }
      } else {
        showToast(data.error || 'Login failed');
      }
    } catch (err) {
      showToast('Network error during login');
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('savoria_token', data.token);
        localStorage.setItem('savoria_user_data', JSON.stringify(data.user));
        setIsAuthOpen(false);
        showToast(`Account created successfully! Welcome, ${data.user.name}!`);
      } else {
        showToast(data.error || 'Registration failed');
      }
    } catch (err) {
      showToast('Network error during registration');
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    setOrders([]);
    localStorage.removeItem('savoria_token');
    localStorage.removeItem('savoria_user_data');
    showToast('You have been logged out.');
  };

  // Wishlist Handler
  const handleToggleWishlist = (restId) => {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(restId)) {
        next.delete(restId);
        showToast('Removed from wishlist');
      } else {
        next.add(restId);
        showToast('Added to wishlist');
      }
      return next;
    });
  };

  // Cart Handlers
  const handleAddToCart = (itemId, itemName, itemPrice, restId, restName) => {
    setCart(prev => {
      // Check if ordering from a different kitchen
      if (prev.restaurant_id && prev.restaurant_id !== restId && prev.items.length > 0) {
        if (!window.confirm(`Your cart contains items from ${prev.restaurant_name}. Clear cart and add from ${restName}?`)) {
          return prev;
        }
        const newCart = {
          items: [{ id: itemId, name: itemName, price: itemPrice, qty: 1 }],
          restaurant_id: restId,
          restaurant_name: restName,
          discountAmount: 0,
          appliedCoupon: null
        };
        showToast(`Added ${itemName} to cart`);
        return newCart;
      }

      const existingIndex = prev.items.findIndex(i => i.id === itemId);
      let updatedItems;
      if (existingIndex > -1) {
        updatedItems = prev.items.map((item, idx) => 
          idx === existingIndex ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        updatedItems = [...prev.items, { id: itemId, name: itemName, price: itemPrice, qty: 1 }];
      }

      showToast(`Added ${itemName} to cart`);
      return {
        ...prev,
        items: updatedItems,
        restaurant_id: restId,
        restaurant_name: restName
      };
    });
  };

  const handleBuyNow = (itemId, itemName, itemPrice, restId, restName) => {
    handleAddToCart(itemId, itemName, itemPrice, restId, restName);
    setIsCartOpen(true);
  };

  const handleUpdateQty = (itemId, change) => {
    setCart(prev => {
      const updatedItems = prev.items
        .map(i => i.id === itemId ? { ...i, qty: i.qty + change } : i)
        .filter(i => i.qty > 0);
      
      const isCartEmpty = updatedItems.length === 0;
      return {
        ...prev,
        items: updatedItems,
        restaurant_id: isCartEmpty ? null : prev.restaurant_id,
        restaurant_name: isCartEmpty ? null : prev.restaurant_name,
        discountAmount: isCartEmpty ? 0 : prev.discountAmount,
        appliedCoupon: isCartEmpty ? null : prev.appliedCoupon
      };
    });
  };

  const handleApplyCoupon = (code, subtotal) => {
    if (code === 'SAVORIA20') {
      const discount = subtotal * 0.20;
      setCart(prev => ({ ...prev, discountAmount: discount, appliedCoupon: code }));
      showToast('Coupon SAVORIA20 applied! 20% OFF');
    } else if (code === 'GOURMET10') {
      const discount = subtotal * 0.10;
      setCart(prev => ({ ...prev, discountAmount: discount, appliedCoupon: code }));
      showToast('Coupon GOURMET10 applied! 10% OFF');
    } else {
      showToast('Invalid or expired coupon code');
    }
  };

  const handleProceedToCheckout = () => {
    if (cart.items.length === 0) {
      showToast('Your cart is empty');
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
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

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        const createdOrder = data.order || data;
        setIsCheckoutOpen(false);
        setCart({ items: [], restaurant_id: null, restaurant_name: null, discountAmount: 0, appliedCoupon: null });
        setOrders(prev => [createdOrder, ...prev]);
        setActiveTrackingOrder(createdOrder);
        showToast(`Order Placed! #${createdOrder.order_code || createdOrder.id}`);
      } else {
        showToast('Failed to place order. Please try again.');
      }
    } catch (err) {
      showToast('Network error while placing order');
    }
  };

  // Admin Handlers
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        showToast(`Order #${orderId} status updated to ${newStatus}`);
      }
    } catch (err) {
      showToast('Error updating status');
    }
  };

  const handleAddRestaurant = async (restData) => {
    try {
      const res = await fetch('/api/admin/restaurants', {
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
        setRestaurants(prev => [newRest, ...prev]);
        setIsAdminOpen(false);
        showToast(`Successfully published kitchen: ${newRest.name}`);
      } else {
        showToast('Error creating restaurant');
      }
    } catch (err) {
      showToast('Network error creating restaurant');
    }
  };

  // Filter and Sort Logic
  const filteredAndSortedRestaurants = useMemo(() => {
    let result = [...restaurants];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r => 
        r.name.toLowerCase().includes(q) ||
        r.cuisine_type.toLowerCase().includes(q) ||
        (r.menu && r.menu.some(m => m.name.toLowerCase().includes(q)))
      );
    }

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter(r => 
        r.cuisine_type.toLowerCase().includes(activeCategory.toLowerCase()) ||
        r.name.toLowerCase().includes(activeCategory.toLowerCase())
      );
    }

    // Quick filter bar
    if (activeFilter === 'veg') {
      result = result.filter(r => r.is_pure_veg || (r.menu && r.menu.every(m => m.is_veg)));
    } else if (activeFilter === 'rating') {
      result = result.filter(r => r.rating >= 4.5);
    } else if (activeFilter === 'fast') {
      result = result.filter(r => r.delivery_time <= 25);
    }

    // Sorting
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
    setSelectedRestId(id);
    setDetailedRestaurant(null);
    try {
      const res = await fetch(`/api/restaurants/${id}`);
      if (res.ok) {
        const data = await res.json();
        setDetailedRestaurant(data);
      }
    } catch (err) {
      console.error('Failed to fetch restaurant details:', err);
    }
  };

  return (
    <div className="app-container">
      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
        locationText={locationText}
        onOpenLocationModal={() => setIsLocationOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        wishlistCount={wishlist.size}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        cartCount={cart.items.reduce((sum, i) => sum + i.qty, 0)}
        onToggleCart={() => setIsCartOpen(prev => !prev)}
        notifCount={notifications.length}
        onOpenNotifications={() => setIsNotifOpen(true)}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={() => {
          fetchAllOrdersAdmin();
          setIsAdminOpen(true);
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
            setActiveCategory(slug);
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
          onSelectFilter={setActiveFilter}
          activeSort={activeSort}
          onSelectSort={setActiveSort}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onOpenRestaurant={handleOpenRestaurant}
        />
      </main>

      {/* Modals & Drawers */}
      <RestaurantModal
        isOpen={!!selectedRestId}
        restaurant={detailedRestaurant || selectedRestObj}
        onClose={() => setSelectedRestId(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQty}
        onApplyCoupon={handleApplyCoupon}
        onProceedCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        user={user}
        onPlaceOrder={handlePlaceOrder}
      />

      <OrderTrackerModal
        isOpen={!!activeTrackingOrder}
        onClose={() => setActiveTrackingOrder(null)}
        order={activeTrackingOrder}
        onOrderDelivered={() => {
          showToast('Order Delivered! Bon Appétit!');
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        orders={orders}
      />

      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        restaurants={restaurants}
        onOpenRestaurant={(id) => setSelectedRestId(id)}
        onToggleWishlist={handleToggleWishlist}
      />

      <NotificationsModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onClear={() => {
          setNotifications([]);
          showToast('Notifications cleared');
        }}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onAddRestaurant={handleAddRestaurant}
      />

      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        currentLocation={locationText}
        onSelectLocation={(loc) => {
          setLocationText(loc);
          setIsLocationOpen(false);
          showToast(`Location updated to ${loc}`);
        }}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </div>
  );
}
