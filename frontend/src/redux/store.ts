import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cart-reducer';
import notificationReducer from './notification-reducer';
import userReducer from './user-reducer';

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
