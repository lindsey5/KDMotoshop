import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { fetchData, updateData } from '../services/api';

type Notification = {
    _id: string;
    from?: string | Customer;
    to: string;
    order_id:  string;
    isViewed: boolean;
    content: string;
    createdAt: Date;
}

interface NotificationState {
  notifications: Notification[];
  loading?: boolean;
  total: number;
  unread: number;
  page: number;
}

const initialState: NotificationState = {
  notifications: [],
  loading: false,
  total: 0,
  unread: 0,
  page: 1,
};

export const fetchNotifications = createAsyncThunk<NotificationState, 'customer' | 'admin'>(
  'notification/fetchNotifications',
  async (user : 'customer' | 'admin') => {
    const response = await fetchData(`/api/notification/${user}?limit=30&page=1`);
    if(!response.success){
        throw new Error('Failed to fetch notifications');
    }
    return { 
        notifications: response.notifications, 
        total: response.totalNotifications,
        unread: response.totalUnread,
        page: 1
    }
  }
);

export const updateAllNotifications = createAsyncThunk(
    'notification/updateNotifications',
    async (user : 'customer' | 'admin', { rejectWithValue }) => {
        const response = await updateData(`/api/notification/${user}`, {});
        if(response.success){
            return rejectWithValue('Failed to update notifications');
        }
        return true
    }
);

interface UpdateNotificationArgs {
  user: 'customer' | 'admin';
  id: string;
}

export const updateNotification = createAsyncThunk<
  string, // Return type
  UpdateNotificationArgs, 
  { rejectValue: string } 
>(
  'notification/updateNotification',
  async ({ user, id }) => {
    const response = await updateData(`/api/notification/${id}/${user}`, {});
      if (!response.success) {
        throw new Error('Failed to fetch next page');
      }
      return id
  }
);

export const notificationsNextPage = createAsyncThunk<
  { notifications: Notification[]; page: number },
  { page: number; user: 'customer' | 'admin' }
>(
  'notification/next',
  async ({ page, user }) => {
    const response = await fetchData(`/api/notification/${user}?limit=30&page=${page}`);
    if (!response.success) throw new Error('Failed to fetch next page');

    return {
      notifications: response.notifications,
      page,
    };
  }
);

export const notificationsPage = createAsyncThunk<
  { notifications: Notification[]; page: number },
  { page: number; user: 'customer' | 'admin' }
>(
  'notification/page',
  async ({ page, user }) => {
    const response = await fetchData(`/api/notification/${user}?limit=30&page=${page}`);
    if (!response.success) throw new Error('Failed to fetch next page');

    return {
      notifications: response.notifications,
      page,
    };
  }
);

const notificationSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addNotification(state, action: PayloadAction<Notification>) {
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
        .addCase(notificationsPage.fulfilled, (state, action) => {
            state.notifications =action.payload.notifications
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
