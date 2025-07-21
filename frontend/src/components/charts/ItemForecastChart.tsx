import React, { useEffect, useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  Tooltip,
  Legend,
  type ScriptableContext,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { fetchData } from '../../services/api';
import Card from '../cards/Card';
import useDarkmode from '../../hooks/useDarkmode';
import CustomizedPagination from '../Pagination';
import { url } from '../../constants/url';
import { CircularProgress } from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, Tooltip, Legend);

interface Prediction {
    item: string;
    predicted_qty: number;
}

const ITEMS_PER_PAGE = 10;

const ItemForecastChart = () => {
    const [data, setData] = useState<Prediction[]>([]);
    const isDark = useDarkmode();
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const response = await fetchData(`${url}predict/items`);
            if(response.success){
                setData(response.forecast
                    .map((item : any)=> ({...item, predicted_qty: Math.round(item.predicted_qty) }))
                    .sort((a : any, b : any) => b.predicted_qty - a.predicted_qty)
                )
            }
            setLoading(false);
        }

        getData();
    }, []);

    const paginatedData = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return data.slice(start, start + ITEMS_PER_PAGE);
    }, [page, data]);

    const labels = paginatedData.map((d) => d.item);
    const values = paginatedData.map((d) => d.predicted_qty);

    const chartData = {
        labels,
        datasets: [
            {
                type: 'bar' as const,
                label: 'Quantities Sold',
                data: values,
                backgroundColor: (ctx: ScriptableContext<'bar'>) => {
                    const chart = ctx.chart;
                    const {ctx: canvasCtx, chartArea} = chart;

                    if (!chartArea) return 'red'; // skip until chart area is available

                    const gradient = canvasCtx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
                    gradient.addColorStop(0, '#691313');
                    gradient.addColorStop(0.3, 'red');
                    gradient.addColorStop(1, '#380202'); 

                    return gradient;
                },
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        indexAxis: 'y' as const,
        scales: {
        x: {
            beginAtZero: true,
            title: {
            display: true,
            text: 'Predicted Quantity',
            },
            ticks: {
                color: isDark ? '	#e0e0e0' : 'black', 
            },
            grid: {
                color: isDark ? '#444' : '#ccc',
            }
        },
        y: {
            ticks: {
            callback: function (value: any) {
                return labels[value] || '';
            },
            color: isDark ? '	#e0e0e0' : 'black', 
            },
            grid: {
                color: isDark ? '#444' : '#ccc',
            }
        },
        },
        plugins: {
        legend: {
            display: false,
        },
        },
    };

    const handlePage = (_: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    };

    return (
        <Card className="mt-10">
            <h2 className='mb-4 font-bold'>Quantities Sold by Product (Next Month)</h2>
            {loading ? <div className="w-full h-[300px] flex justify-center items-center">
                <CircularProgress sx={{ color: 'red'}}/> 
            </div> :
            paginatedData.length === 0 ? <div className="w-full h-[300px] flex justify-center items-center">
                <p className="text-gray-500">No data available</p>
            </div> :
            <>
                <Bar 
                    className='w-full'
                    data={chartData}
                    options={options}
                />
                <CustomizedPagination 
                    count={Math.ceil(data.length / ITEMS_PER_PAGE)} 
                    onChange={handlePage} 
                />
                </>}
        </Card>
    );
};

export default ItemForecastChart;
