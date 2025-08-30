import { Schema, model, Types, Document } from 'mongoose';

interface IPurchaseOrder extends Document {
  po_id: string;
  supplier: Types.ObjectId;
  totalAmount: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed' | 'Cancelled';
  receivedDate?: Date;
  notes?: string;
}

const POSchema: Schema<IPurchaseOrder> = new Schema(
  {
    po_id: { type: String, required: true, unique: true }, 
    supplier: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true }, 
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Received', 'Cancelled'],
      default: 'Pending',
    },
    receivedDate: { type: Date },
    notes: { type: String },
  },
  {
    timestamps: true,
  }
);

// Virtual for purchase items
POSchema.virtual('purchase_items', {
  ref: 'PurchaseOrderItem',
  localField: '_id',
  foreignField: 'purchase_order',
  justOne: false,
});

const PurchaseOrder = model<IPurchaseOrder>('PurchaseOrder', POSchema);

export default PurchaseOrder;