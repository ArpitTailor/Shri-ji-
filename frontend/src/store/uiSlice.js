import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: localStorage.getItem('shri_ji_theme') || 'dark',
  locationText: localStorage.getItem('shri_ji_location') || 'Downtown, Tech District',
  toastMessage: '',
  searchQuery: '',
  activeCategory: 'all',
  activeFilter: 'all',
  activeSort: 'relevance',
  modals: {
    cart: false,
    checkout: false,
    auth: false,
    profile: false,
    wishlist: false,
    notifications: false,
    admin: false,
    location: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('shri_ji_theme', action.payload);
      document.documentElement.setAttribute('data-theme', action.payload);
    },
    setLocationText: (state, action) => {
      state.locationText = action.payload;
      localStorage.setItem('shri_ji_location', action.payload);
    },
    showToast: (state, action) => {
      state.toastMessage = action.payload;
    },
    hideToast: (state) => {
      state.toastMessage = '';
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setActiveCategory: (state, action) => {
      state.activeCategory = action.payload;
    },
    setActiveFilter: (state, action) => {
      state.activeFilter = action.payload;
    },
    setActiveSort: (state, action) => {
      state.activeSort = action.payload;
    },
    toggleModal: (state, action) => {
      const { modalName, isOpen } = action.payload;
      if (isOpen !== undefined) {
        state.modals[modalName] = isOpen;
      } else {
        state.modals[modalName] = !state.modals[modalName];
      }
    },
  },
});

export const {
  setTheme, setLocationText, showToast, hideToast,
  setSearchQuery, setActiveCategory, setActiveFilter, setActiveSort,
  toggleModal
} = uiSlice.actions;

export default uiSlice.reducer;
