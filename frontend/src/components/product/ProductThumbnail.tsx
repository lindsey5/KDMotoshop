import { RedButton } from "../Button"
import Card from "../Card";

type ProductThumbnailProps = {
    product: Product;
    handleThumbnail: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProductThumbnail : React.FC<ProductThumbnailProps> = ({ product, handleThumbnail }) => {
    return (
        <Card>
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
        </Card>
    )

}
export default ProductThumbnail;