import mongoose, { Schema, Types } from 'mongoose';
import { UploadedImage } from '../types/types';

export interface IReview extends Document{
    rating: number;
    review: string;
    customer_id: Types.ObjectId;
    product_id: Types.ObjectId;
    orderItemId: Types.ObjectId;
    image: UploadedImage;
}

// Define the schema
const ReviewSchema: Schema<IReview> = new Schema(
  {
    rating: { type: Number, required: true },
    review: { type: String, required: false },
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    orderItemId: { type: Schema.Types.ObjectId, ref: 'OrderItem', required: true },
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    image: {
      type: {
        imageUrl: { type: String, required: true },
        imagePublicId: { type: String, required: true },
      },
    },
  },
  { timestamps: true }
);

// Create the model
const Review = mongoose.model<IReview>('Review', ReviewSchema);
export default Review;
