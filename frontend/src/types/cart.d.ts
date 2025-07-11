type Cart = {
    _id?: string;
    customer_id: string;
    product_id: string;
    variant_id: string | null;
    quantity: number;
}

type CartItem = Cart & {
    attributes: { [key : string] : string} | null,
    stock: number; 
    product_name: string;
    price: number;
    image: string;
}