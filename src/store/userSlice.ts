import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isAuthenticated: false,
    hasTriedAuth: false,
  },
  reducers: {
    setUserData: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.hasTriedAuth = true;
    },
    clearUserData: state => {
      state.user = null;
      state.isAuthenticated = false;
      state.hasTriedAuth = true;
    },
    setTriedAuth: state => {
      state.hasTriedAuth = true;
    },
  },
});

export const { setUserData, clearUserData, setTriedAuth } = userSlice.actions;
export const userReducer = userSlice.reducer;
