
const TopProductsContainer = ({ product } : { product: TopProduct }) => {

    return (
        <div className="flex gap-5" key={product.product_name}>
            <img className="w-20 h-20" src={product.image}/>
            <div>
                <h1 className="font-bold mb-2">{product.product_name}</h1>
                <p className="text-gray-500">Quantity sold: {product.totalQuantity}</p>
            </div>
        </div>
    )
}

export default TopProductsContainer