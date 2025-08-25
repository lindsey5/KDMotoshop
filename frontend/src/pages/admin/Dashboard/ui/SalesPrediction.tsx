import Card from "../../../../components/Card";
import {useMemo } from "react";
import AreaChart from "../../../../components/AreaChart";
import { url } from "../../../../constants/url";
import { CircularProgress } from "@mui/material";
import { formatNumber } from "../../../../utils/utils";
import useFetch from "../../../../hooks/useFetch";

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SalesPredictionChart = () => {
    const today = new Date();
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    const { data : forecastRes, loading : forecastLoading } = useFetch(`${url}api/predict?month=${month}&year=${year}`)
    const { data : actualSalesRes, loading : actualLoading } = useFetch(`/api/sales/daily?month=${month}&year=${year}`)

    const dateLabels = useMemo<string[]>(() => {
        return forecastRes?.forecast_dates
    }, [forecastRes])

    const forecastSales = useMemo<number[]>(() => {
        if(!forecastRes && !forecastRes?.forecast) {
            return []
        }
        return forecastRes?.forecast.map((sales: number) => Number(sales.toFixed(0)));
    }, [forecastRes])

    const actualSales = useMemo(() => {
        if(!dateLabels || !actualSalesRes){
            return []
        }

        return dateLabels.map((label: string) =>
            actualSalesRes?.dailySales.find((sales: any) => sales.date === label)?.total ?? undefined
        )
    }, [actualSalesRes, dateLabels])

    return (
        <Card className="h-[500px] xl:flex-3 flex flex-col gap-3 mt-8">
            <div className="flex justify-between items-center px-4 mt-2">
                <h1 className="font-bold text-xl">Sales Forecast: {monthNames[month - 1]} {year}</h1>
            </div>

            {(forecastLoading || actualLoading) ? (
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
