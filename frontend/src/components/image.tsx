import { cn } from "../utils/utils"
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

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
const delay = 3000; 

export const MultiImageSlideshow = ({ images } : { images: string[] }) => {
    const [page, setPage] = useState<number>(0);
    const totalPages = Math.ceil(images.length / imagesPerPage);

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
                    className="w-25 h-25 object-cover rounded-xl shadow-md"
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
                zIndex: 10,
                top: "50%",
                transform: "translateY(-50%)",
            }}
            onClick={handlePrev}
            >
            <ArrowBackIosIcon />
            </IconButton>
            <IconButton
            sx={{
                position: "absolute",
                right: 10,
                zIndex: 10,
                top: "50%",
                transform: "translateY(-50%)",
            }}
            onClick={handleNext}
            >
            <ArrowForwardIosIcon />
            </IconButton>

        </div>
    );
};