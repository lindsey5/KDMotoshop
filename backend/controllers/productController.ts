import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
import { deleteImage, uploadImage } from "../services/cloudinary";
import Product from "../models/Product";
import { UploadedImage } from "../types/types";

export const create_product = async (req : AuthenticatedRequest, res: Response) => {
    try{
        const product = req.body;

        const thumbnail = await uploadImage(product.thumbnail);
        const images = await Promise.all(product.images.map(async (image : string) => await uploadImage(image)))

        const variants = await Promise.all(product.variants.map(async (variant : any) => {
            const image = await uploadImage(variant.image)
            return { ...variant, image }
        }))

        const newProduct = new Product({ 
            ...product, 
            thumbnail, 
            images, 
            variants, 
            added_by: req.user_id 
        })

        await newProduct.save();

        res.status(201).json({ success: true, newProduct});

    }catch(err : any){
        res.status(500).json({ success: false, message: err.message });
    }
}

export const get_products = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;
  const searchTerm = req.query.searchTerm as string | undefined;
  const category = req.query.category as string | undefined;

  try {
    let filter: any = {};

    if (searchTerm) {
      filter.$or = [
        { product_name: { $regex: searchTerm, $options: "i" } },
        { sku: { $regex: searchTerm, $options: "i" } },
        { category: { $regex: searchTerm, $options: "i" } },
        { "variants.sku": { $regex: searchTerm, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      if (filter.$or) {
        filter = {
          $and: [
            filter,
            { category: category }
          ]
        };
      } else {
        filter.category = category;
      }
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("added_by")
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      products,
      page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const get_product_by_id = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if(!product){
      res.status(404).json({ success: false, message: 'Product not found'})
      return;
    }

    res.status(200).json({ success: true, product })

  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const update_product = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = req.body;

    const oldProduct = await Product.findById(id);
    if (!oldProduct) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    const isExist = await Product.findOne({_id: { $ne: id },  product_name: product.product_name });

    if (isExist) {
      res.status(400).json({ success: false, message: 'Product name already exists.'});
      return;
    }

    let thumbnail : UploadedImage | null = oldProduct.thumbnail;
    if (typeof product.thumbnail === 'string') {
      thumbnail = await uploadImage(product.thumbnail);
      await deleteImage(oldProduct.thumbnail.imagePublicId);
    }

    const images = await Promise.all(
      product.images.map(async (img : UploadedImage | string) => {
        if (typeof img === 'object') return img;

        return await uploadImage(img);
      })
    );

    for (const oldImg of oldProduct.images) {
      const stillUsed = images.find(newImg => newImg.imagePublicId === oldImg.imagePublicId);
      if (!stillUsed) await deleteImage(oldImg.imagePublicId);
    }

    const variants = await Promise.all(
      product.variants.map(async (variant: any, index: number) => {
        if (typeof variant.image === 'string') {
          const newImage = await uploadImage(variant.image);

          const oldVariant = oldProduct.variants[index];
          if (oldVariant && oldVariant.image?.imagePublicId) await deleteImage(oldVariant.image.imagePublicId);

          return { ...variant, image: newImage };
        }

        return variant; 
      })
    );

    for (let i = product.variants.length; i < oldProduct.variants.length; i++) {
        const oldVariant = oldProduct.variants[i];
        if (oldVariant?.image?.imagePublicId) await deleteImage(oldVariant.image.imagePublicId);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...product, thumbnail, images, variants },
      { new: true }
    );

    res.status(200).json({
      success: true,
      product: updatedProduct,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};