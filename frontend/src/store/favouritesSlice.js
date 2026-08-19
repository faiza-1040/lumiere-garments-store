import { createSlice } from '@reduxjs/toolkit';

// Session storage helpers (clears when browser is closed — for guests)
const SESSION_KEY = 'guest_favourites';

const loadGuestFavourites = () => {
  if (typeof window === 'undefined') return [];
  try {
    const data = sessionStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveGuestFavourites = (items) => {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(items));
};

const initialState = {
  items: [], // array of product objects
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    // Called on app load: load from sessionStorage (guest) or from API response (logged-in)
    setFavourites: (state, action) => {
      state.items = action.payload;
    },

    // Add a product to favourites (guest: persist to sessionStorage)
    addFavourite: (state, action) => {
      const product = action.payload;
      const exists = state.items.some((p) => p._id === product._id);
      if (!exists) {
        state.items.push(product);
        saveGuestFavourites(state.items);
      }
    },

    // Remove a product from favourites (guest: persist to sessionStorage)
    removeFavourite: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((p) => p._id !== productId);
      saveGuestFavourites(state.items);
    },

    // Clear all (used on logout if desired)
    clearFavourites: (state) => {
      state.items = [];
    },
  },
});

export const { setFavourites, addFavourite, removeFavourite, clearFavourites } = favouritesSlice.actions;
export default favouritesSlice.reducer;
