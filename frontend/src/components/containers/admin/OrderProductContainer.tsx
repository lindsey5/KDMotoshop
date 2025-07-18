import { useEffect, useState } from "react";
import { formatNumber } from "../../../utils/utils"
import { RedButton } from "../../Button"
import Card from "../../cards/Card";
import { fetchData } from "../../../services/api";
import { Rating } from "@mui/material";

const OrderProductContainer = ({ product, addOrder } : { product : Product, addOrder: (product : Product) => void}) => {
    const stock = product.product_type === 'Variable' ? product.variants.reduce((total, variant) => total + (variant.stock ?? 0) ,0) : product.stock
    const [rating, setRating] = useState<number>(0);

    useEffect(() => {
        const get_reviews = async () => {
            const response = await fetchData(`/api/review/product/${product._id}`);
            if(response.success){
                setRating(response.rating)
            }
        }
    
        if(product) get_reviews();
    }, [product])

    return (
        <Card className="flex flex-col gap-4">
            <img 
                className="bg-gray-100 w-full h-40 2xl:h-50"
                src={
                    typeof product.thumbnail === 'object' && product.thumbnail !== null && 'imageUrl' in product.thumbnail
                    ? product.thumbnail.imageUrl
                        : typeof product.thumbnail === 'string'
                        ? product.thumbnail
                    : '/photo.png'
                }
            />
            <h1 className="font-bold text-lg">{product.product_name}</h1>
            <h1 className="font-bold text-lg">₱{formatNumber(product.price ? product.price :  Math.min(...product.variants.map(v => v.price || 0)))}</h1>
            {stock === 0 && <p className="text-red-500">Out of stock</p>}
            {rating !== 0 ? <Rating name="read-only" value={rating} readOnly /> : <p className="text-white">No Reviews</p>}
            <RedButton onClick={() => addOrder(product)} disabled={stock === 0}>Add</RedButton>
        </Card>
    )
}

export default OrderProductContainer;