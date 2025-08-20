import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { deleteData, fetchData } from '../services/api';
import { confirmDialog, successAlert } from '../utils/swal';

interface CartState {
  cart: CartItem[];
  loading: boolean;
}

const initialState: CartState = {
  cart: [],
  loading: true,
};

export const fetchCart = createAsyncThunk<CartItem[]>(
  'cart/fetchCart',
  async () => {
    const response = await fetchData('/api/cart');
    if (!response.success) throw new Error('Failed to fetch cart');
    
    return response.carts.map((item: any) => {
      if (item.quantity > item.stock){
        item.quantity = item.stock;
      }
      
      return { ...item, isSelected: item.stock === 0 ? false : true };
    });
  }
);

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async ({ id, isDark }: { id: string; isDark: boolean }) => {
    const confirmed = await confirmDialog('Remove this item?', 'This action cannot be undone.', isDark);
    if (!confirmed) return;

    const response = await deleteData(`/api/cart/${id}`);
    if (response.success) {
      successAlert('Item successfully removed', '', isDark);
      return id;
    } else {
      throw new Error('Failed to delete cart item');
    }
  }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart(state, action: PayloadAction<CartItem[]>) {
            state.cart = action.payload;
        },
        updateCartItem(state, action: PayloadAction<CartItem>) {
            const index = state.cart.findIndex(item => item._id === action.payload._id);
            if (index !== -1) state.cart[index] = action.payload;
        },
        clearCart(state) {
            state.cart = [];
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchCart.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchCart.fulfilled, (state, action) => {
            state.loading = false;
            state.cart = action.payload;
        })
        .addCase(fetchCart.rejected, (state, _) => {
            state.loading = false;
        })
        .addCase(deleteCartItem.fulfilled, (state, action) => {
            state.cart = state.cart.filter(item => item._id !== action.payload)
        })
    },
});

export const { setCart, updateCartItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
