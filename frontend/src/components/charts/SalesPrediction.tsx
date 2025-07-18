import Card from "../cards/Card"
import { useEffect, useState } from "react"
import { fetchData } from "../../services/api";
import AreaChart from "./AreaChart";
import useDarkmode from "../../hooks/useDarkmode";

const SalesPredictionChart = () => {
    const [forecastSales, setForecastSales] = useState<number[]>([]);
    const [dateLabels, setDateLabels] = useState<string[]>([]);
    const isDark = useDarkmode();

    useEffect(() => {
        const getForecastSales = async () => {
            const response = await fetchData('http://127.0.0.1:5000/predict')
            if(response.success){
                setForecastSales(response.forecast.map((sales : number) => sales.toFixed(0)))
                setDateLabels(response.dates)
            }
        }

        getForecastSales()
    }, [])

    return (
        <Card className="h-[450px] bg-white flex-3">
            <h1 className="font-bold text-xl">Expected Sales Trend (This Month)</h1>
            <AreaChart 
                data={forecastSales}
                labels={dateLabels}
                label="Sales Prediction"
                fill={isDark ? true : false}
            />
        </Card>
    )
}

export default SalesPredictionChart