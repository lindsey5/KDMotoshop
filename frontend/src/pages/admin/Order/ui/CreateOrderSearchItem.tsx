import useDarkmode from "../../../../hooks/useDarkmode";
import { cn } from "../../../../utils/utils";

const ProductSearchItem = ({ product, addItem } : { product : Product, addItem : (product : Product) => void}) => {
    const isDark = useDarkmode();
    const stock = product.product_type === 'Variable' ? product.variants.reduce((total, variant) => total + (variant.stock ?? 0) ,0) : product.stock
    
    return (
        <div 
            className={cn("flex gap-5 p-2 hover:bg-gray-100 cursor-pointer", isDark && 'hover:bg-gray-700')}
            onClick={() => stock ? addItem(product) : ''}
        >
            <img 
                className="bg-gray-100 w-20 h-20 object-contain"
                src={
                    typeof product.thumbnail === 'object' && product.thumbnail !== null && 'imageUrl' in product.thumbnail
                        ? product.thumbnail.imageUrl
                            : typeof product.thumbnail === 'string'
                        ? product.thumbnail
                    : '/photo.png'
                }
            />
            <div className="flex flex-col gap-3">
                <h1>{product.product_name}</h1>
                {stock === 0 ? <p className="text-red-500">Out of stock</p> : <p>Stock: {stock}</p>}   
            </div>
        </div>
    )
}

export default ProductSearchItem