import { formatNumber } from "../../../../utils/utils"
import { RedButton } from "../../../../components/buttons/Button"
import Card from "../../../../components/Card";
import { Rating } from "@mui/material";

const OrderProductContainer = ({ product, addOrder } : { product : Product, addOrder: (product : Product) => void}) => {
    const stock = product.product_type === 'Variable' ? product.variants.reduce((total, variant) => total + (variant.stock ?? 0) ,0) : product.stock

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
            {stock === 0 ? <p className="text-red-500">Out of stock</p> : <p>Stock: {stock}</p>}
            {product.rating !== 0 ? <Rating name="read-only" value={product.rating} readOnly /> : <p className="text-white">No Reviews</p>}
            <RedButton onClick={() => addOrder(product)} disabled={stock === 0}>Add</RedButton>
        </Card>
    )
}

export default OrderProductContainer;