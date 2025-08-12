import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { fetchData, postData } from '../services/api';

interface CustomerType extends Customer {
  role: 'Customer';
}

interface UserState {
  user: CustomerType | Admin | null;
  loading: boolean;
}

const initialState: UserState = {
  user: null,
  loading: true,
};

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (_, { rejectWithValue }) => {
    let response = await fetchData(`/api/auth/user`);

    if (!response.success) {
      const refreshRes = await postData('/api/auth/refresh', {});

      if (!refreshRes.success) return rejectWithValue('Failed to refresh token');

      response = await fetchData(`/api/auth/user`);

      if (!response.success) return rejectWithValue('Failed to refresh token');
    }

    return response.user;
  }
);

// New thunk for logout side effects
export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async ({ navigate, path }: { navigate: (path: string) => void; path : string }) => {
    await postData('/api/auth/logout', {});
      localStorage.removeItem('items');
      localStorage.removeItem('cart');
      navigate(path);
  }
);
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<CustomerType | Admin | null>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
      });
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
