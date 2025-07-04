import { PieChart } from "@mui/x-charts"
import { useEffect, useState } from "react";
import { fetchData } from "../../services/api";
import Card from "../Card";

const TopCategoriesChart = () => {
    const [data, setData] = useState<ChartData>({ data: [] });

    useEffect(() => {
        const getTopCategories = async () => {
            const response = await fetchData('/api/category/top');
            if(response.success){
                setData({
                    data: response.topCategories.map((category : any) => ({
                        value: category.totalQuantity,
                        label: category.category 
                    }))
                });
            }
        }

        getTopCategories()
    }, [])

    return (
        <Card className="flex-1">
            <h1 className="font-bold text-xl mb-4">Top Categories</h1>
            <PieChart 
                series={[ data ]}
                height={300}
            />
        </Card>
    )
}

export default TopCategoriesChart