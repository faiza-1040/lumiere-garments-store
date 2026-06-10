import { createSlice } from '@reduxjs/toolkit';

// Safely get user from localStorage if in browser environment
const getUserFromStorage = () => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('userInfo');
    if (user) return JSON.parse(user);
  }
  return null;
};

const initialState = {
  userInfo: getUserFromStorage(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.userInfo = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userInfo');
      }
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
