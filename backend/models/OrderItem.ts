import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IOrderItem extends Document {
    order_id: Types.ObjectId; 
    product_id: Types.ObjectId;
    sku: string;
    product_type: 'Single' | 'Variable';
    attributes?: { [key: string]: string }
    product_name: string;
    quantity: number;
    price: number;
    lineTotal: number;
    status: 'Unfulfilled' | 'Fulfilled' | 'Rated';
    createdAt: Date;
}

const OrderItemSchema: Schema<IOrderItem> = new Schema(
  {
    order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String, required: true },
    product_type: { type: String, enum: ['Single', 'Variable'], required: true },
    attributes: { type: Object, required: false },
    product_name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    lineTotal: { type: Number, required: true },
    status: { type: String, enum: ['Unfulfilled', 'Fulfilled', 'Rated', 'Cancelled'], default: 'Unfulfilled' },
  },
  { timestamps: true }
);

OrderItemSchema.virtual("refund", {
  ref: "RefundRequest",
  localField: "_id",
  foreignField: "order_item_id",
  justOne: true,   
});

OrderItemSchema.set("toObject", { virtuals: true });
OrderItemSchema.set("toJSON", { virtuals: true });

const OrderItem = mongoose.model<IOrderItem>('OrderItem', OrderItemSchema);
export default OrderItem;