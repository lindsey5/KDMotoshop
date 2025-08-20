type Cart = {
    _id?: string;
    customer_id: string;
    product_id: string;
    sku: string;
    product_type: 'Single' | 'Variable';
    quantity: number;
}

type CartItem = Cart & {
    attributes: { [key : string] : string} | null,
    stock: number; 
    product_name: string;
    price: number;
    image: string;
    product_type: 'Single' | 'Variable';
    isSelected: boolean;
}