interface Category{
    _id: string;
    category_name: string;
    added_by: string;
}

interface Variant{
    sku: string;
    image: UploadedImage | string | ArrayBuffer | null;
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

interface Product{
    _id?: string;
    product_name: string;
    description: string;
    category: string;
    sku?: string | undefined;
    price?: number | undefined; 
    stock?: number | undefined;
    product_type: string;
    visibility: string;
    added_by?: string; 
    images: (UploadedImage | string | ArrayBuffer)[], 
    thumbnail: UploadedImage | string | ArrayBuffer | null,
    variants: Variant[];
    attributes: string[];
    createdAt?: Date;
}