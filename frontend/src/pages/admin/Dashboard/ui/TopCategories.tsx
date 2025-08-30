import { PieChart } from "@mui/x-charts"
import { useMemo, } from "react";
import Card from "../../../../components/Card";
import useDarkmode from "../../../../hooks/useDarkmode";
import { cn } from "../../../../utils/utils";
import useFetch from "../../../../hooks/useFetch";

const TopCategoriesChart = () => {
    const isDark = useDarkmode();
    const { data } = useFetch('/api/categories/top');

    const chartData =  useMemo(() => {
        if(!data) return { data: [] }
        
        return {
            data: data.topCategories.map((category : any) => ({
                value: category.totalQuantity,
                label: category.category 
            }))
        }
    }, [data])

    return (
        <Card className={cn("flex-1 border-t-4 border-t-red-500", isDark && "bg-gradient-to-br from-red-950/40 to-[#2A2A2A] shadow-red-900/20 text-white")}>
            <h1 className={cn("font-bold text-xl mb-4", isDark && 'text-white')}>Top Categories</h1>
            <PieChart 
                series={[ chartData ]}
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