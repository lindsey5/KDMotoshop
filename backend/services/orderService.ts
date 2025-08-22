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
                if(newStock < 5) {
                    await sendLowStockAlert(
                        product._id as string,
                        product.product_name,
                        product.thumbnail.imageUrl,
                        variant.sku,
                        variant.stock,
                        current_stock
                    );
                }
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
        if(newStock < 5) {
            await sendLowStockAlert(
                product._id as string,
                product.product_name,
                product.thumbnail.imageUrl,
                product.sku,
                product.stock,
                current_stock
            );
        }
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