import { RedButton } from "../Button"

type ProductThumbnailProps = {
    product: Product;
    handleThumbnail: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProductThumbnail : React.FC<ProductThumbnailProps> = ({ product, handleThumbnail }) => {
    return (
        <div className="bg-white border-1 border-gray-300 p-5 rounded-lg shadow-lg">
            <strong>Product Thumbnail</strong>
            <div className="flex flex-col items-center gap-5 mt-4"> 
                <img 
                    className="w-[90%] bg-gray-100 h-[150px] lg:h-[230px]"
                    src={
                        typeof product.thumbnail === 'object' && product.thumbnail !== null && 'imageUrl' in product.thumbnail
                        ? product.thumbnail.imageUrl
                            : typeof product.thumbnail === 'string'
                            ? product.thumbnail
                        : '/photo.png'
                                    }
                />
                <input
                    type="file"
                    accept="image/*"
                    id="thumbnail-input"
                    style={{ display: 'none' }}
                    onChange={handleThumbnail}
                />
                <label htmlFor="thumbnail-input">
                    <RedButton component="span">Add Thumbnail</RedButton>
                </label>
            </div>
        </div>
    )

}
export default ProductThumbnail;