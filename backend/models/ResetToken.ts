import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IResetToken extends Document {
    customer_id: Types.ObjectId;
    resetPasswordToken: string;
    resetPasswordExpire: Date;
}

// Define the schema
const ResetTokenSchema: Schema<IResetToken> = new Schema(
  {
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    resetPasswordToken: { type: String, required: true },
    resetPasswordExpire: { type: Date, required: true }
  },
  { timestamps: true }
);


// Create the model
const ResetToken = mongoose.model<IResetToken>('ResetToken', ResetTokenSchema);
export default ResetToken;
