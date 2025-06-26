import mongoose, { Document, Schema, Types } from 'mongoose';

interface IOrder extends Document {
    order_id: string;
    order_source: string;
    shipping_fee: number;
    total: number;
    subtotal: number;
    status: "Pending" | "Accepted" | "Shipped" | "Completed" | "Rejected" | "Cancelled" | "Refunded" | "Rated";
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
    payment_method: "Cash" | "Gcash" | "COD" | "Other";
    note?: string;
    createdBy: Types.ObjectId;
}

const OrderSchema: Schema<IOrder> = new Schema(
  {
    order_id: { type: String, required: true, unique: true },
    total: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    order_source: {
      type: String,
      enum: ['Store', 'Website', 'Facebook', 'Shopee', 'Lazada'],
      default: 'website'
    },
    shipping_fee: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Shipped", "Completed", "Rejected", "Cancelled", "Refunded"],
      default: "Pending",
      required: true
    },
    customer: {
      type: {
        customer_id: { type: String, required: false },
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
      enum: ["Cash", "Gcash", "COD", "Other"],
      default: "Cash",
      required: true
    },
    note: { type: String, required: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: false }
  },
  { timestamps: true }
);


const Order = mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
