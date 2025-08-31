import mongoose, { Schema, Types } from 'mongoose';

export interface IActivityLog extends Document{
    admin_id: Types.ObjectId;
    product_id?: Types.ObjectId;
    order_id?: Types.ObjectId;
    supplier_id?: Types.ObjectId;
    po_id?: Types.ObjectId;
    description: string;
    prev_value?: string;
    new_value?: string;
}

// Define the schema
const ActivityLogSchema: Schema<IActivityLog> = new Schema(
  {
    admin_id: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: false },
    order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: false },
    supplier_id: { type: Schema.Types.ObjectId, ref: 'Supplier', required: false },
    po_id: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder', required: false },
    description: { type: String, required: true },
    prev_value: { type: String, required: false },
    new_value: { type: String, required: false }
  },
  { timestamps: true }
);

// Create the model
const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
export default ActivityLog;
