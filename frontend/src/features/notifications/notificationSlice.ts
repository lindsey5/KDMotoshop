import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchNotifications, notificationsNextPage, updateAllNotifications, updateNotification } from "./notificationThunks";

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  total: 0,
  unread: 0,
  page: 1,
};

const notificationSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addNotification(state, action: PayloadAction<NotificationType>) {
            state.notifications = [action.payload, ...state.notifications];
            state.total += 1;
            state.unread += 1;
        },
        resetNotifications(){
            return initialState
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchNotifications.fulfilled, (state, action) => {
            state.notifications = action.payload.notifications;
            state.total = action.payload.total;
            state.unread = action.payload.unread;
            state.page = action.payload.page
        })
        .addCase(updateAllNotifications.fulfilled, (state) => {
            state.unread = 0;
            state.notifications = state.notifications.map(n => ({
                ...n,
                isViewed: true
            }));
        })
        .addCase(notificationsNextPage.pending, (state) => {
            state.loading = true;
        })
        .addCase(notificationsNextPage.fulfilled, (state, action) => {
            state.loading = false
            state.notifications = [...state.notifications, ...action.payload.notifications]
            state.page = action.payload.page
        })
        .addCase(updateNotification.fulfilled, (state, action) => {
            state.notifications = state.notifications.map(n => (n._id === action.payload ? { ...n, isViewed: true} : n));
            state.unread -= 1;
        })
    },
});

export const { addNotification, resetNotifications } = notificationSlice.actions;

const notificationReducer = notificationSlice.reducer;
export default notificationReducer
