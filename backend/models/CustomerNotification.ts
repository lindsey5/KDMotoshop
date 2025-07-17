import mongoose, { Schema, Types } from 'mongoose';
import { INotification } from '../types/notification';

// Define the schema
const CustomerNotificationSchema: Schema<INotification> = new Schema(
  {
    to: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    content: { type: String, required: true },
    isViewed: { type: Boolean, default: false, required: true}
  },
  { timestamps: true }
);

// Create the model
const CustomerNotification = mongoose.model<INotification>('CustomerNotification', CustomerNotificationSchema);
export default CustomerNotification;
