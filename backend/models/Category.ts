import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICategory extends Document {
    category_name: string;
    added_by: Types.ObjectId,
}

// Define the schema
const CategorySchema: Schema<ICategory> = new Schema(
  {
    category_name: { type: String,  required: true },
    added_by: { type: Schema.Types.ObjectId, ref: 'Admin', required: true }
  },
  { timestamps: true }
);


// Create the model
const Category = mongoose.model<ICategory>('Category', CategorySchema);
export default Category;
