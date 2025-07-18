import { PieChart } from "@mui/x-charts"
import { useEffect, useState } from "react";
import { fetchData } from "../../services/api";
import Card from "../cards/Card";
import useDarkmode from "../../hooks/useDarkmode";
import { cn } from "../../utils/utils";

const TopCategoriesChart = () => {
    const isDark = useDarkmode();
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
            <h1 className={cn("font-bold text-xl mb-4", isDark && 'text-white')}>Top Categories</h1>
            <PieChart 
                series={[ data ]}
                height={300}
                slotProps={{
                    legend: {
                    sx: {
                        '& .MuiChartsLegend-label': {
                            color: isDark ? "white" : '', 
                        },
                        '& .MuiChartsLegend-mark': {
                            color: isDark ? "white" : '', 
                        }
                    }
                    }
                }}
            />
        </Card>
    )
}

export default TopCategoriesChart