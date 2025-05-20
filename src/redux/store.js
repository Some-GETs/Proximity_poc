
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth';
import detailsReducer from './detail'

const store = configureStore({
  reducer: {
    auth: authReducer,
    details: detailsReducer
  },
});

export default store;
