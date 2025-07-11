import Cart from "../models/Cart";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import Product from "../models/Product";
import { ICart } from "../models/Cart";

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
    if (item.variant_id) {
        await Product.updateOne(
            {  _id: item.product_id,  "variants._id": item.variant_id },
            { $inc: { "variants.$.stock": -item.quantity } }
        );
    } else {
        await Product.updateOne(
            { _id: item.product_id },
            { $inc: { stock: -item.quantity } }
        );
    }
}

export const incrementStock = async (item : any) => {
    if (item.variant_id) {
        await Product.updateOne(
            {  _id: item.product_id,  "variants._id": item.variant_id },
            { $inc: { "variants.$.stock": item.quantity } }
        );
    } else {
        await Product.updateOne(
            { _id: item.product_id },
            { $inc: { stock: item.quantity } }
        );
    }
}

export const createNewOrder = async ({ orderItems, order, cart } : { orderItems : OrderItem[], order: Order, cart?: ICart[]}) => {
    try{
        const newOrder = new Order(order);
        
        const orderItemsWithOrderID = orderItems.map((item: any) => (
            {
                ...item, 
                order_id: newOrder._id,
                status: order.status === 'Completed' ? 'Fulfilled' : 'Unfulfilled'
            }
        ));   
        await OrderItem.insertMany(orderItemsWithOrderID)
            .then(async (items) => {
                if(newOrder.status === 'Completed') {
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

        return savedOrder
    }catch(err : any){
        console.log(err)
        return null
    }
}