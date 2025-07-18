import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import useDarkmode from '../../hooks/useDarkmode';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

type AreaChartProps = {
    title?: string;
    labels: string[];
    label: string;
    data: number[];
    fill?: boolean;
}

const AreaChart : React.FC<AreaChartProps> = ({title, labels, label, data, fill = true}) => {
    const isDark = useDarkmode();

    return (
    <Line 
        data={{
            labels: labels,
            datasets: [
                {
                label: label,
                data: data,
                fill: fill,
                backgroundColor: 'rgba(224, 104, 104, 0.2)',
                borderColor: 'red',
                tension: 0.1, 
                },
            ],
        }} 
        options={{
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: isDark ? 'white' : 'black', 
                    },
                    position: 'top' as const,
                },
                title: {
                    display: true,
                    text: title,
                },
            },
            scales: {
                y: {
                ticks: {
                    color: isDark ? '	#e0e0e0' : 'black', 
                },
                grid: {
                    color: isDark ? '#444' : '#ccc',
                }
                },
                x: {
                ticks: {
                    color: isDark ? '#969696' : 'black', 
                },
                grid: {
                    color: isDark ? '#444' : '#ccc',
                }
                }
            },
        }} 
    />
    )
}

export default AreaChart