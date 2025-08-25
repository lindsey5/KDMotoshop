import { Types } from "mongoose";
import { socketInstance } from "../middlewares/socket"
import AdminNotification from "../models/AdminNotification";
import CustomerNotification from "../models/CustomerNotification"
import Admin from "../models/Admin";

export const sendCustomerNotification = async (newNotification : {to : string, order_id: string, content : string, refund_id?: string}) => {
    try{
        const notification = new CustomerNotification(newNotification)
        await notification.save();

        socketInstance?.to(newNotification.to).emit('customerNotification', notification);

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
    refund_id?: string;
}

export const sendAdminsNotification = async (notificationData : AdminNotificationData) => {
    try{
        const admins = await Admin.find();

        for(const admin of admins){
            const notification = new AdminNotification({...notificationData, to: admin._id});

            await notification.save();
            const admin_id = (admin._id as Types.ObjectId).toString();


            const completedNotification = await AdminNotification.findById(notification._id).populate('from');
            socketInstance?.to(admin_id).emit('adminNotification', completedNotification);
        }

    }catch(err : any){
        throw new Error(err.message)
    }
}