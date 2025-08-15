type Order = {
    _id?: string;
    order_id?: string;
    order_source: 'Store' | 'Website' | 'Facebook' | 'Shopee' | 'Lazada' | 'Tiktok';
    shipping_fee: number;
    total: number;
    subtotal: number;
    status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Rejected" | "Cancelled" | "Refunded" | "Failed" |"Rated";
    customer: {
        customer_id?: string | UploadedImage;
        image?: string; 
        email?: string;
        firstname: string;
        lastname: string;
        phone?: string;
    };
    address?: {
        street: string;
        barangay: string;        
        city: string;
        region: string;
    };
    payment_method: "CASH" | "GCASH" | "PAYMAYA" | "CARD";
    createdBy?: any;
    createdAt?: Date;
    updatedAt?: Date;
    orderItems?: OrderItem[];
}

type OrderItem = {
    _id?: string;
    order_id?: string;
    product_id: string;
    variant_id?: string;
    attributes?: { [key: string]: string }
    stock?: number;
    product_name: string;
    quantity: number;
    price: number;
    lineTotal: number;
    image:  string | null,
    status: 'Unfulfilled' | 'Fulfilled' | 'Refunded' | 'Rated' | 'Cancelled',
    refund_status?: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Processing' | 'Completed' | 'Cancelled';
    weight: number;
    createdAt?: Date;
}