import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import Product from "../models/Product";

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

export const createNewOrder = async ({ orderItems, order} : { orderItems : OrderItem[], order: Order}) => {
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

    const savedOrder = await newOrder.save();

    return savedOrder
}