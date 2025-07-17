import { socketInstance, userSocketMap } from "../middlewares/socket"
import CustomerNotification from "../models/CustomerNotification"

export const sendCustomerNotification = async (customer_id : string, order_id: string, content : string, status: string) => {
    try{
        const notification = new CustomerNotification({
            to: customer_id,
            order_id,
            content,
        })

        await notification.save();

        const socketId = userSocketMap.get(customer_id);
        
        console.log(socketId)

        if(socketId){
            socketInstance?.to(socketId).emit('customerNotification', {...notification.toObject(), status});
        }

    }catch(err : any){
        throw new Error(err.message)
    }

}