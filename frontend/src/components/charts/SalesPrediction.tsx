import Card from "../cards/Card"
import { useEffect, useState } from "react"
import { fetchData } from "../../services/api";
import AreaChart from "./AreaChart";
import useDarkmode from "../../hooks/useDarkmode";
import { url } from "../../constants/url";
import { CircularProgress } from "@mui/material";
import { formatNumber } from "../../utils/utils";

const SalesPredictionChart = () => {
    const [forecastSales, setForecastSales] = useState<number[]>([]);
    const [dateLabels, setDateLabels] = useState<string[]>([]);
    const isDark = useDarkmode();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getForecastSales = async () => {
            setLoading(true);
            const response = await fetchData(`${url}predict`)
            if(response.success){
                setForecastSales(response.forecast.map((sales : number) => Number(sales.toFixed(0))))
                setDateLabels(response.dates)
            }
            setLoading(false);
        }

        getForecastSales()
    }, [])

    return (
        <Card className="h-[500px] xl:flex-3 flex flex-col gap-3">
            <h1 className="font-bold text-xl">Expected Sales Trend (This Month)</h1>
            {loading ? <div className="w-full h-[300px] flex justify-center items-center">
                <CircularProgress sx={{ color: 'red'}}/>
            </div> 
            :
            <>
                <div className="flex-1">
                    <AreaChart 
                        data={forecastSales}
                        labels={dateLabels}
                        label="Sales Prediction"
                        fill={isDark ? true : false}
                    />
                </div>
                <p className="text-end font-bold text-lg">Expected Total Sales: {formatNumber(forecastSales.reduce((acc, total) => acc + total, 0))}</p>
            </>
            }
        </Card>
    )
}

export default SalesPredictionChart