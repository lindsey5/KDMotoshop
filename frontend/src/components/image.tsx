import { cn } from "../utils/utils"
import { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconButton, Modal } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { DarkmodeContext } from "../context/DarkmodeContext";

export const ProductThumbnail = ({ product, className } : { product : Product | undefined, className?: string}) => {
    return (
        <img 
            className={cn('bg-gray-100', className)}
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

const imagesPerPage = 3;
const delay = 5000; 

export const MultiImageSlideshow = ({ images } : { images: string[] }) => {
    const [page, setPage] = useState<number>(0);
    const totalPages = Math.ceil(images.length / imagesPerPage);
    const [selectedImage, setSelectedImage] = useState<string | undefined>();
    const context = useContext(DarkmodeContext);
    if (!context) throw new Error("DarkmodeContext must be used inside the provider.");
    const { theme } = context;

    useEffect(() => {
        const interval = setInterval(() => {
            setPage((prev) => (prev + 1) % totalPages);
        }, delay);

        return () => clearInterval(interval);
    }, [totalPages]);

    const currentImages = images.slice(
        page * imagesPerPage,
        page * imagesPerPage + imagesPerPage
    );

    const handlePrev = () => {
        setPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    const handleNext = () => {
        setPage((prev) => (prev + 1) % totalPages);
    };

    return (
        <div className="w-full relative px-15">
            <Modal open={selectedImage !== undefined} onClose={() => setSelectedImage(undefined)}>
                <img className="absolute inset-1/2 transform -translate-1/2" src={selectedImage}/>
            </Modal>
        <AnimatePresence mode="wait">
            <motion.div
                key={page}
                className="grid grid-cols-3 gap-3 w-full"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
            >
                {currentImages.map((img, idx) => (
                <motion.img
                    key={idx}
                    src={img}
                    alt={`Slide ${idx}`}
                    onClick={() => setSelectedImage(img)}
                    className={cn("w-25 h-25 object-cover rounded-xl shadow-md cursor-pointer")}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                />
                ))}
            </motion.div>
            </AnimatePresence>

        {/* Prev and Next buttons */}
            <IconButton
            sx={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: theme === 'dark' ? 'white' : ''
            }}
            onClick={handlePrev}
            >
            <ArrowBackIosIcon />
            </IconButton>
            <IconButton
            sx={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                color: theme === 'dark' ? 'white' : ''
            }}
            onClick={handleNext}
            >
            <ArrowForwardIosIcon />
            </IconButton>

        </div>
    );
};