import React, { useMemo, useState } from 'react';
import Card from '../../../../components/Card';
import useDarkmode from '../../../../hooks/useDarkmode';
import CustomizedPagination from '../../../../components/Pagination';
import { url } from '../../../../constants/url';
import { CircularProgress } from '@mui/material';
import useFetch from '../../../../hooks/useFetch';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { cn } from '../../../../utils/utils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

interface Prediction {
    item: string;
    predicted_qty: number;
}

const ITEMS_PER_PAGE = 10;

const ItemDemandForecast = () => {
    const isDark = useDarkmode();
    const [page, setPage] = useState<number>(1);
    const [selected, setSelected] = useState<"current" | "next">("next"); 
    const now = new Date();

    const getMonthYear = () => {
        let month = now.getMonth() + 1; // current month (1-12)
        let year = now.getFullYear();

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

    const { data, loading } = useFetch(`${url}api/predict/items?month=${month}&year=${year}`);

    const { forecast } = useMemo<{ forecast: Prediction[]; month: string }>(() => {
        if (!data) return { forecast: [], month: '' };
        const forecast = data.forecast
            .map((item: any) => ({ ...item, predicted_qty: Math.round(item.predicted_qty) }))
            .sort((a: any, b: any) => b.predicted_qty - a.predicted_qty);
        return { forecast, month: data.month };
    }, [data]);

    const paginatedData = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return forecast.slice(start, start + ITEMS_PER_PAGE);
    }, [page, forecast]);

    const itemsQuery = useMemo(() => paginatedData.map(item => item.item).join(','), [paginatedData]);

    const { data: itemSold, loading: itemLoading } = useFetch(
        selected === 'current' && itemsQuery ? `/api/sales/product-quantity-sold?items=${itemsQuery}` : ''
    );

    const actualItemSales = useMemo(() => {
        if (!itemSold || itemLoading) return [];
        return itemSold?.productSales.map((item: any) => item.totalQuantitySold);
    }, [itemSold, itemLoading]);

    const chartData = useMemo(() => {
        return {
            labels: paginatedData.map(d => d.item),
            datasets: [
                {
                    label: 'Forecast Qty Sold',
                    data: paginatedData.map(d => d.predicted_qty),
                    backgroundColor: '#09cc50ff',
                    borderColor: '#09cc50ff',
                    borderWidth: 1,
                },
                {
                    label: 'Actual Qty Sold',
                    data: actualItemSales,
                    backgroundColor: '#fc2121ff',
                    borderColor: '#fc2121ff',
                    borderWidth: 1,
                },
            ],
        };
    }, [paginatedData, actualItemSales]);

    const chartOptions = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: isDark ? '#fff' : '#000',
                    font: { size: 12 },
                },
            },
            tooltip: {
                backgroundColor: isDark ? '#333' : '#fff',
                titleColor: isDark ? '#fff' : '#000',
                bodyColor: isDark ? '#fff' : '#000',
                borderColor: isDark ? '#555' : '#ddd',
                borderWidth: 1,
            },
        },
        scales: {
            x: {
                grid: { display: true, color: isDark ? '#444' : '#e0e0e0' },
                ticks: { color: isDark ? '#fff' : '#000', font: { size: 11 } },
            },
            y: {
                beginAtZero: true,
                grid: { display: true, color: isDark ? '#444' : '#e0e0e0' },
                ticks: { color: isDark ? '#fff' : '#000', font: { size: 11 } },
            },
        },
    }), [isDark]);

    const handlePage = (_: React.ChangeEvent<unknown>, value: number) => setPage(value);

    return (
        <Card className={cn("mt-10 border-t-4 border-t-red-500", isDark && "bg-gradient-to-br from-red-950/40 to-[#2A2A2A] shadow-red-900/20 text-white")}>
            <div className="flex justify-between items-center mb-4">
                <h2 className='font-bold'>
                    Demand Forecast ({monthNames[month - 1]} {year})
                </h2>
                <select
                    value={selected}
                    onChange={(e) => { setSelected(e.target.value as "current" | "next"); setPage(1); }}
                    className="border rounded px-2 py-1 text-sm bg-white text-black"
                >
                    <option value="current">Current Month</option>
                    <option value="next">Next Month</option>
                </select>
            </div>

            {loading ? (
                <div className="w-full h-[400px] flex justify-center items-center">
                    <CircularProgress sx={{ color: 'red' }} />
                </div>
            ) : paginatedData.length === 0 ? (
                <div className="w-full h-[400px] flex justify-center items-center">
                    <p className="text-gray-500">No data available</p>
                </div>
            ) : (
                <>
                    <div style={{ height: '400px', width: '100%' }}>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                    <CustomizedPagination
                        count={Math.ceil(forecast.length / ITEMS_PER_PAGE)}
                        onChange={handlePage}
                        page={page}
                    />
                </>
            )}
        </Card>
    );
};

export default ItemDemandForecast;
