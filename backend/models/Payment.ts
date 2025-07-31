import mongoose, { Schema, Types } from 'mongoose';

interface IPayment extends Document{
    order_id: Types.ObjectId;
    payment_id: string;
    status: 'Paid' | 'Refunded'
}

// Define the schema
const PaymentSchema: Schema<IPayment> = new Schema(
  {
    order_id: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    payment_id: { type: String, required: true },
    status: { type: String, default: 'Paid', enum: ['Paid', 'Refunded']}
  },
  { timestamps: true }
);

// Create the model
const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
export default Payment;
