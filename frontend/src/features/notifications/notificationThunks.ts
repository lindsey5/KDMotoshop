import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchData, updateData } from "../../services/api";

type fetchNotificationsParams = { 
    user : 'customer' | 'admin',
    page: number
}

export const fetchNotifications = createAsyncThunk<NotificationState, fetchNotificationsParams >(
  'notification/fetchNotifications',
  async ({ user, page } : fetchNotificationsParams) => {
    const response = await fetchData(`/api/notifications/${user}?limit=30&page=${page}`);
    if(!response.success){
        throw new Error('Failed to fetch notifications');
    }
    return { 
        notifications: response.notifications, 
        total: response.totalNotifications,
        unread: response.totalUnread,
        page
    }
  }
);

export const updateAllNotifications = createAsyncThunk(
    'notification/updateNotifications',
    async (user : 'customer' | 'admin', { rejectWithValue }) => {
        const response = await updateData(`/api/notifications/${user}`, {});
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
    const response = await updateData(`/api/notifications/${id}/${user}`, {});
      if (!response.success) {
        throw new Error('Failed to fetch next page');
      }
      return id
  }
);

export const notificationsNextPage = createAsyncThunk<
  { notifications: NotificationType[]; page: number },
  { page: number; user: 'customer' | 'admin' }
>(
  'notification/next',
  async ({ page, user }) => {
    const response = await fetchData(`/api/notifications/${user}?limit=30&page=${page}`);
    if (!response.success) throw new Error('Failed to fetch next page');

    return {
      notifications: response.notifications,
      page,
    };
  }
);