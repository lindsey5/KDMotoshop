import { useState } from "react";

interface ProductImageProps{
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

export default ProductImage