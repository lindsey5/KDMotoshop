import mongoose, { Document, Schema, Types } from 'mongoose';

interface Order extends Document {
    order_id: string;
    order_source: 'Store' | 'Website' | 'Facebook' | 'Shopee' | 'Lazada' | 'Tiktok';
    shipping_fee: number;
    total: number;
    subtotal: number;
    status: "Pending" | "Accepted" | "Shipped" | "Delivered" | "Rejected" | "Cancelled" | "Refunded" | "Rated";
    customer: {
        customer_id?: Types.ObjectId;
        email?: string;
        firstname: string;
        lastname: string;
        phone?: string;
    };
    address?: {
        street: string;
        barangay: string;
        city: string;
        region: string;
    };
    payment_method: "CASH" | "GCASH" | "PAYMAYA" | "CARD";
    createdBy?: Types.ObjectId;
}

const OrderSchema: Schema<Order> = new Schema(
  {
    order_id: { type: String, required: true, unique: true },
    total: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    order_source: {
      type: String,
      enum: ['Store', 'Website', 'Facebook', 'Shopee', 'Lazada', 'Tiktok'],
      default: 'Website'
    },
    shipping_fee: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Shipped", "Delivered", "Rejected", "Cancelled", "Refunded", "Failed", "Rated"],
      default: "Pending",
      required: true
    },
    customer: {
      type: {
        customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: false },
        email: { type: String, required: false },
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        phone: { type: String, required: false }
      },
      required: true
    },
    address: {
      type: {
        street: { type: String, required: true },
        barangay: { type: String, required: true },
        city: { type: String, required: true },
        region: { type: String, required: true },
      },
      required: false
    },
    payment_method: {
      type: String,
      enum: ["CASH", "GCASH", "PAYMAYA", "CARD"],
      default: "CASH",
      required: true
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: false }
  },
  { timestamps: true }
);


const Order = mongoose.model<Order>('Order', OrderSchema);
export default Order;
