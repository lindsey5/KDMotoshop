import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrder extends Document {
    order_id: string;
    order_source: 'Store' | 'Website' | 'Facebook' | 'Shopee' | 'Lazada' | 'Tiktok';
    shipping_fee: number;
    total: number;
    paymentAmount?: number;
    change?: number;
    subtotal: number;
    status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Rejected" | "Cancelled" | "Refunded" | "Rated" | "Failed";
    customer?: {
        customer_id?: Types.ObjectId;
        email?: string;
        firstname: string;
        lastname: string;
        phone: string;
    };
    address?: {
        street: string;
        barangay: string;
        city: string;
        region: string;
    };
    deliveredAt: Date,
    payment_method: "CASH" | "GCASH" | "PAYMAYA" | "CARD";
    createdBy?: Types.ObjectId;
    createdAt: Date;
    voucher?: Types.ObjectId;
    cancellationReason?: string;
}

const OrderSchema: Schema<IOrder> = new Schema(
  {
    order_id: { type: String, required: true, unique: true },
    total: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    paymentAmount: { type: Number, required: false },
    change: { type: Number, required: false },
    order_source: {
      type: String,
      enum: ['Store', 'Website', 'Facebook', 'Shopee', 'Lazada', 'Tiktok'],
      default: 'Website'
    },
    shipping_fee: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Rejected", "Cancelled", "Refunded", "Failed", "Rated"],
      default: "Pending",
      required: true
    },
    customer: {
      type: {
        customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: false },
        email: { type: String, required: false },
        firstname: { type: String, },
        lastname: { type: String, },
        phone: { type: String, required: false }
      },
      required: false
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
    deliveredAt: {
      type: Date,
      required: false
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: false },
    voucher: { type: Schema.Types.ObjectId, ref: 'Voucher'},
    cancellationReason: { type: String, required: false }
  },
  { timestamps: true }
);

OrderSchema.virtual("orderItems", {
  ref: "OrderItem",
  localField: "_id",
  foreignField: "order_id",
  justOne: false,   
});

OrderSchema.set("toObject", { virtuals: true });
OrderSchema.set("toJSON", { virtuals: true });

const Order = mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
