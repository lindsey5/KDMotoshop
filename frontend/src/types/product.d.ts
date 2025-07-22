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

type UploadedImage = {
  imageUrl: string;
  imagePublicId: string;
};

type Product = {
    _id?: string;
    product_name: string;
    description: string;
    category: string;
    sku?: string | null;
    price?: number | null; 
    stock?: number | null;
    product_type: "Single" | "Variable" | string;
    visibility: string;
    added_by?: Admin; 
    images: (UploadedImage | string | ArrayBuffer)[], 
    thumbnail: UploadedImage | string | ArrayBuffer | null,
    weight: number;
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