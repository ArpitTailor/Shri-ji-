import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
  const saved = localStorage.getItem('shri_ji_cart');
  return saved ? JSON.parse(saved) : { items: [], restaurant_id: null, restaurant_name: null, discountAmount: 0, appliedCoupon: null };
};

const initialState = loadCart();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { itemId, itemName, itemPrice, restId, restName, override } = action.payload;
      
      if (state.restaurant_id && state.restaurant_id !== restId && state.items.length > 0) {
        if (override) {
          state.items = [{ id: itemId, name: itemName, price: itemPrice, qty: 1 }];
          state.restaurant_id = restId;
          state.restaurant_name = restName;
          state.discountAmount = 0;
          state.appliedCoupon = null;
        }
      } else {
        const existing = state.items.find(i => i.id === itemId);
        if (existing) {
          existing.qty += 1;
        } else {
          state.items.push({ id: itemId, name: itemName, price: itemPrice, qty: 1 });
        }
        state.restaurant_id = restId;
        state.restaurant_name = restName;
      }
      localStorage.setItem('shri_ji_cart', JSON.stringify(state));
    },
    updateQty: (state, action) => {
      const { itemId, change } = action.payload;
      const item = state.items.find(i => i.id === itemId);
      if (item) {
        item.qty += change;
      }
      state.items = state.items.filter(i => i.qty > 0);
      if (state.items.length === 0) {
        state.restaurant_id = null;
        state.restaurant_name = null;
        state.discountAmount = 0;
        state.appliedCoupon = null;
      }
      localStorage.setItem('shri_ji_cart', JSON.stringify(state));
    },
    applyCoupon: (state, action) => {
      const { code, discount } = action.payload;
      state.appliedCoupon = code;
      state.discountAmount = discount;
      localStorage.setItem('shri_ji_cart', JSON.stringify(state));
    },
    clearCart: (state) => {
      state.items = [];
      state.restaurant_id = null;
      state.restaurant_name = null;
      state.discountAmount = 0;
      state.appliedCoupon = null;
      localStorage.setItem('shri_ji_cart', JSON.stringify(state));
    },
  }
});

export const { addToCart, updateQty, applyCoupon, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
