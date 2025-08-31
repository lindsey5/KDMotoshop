import { Schema, model, Types, Document } from 'mongoose';
import { IPOItem } from './PurchaseOrderItem';

interface IPurchaseOrder extends Document {
  po_id: string;
  supplier: Types.ObjectId;
  totalAmount: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Received' | 'Cancelled';
  receivedDate?: Date;
  notes?: string;
  purchase_items?: IPOItem[]; // optional because it's a virtual
  createdBy: Types.ObjectId;
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
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
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

POSchema.set('toObject', { virtuals: true });
POSchema.set('toJSON', { virtuals: true });

const PurchaseOrder = model<IPurchaseOrder>('PurchaseOrder', POSchema);

export default PurchaseOrder;
