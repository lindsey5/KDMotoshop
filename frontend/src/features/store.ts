import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice'
import cartReducer from './cart/cartSlice';
import notificationReducer from './notifications/notificationSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    notification: notificationReducer,
    user: userReducer,
  },
});

// ✅ These two types are required
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
