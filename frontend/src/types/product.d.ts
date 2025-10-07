type Category = {
    _id: string;
    category_name: string;
    added_by: string;
}

type Variant = {
    _id?: string;
    sku: string;
    price: number | null;
    stock: number | null;
    attributes: {
        [key: string]: string;
    };
}

type Product = {
    _id?: string;
    product_name: string;
    description: string;
    category: string;
    sku?: string | null;
    price?: number | null; 
    stock?: number | null;
    product_type: "Single" | "Variable";
    visibility: string;
    added_by?: Admin; 
    images: (UploadedImage | string | ArrayBuffer)[], 
    thumbnail: UploadedImage | string | ArrayBuffer | null,
    variants: Variant[];
    attributes: string[];
    createdAt?: Date;
    rating?: number;
}

type TopProduct = {
    _id: string;
    product_name: string;
    image: string;
    stock: number;
    totalQuantity: number;
}

type Review = {
    _id: string;
    rating: number;
    review: string;
    customer_id: Customer;
    orderItemId: OrderItem;
    product_id: Product;
    createdAt: Date;
}

type ProductInventoryStatus = {
    _id: string;
    product_name: string;
    thumbnail: UploadedImage;
    product_type: string;
    sku: string;
    status: "Understock" | "Overstock" | "Balanced" | "Out of Stock";
    amount: number;
    reorderLevel: number;
    optimalStockLevel: number;
    stock: number;
}