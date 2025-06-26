type Order = {
    _id?: string;
    order_id?: string;
    order_source: 'Store' | 'Website' | 'Facebook' | 'Shopee' | 'Lazada';
    shipping_fee: number;
    total: number;
    subtotal: number;
    status: "Pending" | "Accepted" | "Shipped" | "Completed" | "Rejected" | "Cancelled" | "Refunded";
    customer: {
        customer_id?: string;
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
    payment_method: "Cash" | "GCash" | "Other";
    note?: string;
    createdBy?: string;
    createdAt?: Date;
    orderItems?: OrderItem[];
}

type OrderItem = {
    _id?: string;
    product_id: string;
    variant_id?: string;
    attributes?: { [key: string]: string }
    stock?: number;
    product_name: string;
    quantity: number;
    price: number;
    lineTotal: number;
    image:  string | null,
    status: 'Unfulfilled' | 'Fulfilled' | 'Refunded' | 'Cancelled'
}