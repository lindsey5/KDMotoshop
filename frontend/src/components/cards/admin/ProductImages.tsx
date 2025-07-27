import { useState } from "react";
import { RedButton } from "../../buttons/Button";
import AddIcon from '@mui/icons-material/Add';
import Card from "../Card";

type ProductImageProps = {
    index: number;
    image: UploadedImage | string | ArrayBuffer;
    setSelectedImage: React.Dispatch<React.SetStateAction<string>>
    handleDelete: (index : number) => Promise<void>;
}

const ProductImage = ({ index, image, setSelectedImage, handleDelete } : ProductImageProps) => {
    const [isHover, setIsHover] = useState<boolean>(false);

    const handleHover = () => {
        setSelectedImage(
            typeof image === 'object' && 'imageUrl' in image
            ? image.imageUrl
            : image as string
        )
        setIsHover(true)
    }

    return (
        <div className="relative min-w-[60px] w-[70px] h-[60px]" onMouseLeave={() => setIsHover(false)}>
            <img 
                onMouseEnter={handleHover}
                className="cursor-pointer w-full h-full"
                src={
                    typeof image === 'object' && 'imageUrl' in image
                    ? image.imageUrl
                    : typeof image === 'string'
                        ? image
                        : '/photo.png'
                }
            />
            {isHover && (
                <button
                onClick={() => handleDelete(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer"
                >
                ✕
                </button>
            )}
        </div>)
}



interface ProductImagesProps{
    images: (UploadedImage | string | ArrayBuffer)[];
    setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
    deleteImage: (index: number) => Promise<void>;
    selectedImage: string;
    handleImages: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProductImages : React.FC<ProductImagesProps> = ({ images, setSelectedImage, deleteImage, selectedImage, handleImages }) => {
    return (
        <Card>
            <strong>Product Images</strong>
            <div className="flex flex-col items-center gap-10 mt-4">
                <img className="w-[170px] h-[170px]" src={selectedImage} />
                                
                <div className="w-full flex gap-5 items-center">
                    <div className="flex gap-5 flex-grow min-w-0 overflow-auto scrollbar-hidden py-3">
                        {images.map((image, i) => (
                            <ProductImage 
                                key={i} 
                                index={i}
                                setSelectedImage={setSelectedImage} 
                                image={image}
                                handleDelete={deleteImage}
                            />
                        ))}
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        id="images-input"
                        style={{ display: 'none' }}
                        onChange={handleImages}
                    />
                    <label htmlFor="images-input">
                        <RedButton component="span">
                            <AddIcon sx={{ color: 'white'}}/>
                        </RedButton>
                    </label>
                </div>
            </div>
        </Card>
    )
}

export default ProductImages;