import { cn, formatNumberToPeso } from "../../../../utils/utils";
import { Rating } from "@mui/material";
import GradeIcon from '@mui/icons-material/Grade';

const CustomerProductContainer = ({ product, className }: { product: any, className?: string }) => {
    const stock = (
        product.product_type === 'Single'
            ? product.stock
            : product.variants?.reduce((total: number, v: any) => total + v.stock, 0) ?? product.stock
    );

    const handleClick = () => {
        window.location.href = `/product/${product._id}`;
    };

    return (
        <div
            className={cn(
                "relative bg-black rounded-md overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg",
                className
            )}
            onClick={handleClick}
        >
            <img
                src={product.image}
                alt={product.product_name}
                className="w-full h-[160px] sm:h-[200px] md:h-[240px] lg:h-[260px] xl:h-[280px] object-cover"
            />
            <div className="p-3 flex flex-col gap-2 md:gap-3">
                <h1 className="text-sm sm:text-base md:text-lg font-bold text-white truncate">
                    {product.product_name}
                </h1>

                <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-red-600">
                    {formatNumberToPeso(product.price)}
                </h1>

                {stock === 0 && (
                    <p className="text-red-600 text-xs sm:text-sm md:text-base">Out of stock</p>
                )}

                {product.rating !== 0 ? (
                    <Rating
                        name="read-only"
                        value={product.rating}
                        emptyIcon={<GradeIcon fontSize="inherit" sx={{ color: 'gray' }} />}
                        readOnly
                        precision={0.5}
                        size="small"
                    />
                ) : (
                    <p className="text-gray-300 text-xs sm:text-sm">No Reviews</p>
                )}
            </div>
        </div>
    );
};

export default CustomerProductContainer;
