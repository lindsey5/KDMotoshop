import { RedButton } from "../Button"
import Card from "../Card";
import { ProductThumbnail } from "../Image";

type AddProductThumbnailProps = {
    product: Product;
    handleThumbnail: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddProductThumbnail : React.FC<AddProductThumbnailProps> = ({ product, handleThumbnail }) => {
    return (
        <Card>
            <strong>Product Thumbnail</strong>
            <div className="flex flex-col items-center gap-5 mt-4"> 
                <ProductThumbnail product={product} className="w-[90%] bg-gray-100 h-[150px] lg:h-[230px]"/>
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
export default AddProductThumbnail;