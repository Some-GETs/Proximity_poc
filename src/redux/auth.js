// authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
  token: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {

      
      const { token, user } = action.payload;
      state.token = token;
      state.user = user || null;
      state.isAuthenticated = true;

      console.log(state.token+" "+token);
      // Persist token to AsyncStorage
      AsyncStorage.setItem('token', token);
    },
    logout: (state) => {

      console.log(state);
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      AsyncStorage.removeItem('token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
