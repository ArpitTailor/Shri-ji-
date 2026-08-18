import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: localStorage.getItem('shri_ji_user_data') ? JSON.parse(localStorage.getItem('shri_ji_user_data')) : null,
  token: localStorage.getItem('shri_ji_token') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem('shri_ji_token', token);
      localStorage.setItem('shri_ji_user_data', JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('shri_ji_token');
      localStorage.removeItem('shri_ji_user_data');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
