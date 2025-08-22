import Cart from "../models/Cart";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import Product from "../models/Product";
import { ICart } from "../models/Cart";
import { sendAdminsNotification } from "./notificationService";
import { sendLowStockAlert } from "./alertService";

export const generateOrderId = async () : Promise<string> => {
  const prefix = 'ORD-';
  const order_id = prefix + Math.random().toString(36).substring(2, 10).toUpperCase();
  
  const existingOrder = await Order.findOne({ order_id });

  // If it exists, retry
  if (existingOrder) {
    return generateOrderId();
  }

  return order_id;
};

export const decrementStock = async (item : any) => {
    if (item.product_type === 'Variable') {
        const product = await Product.findById(item.product_id);
        await Product.updateOne(
            {  _id: item.product_id,  "variants.sku": item.sku },
            { $inc: { "variants.$.stock": -item.quantity } }
        );
        if(!product) return;
        for(const variant of product.variants){
            if(variant.sku === item.sku){
                const current_stock = variant.stock;
                const newStock = variant.stock - item.quantity;
                variant.stock = newStock;
                
            }
        }

        product.markModified('variants');
        await product.save();
        
    } else {
        await Product.updateOne(
            { _id: item.product_id },
            { $inc: { stock: -item.quantity } }
        );
        const product = await Product.findById(item.product_id);

        if (!product) return;
        const current_stock = product.stock;
        const newStock = product.stock - item.quantity;
        product.stock = newStock;
        await product.save();
        
    }
}

export const createNewOrder = async ({ orderItems, order, cart } : { orderItems : OrderItem[], order: Order, cart?: ICart[]}) : Promise<any> => {
    try{
        const newOrder = new Order(order);

        const orderItemsWithOrderID = orderItems.map((item: any) => (
            {
                ...item, 
                order_id: newOrder._id,
                status: order.status === 'Delivered' ? 'Fulfilled' : 'Unfulfilled'
            }
        ));   

        await OrderItem.insertMany(orderItemsWithOrderID)
            .then(async (items) => {
                if(newOrder.status === 'Delivered') {
                    for (const item of items) await decrementStock(item)
                }
            })  
            .catch((error) => {
                throw new Error(`Failed to save order items: ${error.message}`);
        });

        if(cart){
            for(const item of cart){
                await Cart.findByIdAndDelete(item._id);
            }
        }

        const savedOrder = await newOrder.save();

        const customer = order.customer

        if(customer.customer_id){
            await sendAdminsNotification({
                from: customer.customer_id.toString(),
                order_id: savedOrder._id as string,
                content: `New order placed by ${customer.firstname} ${customer.lastname}`
            });
        }

        return savedOrder
    }catch(err : any){
        console.log(err)
        return null
    }
}

export const getAvgDailyDemandPerProduct = async () => {
  const result = await OrderItem.aggregate([
    {
      $match: {
        status: { $in: ["Fulfilled", "Rated"] } // only count completed sales
      }
    },
    {
      // group per product per day
      $group: {
        _id: {
          product: "$product_id",
          day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
        },
        totalQty: { $sum: "$quantity" }
      }
    },
    {
      // average per product across days
      $group: {
        _id: "$_id.product",
        avgDailyDemand: { $avg: "$totalQty" }
      }
    },
    {
      $lookup: {
        from: "products", // make sure collection name is correct
        localField: "_id",
        foreignField: "_id",
        as: "product"
      }
    },
    {
      $unwind: { path: "$product", preserveNullAndEmptyArrays: true }
    },
    {
      $project: {
        _id: 0,
        product_id: "$_id",
        product_name: "$product.product_name",
        sku: "$product.sku",
        avgDailyDemand: 1
      }
    }
  ]);

  return result;
}
