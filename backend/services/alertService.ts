import { Types } from "mongoose";
import { io } from "../middlewares/socket";
import Admin from "../models/Admin";

export const sendLowStockAlert = async (product_id : string, product_name: string, product_image : string, sku: string, currentStock: number, prevStock: number) => {
  try {
    const alert = { _id: product_id, product_name, product_image, sku, currentStock, prevStock };
    const admins = await Admin.find();

    for(const admin of admins){
      const admin_id = (admin._id as Types.ObjectId).toString();

      io?.to(admin_id).emit('lowStockNotification', alert);
    }
    console.log(`Low stock alert created for SKU ${sku}`);
  } catch (error) {
    console.error('Error creating low stock alert:', error);
  }
}