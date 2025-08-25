import Card from "../../../../components/Card";
import { useMemo, useState } from "react";
import AreaChart from "../../../../components/AreaChart";
import { CircularProgress } from "@mui/material";
import { formatNumber } from "../../../../utils/utils";
import useFetch from "../../../../hooks/useFetch";

const RecentSalesChart = () => {
    const [filter, setFilter] = useState('All');
    const { data: salesRes, loading } = useFetch(`/api/sales/last-30-days?channel=${filter}`);

    const { labels, sales } = useMemo(() => {
        if (!salesRes?.dailySales) return { labels: [], sales: [] };

        const labels = salesRes.dailySales.map((ds: any) => ds.date);
        const sales = salesRes.dailySales.map((ds: any) => ds.total);
        return { labels, sales };
    }, [salesRes]);

    const handleChange = (e : React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(e.target.value);
    };

    return (
        <Card className="h-[500px] xl:flex-3 flex flex-col gap-3">
            <div className="flex justify-between items-center px-4 mt-2">
                <h1 className="font-bold text-xl">
                    Recent Sales
                </h1>
                <select className="border" id="monthFilter" name="monthFilter" value={filter} onChange={handleChange}>
                   {['All', 'Store', 'Website', 'Facebook', 'Shopee', 'Lazada', 'Tiktok'].map(item => <option value={item}>{item}</option>)}
                </select>
            </div>

            {loading ? (
                <div className="w-full h-[300px] flex justify-center items-center">
                    <CircularProgress sx={{ color: 'red' }} />
                </div>
            ) : (
                <>
                    <div className="flex-1">
                        <AreaChart
                            labels={labels}
                            datasets={[
                                {
                                    label: 'Sales',
                                    data: sales,
                                    borderColor: 'green',
                                    backgroundColor: 'rgba(0, 128, 0, 0.2)',
                                },
                            ]}
                        />
                    </div>
                    <p className="text-end font-bold text-lg px-4">
                        Total Sales: {formatNumber(sales.reduce((acc : number, total : number) => acc + total, 0))}
                    </p>
                </>
            )}
        </Card>
    );
};

export default RecentSalesChart;
