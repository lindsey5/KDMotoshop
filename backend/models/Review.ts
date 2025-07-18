import mongoose, { Schema, Types } from 'mongoose';

export interface IReview extends Document{
    rating: number;
    review: string;
    customer_id: Types.ObjectId;
    product_id: Types.ObjectId;
    orderItemId: Types.ObjectId;
}

// Define the schema
const ReviewSchema: Schema<IReview> = new Schema(
  {
    rating: { type: Number, required: true },
    review: { type: String, required: false },
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    orderItemId: { type: Schema.Types.ObjectId, ref: 'OrderItem', required: true },
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  },
  { timestamps: true }
);

// Create the model
const Review = mongoose.model<IReview>('Review', ReviewSchema);
export default Review;
