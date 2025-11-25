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
  createdAt: Date;

  getCurrentStock(sku?: string): number;
  getSafetyStock(dailySales: any[]): Promise<number>;
  getDailySales(sku?: string): Promise<any[]>;
  getLeadTime(sku?: string): Promise<number>;
  getStockStatus(sku?: string): Promise<{
    reorderLevel: number;
    currentStock: number;
    status: 'Overstock' | 'Understock' | 'Balanced' | 'Out of Stock';
    amount: number;
    optimalStockLevel: number;
  }>;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    product_name: { type: String, required: true },
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
  },
  { timestamps: true }
);

// Get current stock
ProductSchema.methods.getCurrentStock = function (sku?: string): number {
  if (this.product_type === 'Variable' && sku) {
    const variant = this.variants.find((v: Variant) => v.sku === sku);
    return variant?.stock ?? 0;
  }
  return this.stock ?? 0;
};

// Lead time in days
ProductSchema.methods.getLeadTime = async function (sku?: string): Promise<number> {
  const leadTimes = await PurchaseOrderItem.aggregate([
    { $match: { sku } },
    {
      $lookup: {
        from: 'purchaseorders',
        localField: 'purchase_order',
        foreignField: '_id',
        as: 'po',
      },
    },
    { $unwind: '$po' },
    { $match: { 'po.status': 'Received' } },
    { $sort: { 'po.createdAt': -1 } },
    { $limit: 30 },
    {
      $project: {
        leadTime: {
          $divide: [{ $subtract: ['$po.receivedDate', '$po.createdAt'] }, 1000 * 60 * 60 * 24],
        },
      },
    },
    { $group: { _id: null, avgLeadTime: { $avg: '$leadTime' } } },
  ]);

  return leadTimes.length > 0 ? leadTimes[0].avgLeadTime : 5;
};

// Get daily sales
ProductSchema.methods.getDailySales = async function (sku?: string): Promise<any[]> {
  if (this.product_type === 'Variable') {
    return getProductDailyDemand(this._id, sku);
  }
  return getProductDailyDemand(this._id);
};

// Safety Stock = Z * √( (Average Lead Time × σ²_demand) + (Average Demand² × σ²_leadtime) )
ProductSchema.methods.getSafetyStock = async function (
  dailySales: any[],
): Promise<number> {
  if (!dailySales.length) return 0;

  const salesArray: number[] = dailySales.map((d: any) => Number(d.totalQuantity ?? 0));
  const avgDailyDemand =
    salesArray.reduce((a, b) => a + b, 0) / salesArray.length;

  // Demand variance (σ²_demand)
  const demandVariance =
    salesArray.length > 1
      ? salesArray.map(x => Math.pow(x - avgDailyDemand, 2)).reduce((a, b) => a + b, 0) / (salesArray.length - 1)
      : 0;

  // Lead time variance (σ²_leadtime)
  const leadTimesArray = await PurchaseOrderItem.aggregate([
    { $match: { sku: this.sku } },
    {
      $lookup: {
        from: 'purchaseorders',
        localField: 'purchase_order',
        foreignField: '_id',
        as: 'po',
      },
    },
    { $unwind: '$po' },
    { $match: { 'po.status': 'Received' } },
    { $sort: { 'po.createdAt': -1 } },
    { $limit: 30 },
    {
      $project: {
        leadTimeDays: {
          $divide: [{ $subtract: ['$po.receivedDate', '$po.createdAt'] }, 1000 * 60 * 60 * 24],
        },
      },
    },
  ]);

  const leadTimes = leadTimesArray.map(l => l.leadTimeDays);
  const avgLeadTime = leadTimes.reduce((a, b) => a + b, 0) / (leadTimes.length || 1);

  const leadTimeVariance =
    leadTimes.length > 1
      ? leadTimes.map(l => Math.pow(l - avgLeadTime, 2)).reduce((a, b) => a + b, 0) / (leadTimes.length - 1)
      : 0;

  const Z = 1.65; // 95% service level

  const safetyStock = Z * Math.sqrt(
    (avgLeadTime * demandVariance) + (Math.pow(avgDailyDemand, 2) * leadTimeVariance)
  );

  return Math.round(safetyStock);
};

// Stock status calculation
ProductSchema.methods.getStockStatus = async function (
  sku?: string
): Promise<{
  reorderLevel: number;
  currentStock: number;
  status: 'Overstock' | 'Understock' | 'Balanced' | 'Out of Stock';
  amount: number;
  optimalStockLevel: number;
}> {
  const reviewPeriodDays = 7;

  const dailySales = await this.getDailySales(sku);
  const currentStock = this.getCurrentStock(sku);
  const leadTime = await this.getLeadTime(sku);
  const safetyStock = await this.getSafetyStock(dailySales);

  const salesArray: number[] = dailySales.map((d: any) => Number(d.totalQuantity ?? 0));
  const avgDailyDemand = salesArray.length > 0 ? salesArray.reduce((a, b) => a + b, 0) / salesArray.length : 0;

  const reorderLevel = Math.round(avgDailyDemand * leadTime + safetyStock);
  const optimalStockLevel = Math.max(0, Math.round(avgDailyDemand * (leadTime + reviewPeriodDays) + safetyStock));

  let status: 'Overstock' | 'Understock' | 'Balanced' | 'Out of Stock';
  let amount: number;

  if (currentStock === 0) {
    status = 'Out of Stock';
    amount = optimalStockLevel || 10;
  } else if (optimalStockLevel === 0) {
    status = 'Balanced';
    amount = 0;
  } else if (currentStock < reorderLevel) {
    status = 'Understock';
    amount = optimalStockLevel - currentStock;
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
