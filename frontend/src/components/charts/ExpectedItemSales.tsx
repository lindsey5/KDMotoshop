import { useEffect, useState } from "react";
import Card from "../cards/Card";
import { fetchData } from "../../services/api";
import { url } from "../../constants/url";
import { CircularProgress } from "@mui/material";
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
import useDarkmode from "../../hooks/useDarkmode";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, Tooltip, Legend);

interface Prediction {
    item: string;
    sales: number
}


const ExpectedItemSales = () => {
    const [data, setData] = useState<Prediction[]>([]);
    const [month, setMonth] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const isDark = useDarkmode();

    const labels = data.map((d) => d.item);
    const values = data.map((d) => d.sales);

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
    
                    const gradient = canvasCtx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, '#691313');
                    gradient.addColorStop(0.5, 'red');
                    gradient.addColorStop(1, '#380202'); 
    
                    return gradient;
                },
                borderWidth: 1,
            },
        ],
    };
    
    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                display: true,
                text: 'Predicted Sales',
                },
                ticks: {
                    color: isDark ? '	#e0e0e0' : 'black', 
                },
                grid: {
                    color: isDark ? '#444' : '#ccc',
                }
            },
            x: {
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

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            const response = await fetchData(`${url}api/predict/items`);
            if(response.success){
                setData(response.forecast
                    .map((item : any)=> ({...item, sales: Number(item.sales.toFixed(2)) }))
                    .sort((a : any, b : any) => b.sales - a.sales)
                    .slice(0, 5)
                )
                setMonth(response.month)
            }
            setLoading(false);
        }

        getData();
    }, []);

    return (
    <Card className="mt-10">
        <h2 className='mb-4 font-bold'>Projected Sales Leaders for {month} {/*monthNames[new Date().getMonth()] */}</h2>
        {loading ? <div className="w-full h-[300px] flex justify-center items-center">
            <CircularProgress sx={{ color: 'red'}}/>
        </div> : <Bar 
            data={chartData}
            options={options}
        />}
    </Card>
    )
}

export default ExpectedItemSales