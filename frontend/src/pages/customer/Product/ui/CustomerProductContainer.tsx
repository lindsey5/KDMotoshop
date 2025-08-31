import { cn, formatNumberToPeso } from "../../../../utils/utils";
import { Rating } from "@mui/material";
import GradeIcon from '@mui/icons-material/Grade';

const CustomerProductContainer = ({ product, className } : { product: any, className?: string }) => {
    const stock = (product.product_type === 'Single' ? product.stock : product.variants?.reduce((total : number, v : any) => total + v.stock,0) ?? product.stock)

    const handleClick = () => {
        window.location.href = `/product/${product._id}`
    }

    return (
        <div 
            className={cn("relative bg-black rounded-md overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer", className)}
            onClick={handleClick}
        >
            <img
                src={product.image}
                alt={product.product_name}
                className={cn("w-full h-[170px] md:h-[250px] 2xl:h-[300px]", )}
            />
            <div className="p-3 flex flex-col gap-3">
                <h1 className="text-sm md:text-lg font-bold text-white">{product.product_name}</h1>
                <h1 className="md:text-2xl text-lg font-bold text-red-600">{formatNumberToPeso(product.price)}</h1>
                {stock === 0 && <p className="text-red-600 text-lg">Out of stock</p>}

                {product.rating !== 0 ? 
                <Rating 
                    name="read-only" 
                    value={product.rating} 
                    emptyIcon={<GradeIcon fontSize="inherit" sx={{ color: 'white' }}/>} 
                    readOnly 
                    precision={0.5}
                /> 
                : <p className="text-white">No Reviews</p>}
            </div>
        </div>
    )
}

export default CustomerProductContainer