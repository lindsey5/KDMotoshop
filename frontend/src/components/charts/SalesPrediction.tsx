import Card from "../cards/Card"
import { useEffect, useState } from "react"
import { fetchData } from "../../services/api";
import AreaChart from "./AreaChart";
import { url } from "../../constants/url";
import { CircularProgress } from "@mui/material";
import { formatNumber } from "../../utils/utils";

const SalesPredictionChart = () => {
    const [forecastSales, setForecastSales] = useState<number[]>([]);
    const [actualSales, setActualSales] = useState<number[]>([]);
    const [dateLabels, setDateLabels] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        const getSales = async () => {
            setLoading(true);
            const [forecastRes, actualRes] = await Promise.all([fetchData(`${url}api/predict`), fetchData('/api/sales/daily')])

            if (forecastRes.success && actualRes.success) {
            const forecast = forecastRes.forecast.map((sales: number) => Number(sales.toFixed(0)));
            const labels = forecastRes.forecast_dates;

            const actual = labels.map((label : string) => actualRes.dailySales.find((sales: any) => sales.date === label)?.total ?? null);

            setForecastSales(forecast);
            setDateLabels(labels);
            setActualSales(actual);
            }
            setLoading(false)
        }

        getSales()
    }, [])

    return (
        <Card className="h-[500px] xl:flex-3 flex flex-col gap-3">
            <h1 className="font-bold text-xl">Sales Trend (This Month)</h1>
            {loading ? <div className="w-full h-[300px] flex justify-center items-center">
                <CircularProgress sx={{ color: 'red'}}/>
            </div> 
            :
            <>
                <div className="flex-1">
                    <AreaChart
                        title="Prediction vs Actual"
                        labels={dateLabels}
                        datasets={[
                            {
                            label: 'Forecast Sales',
                            data: forecastSales,
                            borderColor: 'green',
                            backgroundColor: 'rgba(0, 128, 0, 0.2)',
                            },
                            {
                            label: 'Actual Sales',
                            data: actualSales,
                            borderColor: 'red',
                            backgroundColor: 'rgba(255, 0, 0, 0.2)',
                            },
                        ]}
                    />
                </div>
                <p className="text-end font-bold text-lg">Expected Total Sales: {formatNumber(forecastSales.reduce((acc, total) => acc + total, 0))}</p>
            </>
            }
        </Card>
    )
}

export default SalesPredictionChart