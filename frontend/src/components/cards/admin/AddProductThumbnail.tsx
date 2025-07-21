import { RedButton } from "../../Button"
import Card from "../Card";
import ProductThumbnail from "../../images/ProductThumbnail";

type AddProductThumbnailProps = {
    product: Product;
    handleThumbnail: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddProductThumbnail = ({ product, handleThumbnail } : AddProductThumbnailProps) => {
    return (
        <Card>
            <strong>Product Thumbnail</strong>
            <div className="flex flex-col items-center gap-5 mt-4"> 
                <ProductThumbnail product={product} className="w-[90%] bg-gray-100 h-[300px] xl:h-[250px]"/>
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