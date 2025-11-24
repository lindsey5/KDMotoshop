import mongoose, { Document, Schema, Types } from 'mongoose';
import { UploadedImage } from '../types/types';
import { getProductDailyDemand } from '../services/orderService';
import PurchaseOrderItem from './PurchaseOrderItem';

interface Variant {
  _id: Types.ObjectId;
  sku: string;
  image?: UploadedImage;
  price: number;
  stock: number;
  attributes: Map<string, string>;
}

export interface IProduct extends Document {
  product_name: string;
  description: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  product_type: 'Single' | 'Variable';
  visibility: 'Published' | 'Hidden' | 'Deleted';
  weight: number;
  added_by: Types.ObjectId;
  images: UploadedImage[];
  thumbnail: UploadedImage;
  variants: Variant[];
  attributes: string[];
  rating: number;
  default_lead_time?: number;

  getCurrentStock(sku?: string): number;
  getLeadTime(): Promise<number>;
  getDailySales(sku?: string): Promise<any[]>;
  getSafetyStock(sku?: string, serviceLevel?: number): Promise<number>;
  getReorderLevel(sku?: string, serviceLevel?: number): Promise<number>;
  getStockStatus(sku?: string, opts?: { serviceLevel?: number; reviewPeriodDays?: number }): Promise<{ 
    reorderLevel: number; 
    currentStock: number; 
    status: 'Overstock' | 'Understock' | 'Balanced' | 'Out of Stock';
    amount: number;
    optimalStockLevel: number;
  }>;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    product_name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    sku: { type: String },
    price: { type: Number },
    stock: { type: Number },
    weight: { type: Number, required: true, default: 0 },
    product_type: { type: String, required: true },
    visibility: { type: String, required: true, enum: ['Published', 'Hidden', 'Deleted'] },
    added_by: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    images: {
      type: [
        {
          imageUrl: { type: String, required: true },
          imagePublicId: { type: String, required: true },
        },
      ],
      required: true,
    },
    thumbnail: {
      type: {
        imageUrl: { type: String, required: true },
        imagePublicId: { type: String, required: true },
      },
      required: true,
    },
    variants: {
      type: [
        {
          sku: { type: String, required: true },
          price: { type: Number, required: true },
          stock: { type: Number, required: true },
          attributes: { type: Map, of: String, required: true },
        },
      ],
    },
    attributes: { type: [String] },
    rating: { type: Number, default: 0 },

    // added explicit default lead time so getLeadTime has a guaranteed fallback
    default_lead_time: { type: Number, default: 5 },
  },
  { timestamps: true }
);

// Helper: map service level to Z-score (approximate)
function zForServiceLevel(serviceLevel = 0.95): number {
  // common mappings; add more if needed
  const map: Record<number, number> = {
    0.5: 0.0,
    0.8: 0.8416,
    0.9: 1.2816,
    0.95: 1.6449, // typically 1.645
    0.975: 1.96,
    0.99: 2.3263,
  };
  // try exact match first, otherwise interpolate/choose nearest
  if (map[serviceLevel]) return map[serviceLevel];
  // fallback: use 1.645 for ~95%
  return 1.645;
}

// Get current stock 
ProductSchema.methods.getCurrentStock = function (sku?: string): number {
  if (this.product_type === 'Variable' && sku) {
    const variant = this.variants.find((v: Variant) => v.sku === sku);
    return variant?.stock ?? 0;
  }
  return this.stock ?? 0;
};

// Lead time - product level. Returns average lead time in days.
ProductSchema.methods.getLeadTime = async function (): Promise<number> {
  const leadTimes = await PurchaseOrderItem.aggregate([
    {
      $match: { product: this._id },
    },
    {
      $lookup: {
        from: 'purchaseorders',
        localField: 'purchase_order',
        foreignField: '_id',
        as: 'po',
      },
    },
    { $unwind: '$po' },
    {
      $match: {
        'po.status': 'Received',
        'po.receivedDate': { $exists: true },
        'po.createdAt': { $exists: true },
      },
    },
    {
      $sort: { 'po.createdAt': -1 },
    },
    { $limit: 60 }, 
    {
      $project: {
        leadTimeDays: {
          $divide: [{ $subtract: ['$po.receivedDate', '$po.createdAt'] }, 1000 * 60 * 60 * 24],
        },
      },
    },
    {
      $group: {
        _id: null,
        avgLeadTime: { $avg: '$leadTimeDays' },
      },
    },
  ]);

  const avg = leadTimes.length > 0 && leadTimes[0].avgLeadTime ? leadTimes[0].avgLeadTime : null;
  const fallback = typeof this.default_lead_time === 'number' ? this.default_lead_time : 5;
  const leadTime = avg !== null ? Number(avg) : fallback;

  // ensure positive, non-zero
  return Math.max(1, Math.round(leadTime * 100) / 100); // round to 2 decimals but at least 1 day
};

// getDailySales
ProductSchema.methods.getDailySales = async function (sku?: string): Promise<any[]> {
  if (this.product_type === 'Variable') {
    return await getProductDailyDemand(this._id, sku);
  } else {
    return await getProductDailyDemand(this._id);
  }
};

// Safety Stock formula: SS = Z * σ_demand * sqrt(leadTime)
// serviceLevel is between 0 and 1 (default 0.95)
ProductSchema.methods.getSafetyStock = async function (sku?: string, serviceLevel = 0.95): Promise<number> {
  const dailySales = await this.getDailySales(sku);

  // if not enough history, return 0 (or you may return a minimum safety stock)
  if (!dailySales || dailySales.length < 2) return 0;

  const salesArray: number[] = dailySales.map((d: any) => Number(d.totalQuantity ?? 0));

  // compute mean
  const mean = salesArray.reduce((a, b) => a + b, 0) / salesArray.length;

  // sample variance (n-1) to avoid underestimation for small samples
  const variance =
    salesArray.length > 1
      ? salesArray.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / (salesArray.length - 1)
      : 0;

  const stdDev = Math.sqrt(variance);

  const Z = zForServiceLevel(serviceLevel);
  const leadTime = await this.getLeadTime(); 

  // if lead time <= 0, use default
  const safeLeadTime = Math.max(1, leadTime);

  const ss = Z * stdDev * Math.sqrt(safeLeadTime);

  return Math.max(0, Math.round(ss));
};

// Reorder Level = (Average Daily Demand * Lead Time) + Safety Stock
ProductSchema.methods.getReorderLevel = async function (sku?: string, serviceLevel = 0.95): Promise<number> {
  const safetyStock = await this.getSafetyStock(sku, serviceLevel);
  const dailySales = await this.getDailySales(sku);

  if (!dailySales || dailySales.length === 0) return 0;

  const salesArray: number[] = dailySales.map((d: any) => Number(d.totalQuantity ?? 0));
  const avgDailyDemand = salesArray.reduce((a, b) => a + b, 0) / salesArray.length;

  const leadTime = await this.getLeadTime();
  const safeLeadTime = Math.max(1, leadTime);

  const rop = avgDailyDemand * safeLeadTime + safetyStock;
  return Math.max(0, Math.round(rop));
};

// Stock status with suggested amount and optimal stock level
ProductSchema.methods.getStockStatus = async function (
  sku?: string,
  opts: { serviceLevel?: number; reviewPeriodDays?: number } = {}
): Promise<{
  reorderLevel: number;
  currentStock: number;
  status: 'Overstock' | 'Understock' | 'Balanced' | 'Out of Stock';
  amount: number;
  optimalStockLevel: number;
}> {
  const serviceLevel = opts.serviceLevel ?? 0.95;
  const reviewPeriodDays = opts.reviewPeriodDays ?? 7; // typical review period (days)

  const reorderLevel = await this.getReorderLevel(sku, serviceLevel);
  const currentStock = this.getCurrentStock(sku);

  // compute avgDailyDemand to build a more meaningful optimal stock level
  const dailySales = await this.getDailySales(sku);
  const salesArray: number[] = (dailySales || []).map((d: any) => Number(d.totalQuantity ?? 0));
  const avgDailyDemand = salesArray.length > 0 ? salesArray.reduce((a, b) => a + b, 0) / salesArray.length : 0;

  const safetyStock = await this.getSafetyStock(sku, serviceLevel);
  const leadTime = await this.getLeadTime();

  // Optimal stock = avg demand during lead time + demand during review period + safety stock
  // i.e., target inventory after replenishment to cover lead time + review period
  const optimalStockLevel = Math.max(
    0,
    Math.round(avgDailyDemand * (leadTime + reviewPeriodDays) + safetyStock)
  );

  let status: 'Overstock' | 'Understock' | 'Balanced' | 'Out of Stock';
  let amount: number;

  if (currentStock === 0) {
    status = 'Out of Stock';
    amount = optimalStockLevel > 0 ? optimalStockLevel : 10; // fallback suggested amount
  } else if (optimalStockLevel === 0) {
    status = 'Balanced';
    amount = 0;
  } else if (currentStock <= reorderLevel) {
    status = 'Understock';
    amount = Math.max(0, optimalStockLevel - currentStock);
  } else if (currentStock > optimalStockLevel) {
    status = 'Overstock';
    amount = currentStock - optimalStockLevel;
  } else {
    status = 'Balanced';
    amount = 0;
  }

  return { reorderLevel, currentStock, status, amount, optimalStockLevel };
};

const Product = mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
