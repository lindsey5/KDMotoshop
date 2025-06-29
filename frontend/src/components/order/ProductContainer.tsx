import { formatNumber } from "../../utils/utils"
import { RedButton } from "../Button"
import Card from "../Card";

const ProductContainer = ({ product, addOrder } : { product : Product, addOrder: (product : Product) => void}) => {
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
            <RedButton onClick={() => addOrder(product)} disabled={product.stock === 0}>Add</RedButton>
        </Card>
    )
}

export default ProductContainer;