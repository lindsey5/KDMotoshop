import { RedButton } from "../../Button"
import Card from "../Card";
import ProductThumbnail from "../../images/ProductThumbnail";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

type AddProductThumbnailProps = {
    product: Product;
    handleThumbnail: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const AddProductThumbnail = ({ product, handleThumbnail } : AddProductThumbnailProps) => {
    
    return (
        <Card>
            <strong>Product Thumbnail</strong>
            <div className="flex flex-col items-center gap-5 mt-4"> 
                <ProductThumbnail product={product} className="w-[170px] h-[170px]"/>
                <RedButton startIcon={<CloudUploadIcon /> } component="label">
                    Upload Thumbnail
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleThumbnail}
                    />
                </RedButton>
            </div>
        </Card>
    )

}
export default AddProductThumbnail;