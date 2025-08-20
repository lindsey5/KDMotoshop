import { useMemo } from "react";
import Card from "../cards/Card";
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
import useFetch from "../../hooks/useFetch";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, Tooltip, Legend);

interface Prediction {
    item: string;
    sales: number
}


const ExpectedItemSales = () => {
    const isDark = useDarkmode();
    const { data, loading } = useFetch(`${url}api/predict/items`)

    const { forecast, month } = useMemo<{forecast: Prediction[], month: string}>(() => {
        if(!data){
            return { forecast: [], month: ''}
        }

        const forecast = data?.forecast
            .map((item : any)=> ({...item, sales: Number(item.sales.toFixed(2)) }))
            .sort((a : any, b : any) => b.sales - a.sales)
            .slice(0, 5)
        const month = data?.month

        return { month, forecast }
        
    }, [data])

    const labels = forecast.map((d) => d.item);
    const values = forecast.map((d) => d.sales);

    const chartData = {
        labels,
        datasets: [
            {
                type: 'bar' as const,
                label: 'Expected Sales',
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