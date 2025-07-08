type Cart = {
    _id?: string;
    customer_id: string;
    product_id: string;
    variant_id: string | null;
    quantity: number;
}