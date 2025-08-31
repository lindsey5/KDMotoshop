import ActivityLog from "../models/ActivityLog";

type ActivityLogType = {
    admin_id: string;
    description: string;
    product_id?: string;
    order_id?: string;
    supplier_id?: string;
    po_id?: string;
    prev_value?: string;
    new_value?: string;
}

export const create_activity_log = async (activityLog : ActivityLogType) => {
    try{
        const newActivity = new ActivityLog(activityLog);

        await newActivity.save();

        return newActivity

    }catch(err : any){
        throw new Error(err.message)
    }
}