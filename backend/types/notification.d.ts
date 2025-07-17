export interface INotification extends Document {
    to: Types.ObjectId;
    order_id:  Types.ObjectId;
    content: string;
    isViewed: boolean;
}