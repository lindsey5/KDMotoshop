import { Request, Response } from "express";
import PurchaseOrder from "../models/PurchaseOrder";
import PurchaseOrderItem from "../models/PurchaseOrderItem";

export const generatePOId = async () : Promise<string> => {
  const prefix = 'PO-';
  const po_id = prefix + Math.random().toString(36).substring(2, 10).toUpperCase();
  
  const existingOrder = await PurchaseOrder.findOne({ po_id });

  // If it exists, retry
  if (existingOrder) {
    return generatePOId();
  }

  return po_id;
};

export const createPurchaseOrder = async (req : Request, res : Response) => {
    try{
        const { purchase_items, ...purchaseOrder} = req.body.purchaseOrder;
        if (!purchase_items || purchase_items.length < 1) {
            res.status(400).json({
                success: false,
                message: "Purchase order must contain at least one item.",
            });

            return;
        }

        const po_id = await generatePOId()
        const newPurchaseOrder = new PurchaseOrder({...purchaseOrder, po_id});
        
        await newPurchaseOrder.save();

        await PurchaseOrderItem.insertMany(purchase_items.map((item : any) => ({...item, purchase_order: newPurchaseOrder._id })));
        const fullOrder = await PurchaseOrder.findById(newPurchaseOrder._id).populate(['purchase_items', 'supplier']);

        res.status(201).json({ success: true, purchaseOrder: fullOrder });

    }catch(err : any){
        console.log(err)
        res.status(500).json({ success: false, message: err.message || 'Server error'})
    }
}

export const getPurchaseOrders = async (req : Request, res : Response) => {
    try{
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const searchTerm = req.query?.searchTerm;
        const status = req.query?.status;

        let filter : any = { };

        if(searchTerm){
            filter.$or = [
                { 'supplier.name': { $regex: searchTerm, $options: 'i' } },
                { 'po_id': { $regex: searchTerm, $options: 'i' } },
            ]
        }
        
        if(status && status !== 'All'){
            filter.status = status;
        }

        const purchaseOrders = await PurchaseOrder
        .find(filter)
        .skip(skip)
        .limit(limit)
        .populate(['supplier', 'purchase_items'])
        .sort({ createdAt: -1 });
        const total = await PurchaseOrder.countDocuments(filter);

        res.status(200).json({ 
            success: true, 
            purchaseOrders,
            page,
            totalPages: Math.ceil(total / limit) 
        });

    }catch(err : any){
        console.log(err)
        res.status(500).json({ success: false, message: err.message || 'Server error'})
    }
}

export const getPurchaseOrderById = async (req: Request, res : Response) => {
    try{
        const purchaseOrder = await PurchaseOrder.findById(req.params.id).populate(['purchase_items', 'supplier']);
        if(!purchaseOrder){
            res.status(404).json({ success: false, message: 'Purchase Order not found.'})
            return;
        }

        res.status(200).json({ success: true, purchaseOrder });

    }catch(err : any){
        console.log(err)
        res.status(500).json({ success: false, message: err.message || 'Server error'})
    }
}