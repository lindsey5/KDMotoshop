import { formatNumber } from "../../utils/utils";

const CustomerProductContainer = ({ product } : { product: any }) => {
    return (
        <div key={product._id} className="bg-black rounded-md overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer">
            <img
                src={product.image}
                alt={product.product_name}
                className="w-full h-[150px] md:h-[250px] 2xl:h-[300px]"
            />
            <div className="p-3 flex flex-col gap-3">
                <h1 className="text-sm md:text-lg font-bold text-white">{product.product_name}</h1>
                <h1 className="md:text-2xl text-lg font-bold text-red-600">
                  ₱{formatNumber(product.price)}
                </h1>
            </div>
        </div>
    )
}

export default CustomerProductContainer