import mongoose, { Schema, Types } from 'mongoose';
import { INotification } from '../types/notification';

interface IAdminNotification extends INotification{
    from: Types.ObjectId;
}

// Define the schema
const AdminNotificationSchema: Schema<IAdminNotification> = new Schema(
  {
    to: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    from: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    content: { type: String, required: true },
    isViewed: { type: Boolean, default: false, required: true}
  },
  { timestamps: true }
);

// Create the model
const AdminNotification = mongoose.model<IAdminNotification>('AdminNotification', AdminNotificationSchema);
export default AdminNotification;
