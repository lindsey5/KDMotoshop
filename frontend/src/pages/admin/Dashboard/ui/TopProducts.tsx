import { useState } from "react"
import Card from "../../../../components/Card";
import TopProductsContainer from "../../../ui/TopProductContainer";
import useFetch from "../../../../hooks/useFetch";

const TopProductsChart = () => {
    const [filter, setFilter] = useState('thisMonth');
    const { data } = useFetch(`/api/products/top?filter=${filter}`);

    const handleChange = (e : React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(e.target.value);
    };

    return (
        <Card className="flex-1 2xl:w-[350px] h-[400px] flex flex-col gap-5 mt-10">
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-lg">Most Selling Products</h1>
                <select className="border" id="monthFilter" name="monthFilter" value={filter} onChange={handleChange}>
                    <option value="thisMonth">This Month</option>
                    <option value="lastMonth">Last Month</option>
                    <option value="all">All Time</option>
                </select>
            </div>
            <div className="flex flex-col gap-5 flex-grow overflow-y-auto py-2">
                {data?.topProducts.map((product : TopProduct) => (
                    <TopProductsContainer key={product._id} product={product}/>
                ))}
            </div>
        </Card>
    )
}

export default TopProductsChart