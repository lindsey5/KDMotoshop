import { useEffect, useState } from "react"
import { fetchData } from "../../services/api";
import Card from "../Card";

type TopProducts = {
    product_name: string;
    image: string;
    totalQuantity: number;
}

const TopProductsChart = () => {
    const [topProducts, setTopProducts] = useState<TopProducts[]>([]);

    useEffect(() => {
        const getTopProductsAsync = async () => {
            const response = await fetchData('/api/product/top');
            if(response.success){
                setTopProducts(response.topProducts)
            }
        }

        getTopProductsAsync();
    }, [])

    return (
        <Card className="flex-1 h-[400px] flex flex-col gap-5">
            <h1 className="font-bold text-lg">Most Popular Products</h1>
            <div className="flex flex-col gap-5 flex-grow overflow-y-auto py-2">
                {topProducts.map(product => (
                    <div className="flex gap-5" key={product.product_name}>
                        <img className="w-20 h-20" src={product.image}/>
                        <div>
                            <h1 className="font-bold mb-2">{product.product_name}</h1>
                            <p className="text-gray-500">Quantity sold: {product.totalQuantity}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    )
}

export default TopProductsChart