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
    added_by?: string;
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
    sku?: string | undefined;
    price?: number | undefined; 
    stock?: number | undefined;
    product_type: "Single" | "Variable" | string;
    visibility: string;
    added_by?: string; 
    images: (UploadedImage | string | ArrayBuffer)[], 
    thumbnail: UploadedImage | string | ArrayBuffer | null,
    variants: Variant[];
    attributes: string[];
    createdAt?: Date;
}