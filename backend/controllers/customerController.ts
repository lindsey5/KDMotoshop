import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
import Customer from "../models/Customer";
import { deleteImage, uploadImage } from "../services/cloudinary";


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
      if(update.image.imagePublicId && update.image.imageUrl) await deleteImage(update.image.imageUrl)
      if (uploaded) update.image = uploaded;
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
