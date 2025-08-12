import mongoose, { Schema, Types, Document } from 'mongoose';

export interface IRefund extends Document {
  customer_id: Types.ObjectId;
  order_id: Types.ObjectId;
  items: {
    product_id: Types.ObjectId;
    order_item_id: Types.ObjectId;
    quantity: number;
    reason: string;
  }[];
  totalQuantity: number;
  totalAmount: number;
}

// Define the schema
const RefundSchema: Schema<IRefund> = new Schema(
  {
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    items: [
      {
        product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        order_item_id: { type: Schema.Types.ObjectId, ref: 'OrderItem', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        reason: { type: String, required: true, trim: true }
      }
    ],
    totalQuantity: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true, min: 1}
  },
  { timestamps: true }
);

// Create the model
const Refund = mongoose.model<IRefund>('Refund', RefundSchema);
export default Refund;
