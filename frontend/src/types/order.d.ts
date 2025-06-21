interface Order{
    _id?: string;
    total: number;
    subtotal: number;
    status: "Pending" | "Accepted" | "Shipped" | "Completed" | "Rejected" | "Cancelled"
    order_items: OrderItem[]
    customer_name?: string;
    address?: {
        street: string;
        barangay: string;
        city: string;
        zip_code: string;
        country: string;
    };
    customer_phone?: string;
    payment_method: "Cash" | "Card" | "Gcash" | "Other";
    note?: string;
}

interface OrderItem{
    _id?: string;
    product_id: string;
    variant_id?: string;
    attributes?: { [key: string]: string }
    stock: number;
    product_name: string;
    quantity: number;
    price: number;
    lineTotal: number;
}