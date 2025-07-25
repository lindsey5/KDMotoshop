import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart-reducer';
import notificationReducer from './customer-notification-reducer';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    notification: notificationReducer
  },
});

// ✅ These two types are required
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
