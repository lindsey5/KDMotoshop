import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { deleteCartItem, fetchCart } from "./cartThunks";

interface CartState {
  cart: CartItem[];
  loading: boolean;
}

const initialState: CartState = {
  cart: [],
  loading: true,
};

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
const cartReducer = cartSlice.reducer
export default cartReducer;