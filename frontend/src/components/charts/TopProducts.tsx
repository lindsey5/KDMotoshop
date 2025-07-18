import { useEffect, useState } from "react"
import { fetchData } from "../../services/api";
import Card from "../Card";
import TopProductsContainer from "../containers/TopProductContainer";

const TopProductsChart = () => {
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

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
        <Card className="flex-1 2xl:w-[350px] h-[400px] flex flex-col gap-5 mt-10">
            <h1 className="font-bold text-lg">Most Selling Products</h1>
            <div className="flex flex-col gap-5 flex-grow overflow-y-auto py-2">
                {topProducts.map(product => (
                    <TopProductsContainer product={product}/>
                ))}
            </div>
        </Card>
    )
}

export default TopProductsChart