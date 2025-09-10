import { createAsyncThunk } from "@reduxjs/toolkit";
import { deleteData, fetchData } from "../../services/api";
import { confirmDialog, successAlert } from "../../utils/swal";

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