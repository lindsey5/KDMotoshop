import { Types } from "mongoose";
import { io } from "../middlewares/socket"
import AdminNotification from "../models/AdminNotification";
import CustomerNotification from "../models/CustomerNotification"
import Admin from "../models/Admin";

export const sendCustomerNotification = async (newNotification : {to : string, order_id: string, content : string, refund_id?: string}) => {
    try{

        const notification = new CustomerNotification(newNotification)
        await notification.save();

        io?.to(newNotification.to).emit('customerNotification', notification);
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

export const sendAdminsNotification = async ({ notificationData, role, }: { notificationData: AdminNotificationData; role?: 'Admin' | 'Super Admin' }) => {
  try {
    // Build query
    const query = role
      ? { role } // specific role
      : { role: { $in: ['Admin', 'Super Admin'] } }; // default roles

    const admins = await Admin.find(query);

    for (const admin of admins) {
      // Create notification for each admin
      const notification = new AdminNotification({ ...notificationData, to: admin._id });
      await notification.save();

      const admin_id = (admin._id as Types.ObjectId).toString();

      // Populate 'from' field
      const completedNotification = await AdminNotification.findById(notification._id).populate('from');

      // Emit notification via Socket.IO
      io?.to(admin_id).emit('adminNotification', completedNotification);
    }
  } catch (err: any) {
    throw new Error(err.message);
  }
};
