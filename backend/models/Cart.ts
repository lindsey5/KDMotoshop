import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICart extends Document {
    customer_id: Types.ObjectId;
    product_id: Types.ObjectId;
    variant_id?: string;
    quantity: number;
}

// Define the schema
const CartSchema: Schema<ICart> = new Schema(
  {
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variant_id: { type: String, required: false },
    quantity: { type: Number, required: true}
  },
  { timestamps: true }
);


// Create the model
const Cart = mongoose.model<ICart>('Cart', CartSchema);
export default Cart;
