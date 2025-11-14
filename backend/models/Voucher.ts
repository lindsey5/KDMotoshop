import { Schema, Types, model, Document } from "mongoose";

export interface IVoucher extends Document {
  name: string;
  code: string;
  voucherType: "percentage" | "amount";  
  percentage?: number;
  amount?: number;
  minSpend: number;
  maxDiscount: number;
  startDate: Date;
  endDate: Date;
  usageLimit: number;
  usedCount: number;
  createdBy: Types.ObjectId;
}

const VoucherSchema = new Schema<IVoucher>(
  {
    name: { type: String, required: true },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    voucherType: {
      type: String,
      enum: ["percentage", "amount"],
      required: true
    },
    percentage: { type: Number, min: 0, max: 100 },
    amount: { type: Number, min: 0 },
    minSpend: { type: Number, default: 0, required: true },
    maxDiscount: { type: Number, default: 0, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true
    }
  },
  { timestamps: true }
);

const Voucher = model<IVoucher>("Voucher", VoucherSchema);

export default Voucher;
