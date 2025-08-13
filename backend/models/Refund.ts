import mongoose, { Schema, Types, Document } from 'mongoose';

export interface IRefundRequest extends Document {
  customer_id: Types.ObjectId;
  order_item_id: Types.ObjectId;
  quantity: number;
  status:
  | 'Pending'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Processing'
  | 'Completed'
  | 'Cancelled';
  price: Number;
  reason: string;
  video: { videoPublicId: string; videoUrl: string}
  description: string;
  totalAmount: number;
}

// Define the schema
const RefundRequestSchema: Schema<IRefundRequest> = new Schema(
  {
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    order_item_id: { type: Schema.Types.ObjectId, ref: 'OrderItem', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    status: {
      type: String,
        enum: [
          'Pending',      
          'Under Review',  
          'Approved',     
          'Rejected',     
          'Processing',    
          'Completed',    
          'Cancelled'     
        ],
        default: 'Pending',
    },
    video: {
      videoPublicId: { type: String , required: true },
      videoUrl: { type: String , required: true },
    },
    description: { type: String, required: true },
    reason: { type: String, required: true, trim: true },
    totalAmount: { type: Number, required: true, min: 1}
  },
  { timestamps: true }
);

// Create the model
const RefundRequest = mongoose.model<IRefundRequest>('RefundRequest', RefundRequestSchema);
export default RefundRequest;
