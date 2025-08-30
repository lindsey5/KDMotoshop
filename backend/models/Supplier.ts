import { Schema, model } from 'mongoose';

interface ISupplier extends Document {
  name: string;
  email: string;
  phone: string;
  status: string;
}

const SupplierSchema : Schema<ISupplier> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  { timestamps: true }
);

const Supplier = model<ISupplier>('Supplier', SupplierSchema);

export default Supplier;