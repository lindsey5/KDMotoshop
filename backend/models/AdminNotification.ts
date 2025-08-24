import mongoose, { Schema, Types } from 'mongoose';
import { INotification } from '../types/notification';

export interface IAdminNotification extends INotification{
    from?: Types.ObjectId;
    product_id?: Types.ObjectId;
    review_id?: Types.ObjectId;
    refund_id?: Types.ObjectId;
}

// Define the schema
const AdminNotificationSchema: Schema<IAdminNotification> = new Schema(
  {
    to: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    from: { type: Schema.Types.ObjectId, ref: 'Customer', required: false },
    product_id: { type: Schema.Types.ObjectId, ref: 'RefundRequest', required: false },
    refund_id: { type: Schema.Types.ObjectId, ref: 'Product', required: false },
    order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: false },
    review_id: { type: Schema.Types.ObjectId, ref: 'Order', required: false },
    content: { type: String, required: true },
    isViewed: { type: Boolean, default: false, required: true}
  },
  { timestamps: true }
);

// Create the model
const AdminNotification = mongoose.model<IAdminNotification>('AdminNotification', AdminNotificationSchema);
export default AdminNotification;
