import mongoose, { Document } from "mongoose";

export interface IAlert extends Document {
  product_id: mongoose.Types.ObjectId;
  sku: string;                  // SKU of the product
  content: string;
  threshold: number;          
  current_stock: number;      // Current stock level when alert is created
  is_resolved: boolean;       // Whether the alert has been addressed
  resolved_at?: Date;         // Optional: when the alert was resolved
}

const AlertSchema = new mongoose.Schema<IAlert>(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    content: { type: String, required: true },
    threshold: { type: Number, required: true }, // Stock level that triggers the alert
    current_stock: { type: Number, required: true }, // Current stock level when alert is created
    is_resolved: { type: Boolean, default: false }, // Whether the alert has been addressed
  },
  { timestamps: true }
);

const Alert = mongoose.model<IAlert>('Alert', AlertSchema);
export default Alert;