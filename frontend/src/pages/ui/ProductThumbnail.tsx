import { cn } from "../../utils/utils"

const ProductThumbnail = ({ product, className } : { product : Product | undefined, className?: string}) => {
    return (
        <img 
            className={cn(className)}
            src={
                typeof product?.thumbnail === 'object' && product.thumbnail !== null && 'imageUrl' in product.thumbnail
                ? product.thumbnail.imageUrl
                    : typeof product?.thumbnail === 'string'
                    ? product.thumbnail
                : '/photo.png'
            }
        />
    )
}

export default ProductThumbnail