import { formatNumber } from "../../utils/utils"
import { RedButton } from "../Button"

const ProductContainer = ({ product, addOrder } : { product : Product, addOrder: (product : Product) => void}) => {
    return (
        <div key={product._id} className="bg-white p-5 flex flex-col gap-4 border-1 border-gray-300 shadow-md rounded-md">
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
            <RedButton onClick={() => addOrder(product)}>Add</RedButton>
        </div>
    )
}

export default ProductContainer;