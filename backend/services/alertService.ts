import { Types } from "mongoose";
import { io } from "../middlewares/socket";
import Admin from "../models/Admin";
import { brevo, sender } from "../utils/brevo";

export const sendLowStockAlert = async (product_id : string, product_name: string, product_image : string, sku: string, currentStock: number, prevStock: number, amount: number) => {
  try {
    const alert = { _id: product_id, product_name, product_image, sku, currentStock, prevStock, amount };
    const admins = await Admin.find();

    for(const admin of admins){
      const admin_id = (admin._id as Types.ObjectId).toString();

      io?.to(admin_id).emit('lowStockNotification', alert);
      await sendLowStockAlertEmail(admin.email, product_name, product_image, sku, currentStock, prevStock, amount)
    }
    console.log(`Low stock alert created for SKU ${sku}`);
  } catch (error) {
    console.error('Error creating low stock alert:', error);
  }
}

export const sendLowStockAlertEmail = async (
  email: string,
  product_name: string,
  product_image: string,
  sku: string,
  currentStock: number,
  prevStock: number,
  amount: number
) => {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #d9534f; text-align:center;">⚠️ Low Stock Alert</h2>
        <p style="font-size: 16px;">Dear Admin,</p>
        <p style="font-size: 16px;">
          The product below has reached a low stock threshold:
        </p>

        <div style="border: 1px solid #eee; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <img src="${product_image}" alt="${product_name}" width="120" style="display:block; margin:auto; border-radius: 5px;" />
          <p style="text-align:center; margin-top:10px; font-size:18px;"><strong>${product_name}</strong></p>
          <p><strong>SKU:</strong> ${sku}</p>
          <p><strong>Previous Stock:</strong> ${prevStock}</p>
          <p><strong>Current Stock:</strong> ${currentStock}</p>
          <p><strong>Recommended quantity to restock:</strong> ${amount}</p>
        </div>

        <p style="font-size: 15px;">
          Please restock this product to avoid running out.
        </p>

        <hr style="margin: 30px 0;">
        <p style="text-align: center; color: #aaa; font-size: 12px;">
          © ${new Date().getFullYear()} KD Motoshop. All rights reserved.
        </p>
      </div>
    `;

    await brevo.sendTransacEmail({
      sender,
      to: [{ email }],
      subject: `⚠️ Low Stock Alert: ${product_name} (SKU: ${sku})`,
      htmlContent,
    });

    return true;
  } catch (error: any) {
    console.error("Error sending low stock alert email:", error.message);
    throw new Error("Failed to send low stock alert email.");
  }
};