import Card from "../../../../components/Card";
import { useMemo, useState } from "react";
import AreaChart from "../../../../components/AreaChart";
import { url } from "../../../../constants/url";
import { CircularProgress } from "@mui/material";
import { cn, formatNumberToPeso } from "../../../../utils/utils";
import useFetch from "../../../../hooks/useFetch";
import useDarkmode from "../../../../hooks/useDarkmode";

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SalesPredictionChart = () => {
    const today = new Date();

    // ✅ State to control selected month option
    const [selected, setSelected] = useState<"current" | "next">("current");

    // ✅ Compute month & year based on selection
    const getMonthYear = () => {
        let month = today.getMonth() + 1; // current month (1–12)
        let year = today.getFullYear();

        if (selected === "next") {
            month += 1;
            if (month > 12) {
                month = 1;
                year += 1;
            }
        }

        return { month, year };
    };

    const { month, year } = getMonthYear();

    const { data : forecastRes, loading : forecastLoading } = useFetch(`${url}api/predict?month=${month}&year=${year}`, false);
    const { data : actualSalesRes, loading : actualLoading } = useFetch(`/api/sales/daily?month=${month}&year=${year}`);
    const isDark = useDarkmode();

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
        <Card className={cn("h-[500px] xl:flex-3 flex flex-col gap-3 mt-8 border-t-4 border-t-red-500", isDark && "bg-gradient-to-br from-red-950/40 to-[#2A2A2A] shadow-red-900/20 text-white")}>
            
            {/* Header with dropdown */}
            <div className="flex justify-between items-center px-4 mt-2">
                <h1 className="font-bold text-xl">
                    Sales Forecast: {monthNames[month - 1]} {year}
                </h1>

                <select
                    value={selected}
                    onChange={(e) => setSelected(e.target.value as "current" | "next")}
                    className="border rounded px-2 py-1 text-sm bg-white text-black"
                >
                    <option value="current">Current Month</option>
                    <option value="next">Next Month</option>
                </select>
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
                        Expected Total Sales: {formatNumberToPeso(forecastSales.reduce((acc, total) => acc + total, 0))}
                    </p>
                </>
            )}
        </Card>
    );
};

export default SalesPredictionChart;
