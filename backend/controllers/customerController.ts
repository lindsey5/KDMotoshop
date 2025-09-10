import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
import Customer from "../models/Customer";
import { deleteImage, uploadImage } from "../services/cloudinary";
import { isUserOnline } from "../middlewares/socket";


export const getCustomerById = async (req : AuthenticatedRequest, res: Response) => {
    try{
        const customer = await Customer.findById(req.user_id);

        res.status(200).json({ success: true, customer});

    }catch(err : any){
        res.status(500).json({ success: false, message: err.message })
    }
}

export const updateCustomer = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { image, ...rest } = req.body;

    let update: any = rest;

    if (image && typeof image === 'string') {
      const uploaded = await uploadImage(image);

      if(update.image?.imagePublicId && update.image?.imageUrl) await deleteImage(update.image.imageUrl)
      if(uploaded) update.image = uploaded;
    }

    const customer = await Customer.findByIdAndUpdate(
      req.user_id,
      { $set: update },
      { new: true } 
    );

    if (!customer) {
      res.status(404).json({ success: false, message: "Customer not found" });
      return;
    }

    res.status(200).json({ success: true, customer });

  } catch (err: any) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getCustomers = async (req: AuthenticatedRequest, res: Response) => {
  try{
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const searchTerm = req.query.searchTerm;

    let filter: any = {};
    if (searchTerm) {
      filter.$or = [
        { email: { $regex: searchTerm, $options: 'i' } },
        { firstname: { $regex: searchTerm, $options: 'i' } },
        { lastname: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    const [customers, totalCustomers] = await Promise.all([
      Customer.find(filter).skip(skip).limit(limit),
      Customer.countDocuments(filter)
    ])

    const customersWithLastOrder = await Promise.all(customers.map(async (customer) => {
      const lastOrder = await customer.getLastOrder();
      const completedOrders = await customer.getTotalCompletedOrders();
      const pendingOrders = await customer.getTotalPendingOrders();
      const isOnline = await isUserOnline(customer._id.toString());

      return { ...customer.toJSON(), lastOrder, pendingOrders, completedOrders, isOnline }

    }))
    
    res.status(200).json({ 
      success: true, 
      customers: customersWithLastOrder,
      totalPages: Math.ceil(totalCustomers / limit),
      page,
      totalCustomers
    })

  }catch (err: any) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
}