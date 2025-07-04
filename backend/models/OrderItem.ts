import mongoose, { Document, Schema, Types } from 'mongoose';

interface OrderItem extends Document {
    order_id: Types.ObjectId; 
    product_id: Types.ObjectId;
    variant_id?: string;
    attributes?: { [key: string]: string }
    product_name: string;
    quantity: number;
    status: 'Unfulfilled' | 'Fulfilled' | 'Refunded' | 'Cancelled';
    price: number;
    lineTotal: number;
}

const OrderItemSchema: Schema<OrderItem> = new Schema(
  {
    order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variant_id: { type: String, required: false },
    attributes: { type: Object, required: false },
    product_name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    lineTotal: { type: Number, required: true },
    status: { type: String, enum: ['Unfulfilled', 'Fulfilled', 'Refunded', 'Cancelled'], default: 'Unfulfilled' },
  },
  { timestamps: true }
);

const OrderItem = mongoose.model<OrderItem>('OrderItem', OrderItemSchema);
export default OrderItem;