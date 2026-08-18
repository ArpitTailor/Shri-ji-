import { createSlice } from '@reduxjs/toolkit';

const initialWishlist = () => {
  const saved = localStorage.getItem('shri_ji_wishlist');
  return saved ? JSON.parse(saved) : [1, 3];
};

const initialState = {
  restaurants: [],
  categories: [],
  aiData: null,
  orders: [],
  wishlist: initialWishlist(),
  notifications: [
    { title: 'Welcome to Shri Ji!', message: 'Explore artisan kitchens and enjoy 20% off your first gourmet delivery.' },
    { title: 'Live AI Pairing Ready', message: 'Check out our AI recommendations tailored for your evening dining.' }
  ],
  selectedRestId: null,
  detailedRestaurant: null,
  activeTrackingOrder: null,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setRestaurants: (state, action) => {
      state.restaurants = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setAiData: (state, action) => {
      state.aiData = action.payload;
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      if (order) order.status = status;
    },
    addRestaurant: (state, action) => {
      state.restaurants.unshift(action.payload);
    },
    toggleWishlist: (state, action) => {
      const id = action.payload;
      const idx = state.wishlist.indexOf(id);
      if (idx > -1) {
        state.wishlist.splice(idx, 1);
      } else {
        state.wishlist.push(id);
      }
      localStorage.setItem('shri_ji_wishlist', JSON.stringify(state.wishlist));
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setSelectedRestId: (state, action) => {
      state.selectedRestId = action.payload;
    },
    setDetailedRestaurant: (state, action) => {
      state.detailedRestaurant = action.payload;
    },
    setActiveTrackingOrder: (state, action) => {
      state.activeTrackingOrder = action.payload;
    }
  },
});

export const {
  setRestaurants, setCategories, setAiData, setOrders, addOrder, updateOrderStatus,
  addRestaurant, toggleWishlist, clearNotifications, setSelectedRestId, setDetailedRestaurant, setActiveTrackingOrder
} = dataSlice.actions;

export default dataSlice.reducer;
