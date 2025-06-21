import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  token: null, // Add token storage
  isAuthenticated: false // Explicit auth flag
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.isAuthenticated = false;
    },
    // ... keep existing update/delete actions ...
    setAuthState: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
    }
  }
});

export const { 
  signInStart, 
  signInSuccess, 
  signInFailure,
  updateFailure, 
  updateStart, 
  updateSuccess,
  deleteUserFailure, 
  deleteUserStart, 
  deleteUserSuccess,
  signOutUserFailure, 
  signOutUserStart, 
  signOutUserSuccess,
  setAuthState,
  clearUser
} = userSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectIsAuthenticated = (state) => state.user.isAuthenticated;
export const selectAuthLoading = (state) => state.user.loading;
export const selectAuthError = (state) => state.user.error;

export default userSlice.reducer;
