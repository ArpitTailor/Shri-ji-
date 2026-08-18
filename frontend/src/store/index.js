import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import dataReducer from './dataSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    cart: cartReducer,
    data: dataReducer,
  },
});
