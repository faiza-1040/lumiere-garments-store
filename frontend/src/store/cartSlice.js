import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.id === item.id);
      if (existItem) {
        existItem.qty += 1;
      } else {
        state.cartItems.push({ ...item, qty: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x.id !== action.payload);
    },
    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      const existItem = state.cartItems.find((x) => x.id === id);
      if (existItem) {
        existItem.qty = qty;
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
