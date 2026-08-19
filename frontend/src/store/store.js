import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import favouritesReducer from './favouritesSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    favourites: favouritesReducer,
  },
});
