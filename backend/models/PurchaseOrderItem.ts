import { Schema, model, Types } from 'mongoose';

export interface IPOItem extends Document{
  purchase_order: Types.ObjectId;
  product_id: Types.ObjectId;
  sku: string;
  quantity: number;
  price: number;
}

const POItemSchema : Schema<IPOItem> = new Schema(
  {
    purchase_order: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder', required: true },
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const PurchaseOrderItem = model<IPOItem>('PurchaseOrderItem', POItemSchema);

export default PurchaseOrderItem;