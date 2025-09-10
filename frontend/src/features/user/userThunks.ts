import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchData, postData } from "../../services/api";

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    let response = await fetchData(`/api/auth/user`);

    if (!response.success) return rejectWithValue('Failed to refresh token');
    
    return response.user;
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async ({ navigate, path }: { navigate: (path: string) => void; path : string }) => {
    await postData('/api/auth/logout', {});
      localStorage.removeItem('items');
      localStorage.removeItem('cart');
      navigate(path);
  }
);