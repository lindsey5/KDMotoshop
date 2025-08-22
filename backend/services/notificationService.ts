import { Types } from "mongoose";
import { socketInstance, userSocketMap } from "../middlewares/socket"
import AdminNotification from "../models/AdminNotification";
import CustomerNotification from "../models/CustomerNotification"
import Admin from "../models/Admin";

export const sendCustomerNotification = async (customer_id : string, order_id: string, content : string) => {
    try{
        const notification = new CustomerNotification({
            to: customer_id,
            order_id,
            content,
        })

        await notification.save();

        const socketId = userSocketMap.get(customer_id);

        if(socketId){
            socketInstance?.to(socketId).emit('customerNotification', notification);
        }

    }catch(err : any){
        throw new Error(err.message)
    }
}

type AdminNotificationData = {
    from: string;
    order_id?: string;
    product_id?: string;
    content: string;
    review_id?: string;
}

export const sendAdminsNotification = async (notificationData : AdminNotificationData) => {
    try{
        const admins = await Admin.find();

        for(const admin of admins){
            const notification = new AdminNotification({...notificationData, to: admin._id});

            await notification.save();
            const admin_id = (admin._id as Types.ObjectId).toString();

            const socketId = userSocketMap.get(admin_id as string);

            const completedNotification = await AdminNotification.findById(notification._id).populate('from');
            if(socketId) socketInstance?.to(socketId).emit('adminNotification', completedNotification);
        }

    }catch(err : any){
        throw new Error(err.message)
    }
}