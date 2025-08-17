import { useMemo } from "react"
import Card from "../cards/Card";
import TopProductsContainer from "../containers/TopProductContainer";
import useFetch from "../../hooks/useFetch";

const TopProductsChart = () => {
    const { data } = useFetch('/api/products/top');

    const topProducts = useMemo<TopProduct[]>(() => {
        if(!data) return []

        return data?.topProducts
    }, [data])

    return (
        <Card className="flex-1 2xl:w-[350px] h-[400px] flex flex-col gap-5 mt-10">
            <h1 className="font-bold text-lg">Most Selling Products</h1>
            <div className="flex flex-col gap-5 flex-grow overflow-y-auto py-2">
                {topProducts.map(product => (
                    <TopProductsContainer key={product._id} product={product}/>
                ))}
            </div>
        </Card>
    )
}

export default TopProductsChart