interface RefundOrderItem extends Omit<OrderItem, 'product_id'>{
    product_id: {
        product_name: string;
        thumbnail: UploadedImage;
    },
    order_id: Order
}

interface RefundRequest {
    _id?: string;
    customer_id: {
        email: string;
        firstname: string;
        lastname: string;
        image: UploadedImage;
    };
    order_item_id: RefundOrderItem;
    quantity: number;
    status:
    | 'Pending'
    | 'Under Review'
    | 'Approved'
    | 'Rejected'
    | 'Processing'
    | 'Completed'
    price: Number;
    reason: string;
    video: { videoPublicId: string; videoUrl: string}
    description: string;
    totalAmount: number;
    createdAt?: Date;
}