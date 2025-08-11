import Card from "../cards/Card";
import { useEffect, useState } from "react";
import { fetchData } from "../../services/api";
import AreaChart from "./AreaChart";
import { url } from "../../constants/url";
import { CircularProgress } from "@mui/material";
import { formatNumber } from "../../utils/utils";

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SalesPredictionChart = () => {
    const today = new Date();
    const [forecastSales, setForecastSales] = useState<number[]>([]);
    const [actualSales, setActualSales] = useState<number[]>([]);
    const [dateLabels, setDateLabels] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const month = today.getMonth() + 1
    const year = today.getFullYear()

    const getSales = async () => {
        setLoading(true);
        try {
            const forecastRes = await fetchData(`${url}api/predict?month=${month}&year=${year}`);
            const actualRes = await fetchData(`/api/sales/daily?month=${month}&year=${year}`);

            if (forecastRes.success && actualRes.success) {
                const forecast = forecastRes.forecast.map((sales: number) => Number(sales.toFixed(0)));
                const labels = forecastRes.forecast_dates;

                const actual = labels.map((label: string) =>
                    actualRes.dailySales.find((sales: any) => sales.date === label)?.total ?? 0
                )

                setForecastSales(forecast);
                setDateLabels(labels);
                setActualSales(actual);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        getSales();
    }, [month, year]);

    return (
        <Card className="h-[500px] xl:flex-3 flex flex-col gap-3">
            <div className="flex justify-between items-center px-4 mt-2">
                <h1 className="font-bold text-xl">Sales Trend: {monthNames[month - 1]} {year}</h1>
            </div>

            {loading ? (
                <div className="w-full h-[300px] flex justify-center items-center">
                    <CircularProgress sx={{ color: 'red' }} />
                </div>
            ) : (
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
                    <p className="text-end font-bold text-lg px-4">
                        Expected Total Sales: {formatNumber(forecastSales.reduce((acc, total) => acc + total, 0))}
                    </p>
                </>
            )}
        </Card>
    );
};

export default SalesPredictionChart;
