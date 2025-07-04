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
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                position: 'top' as const,
                },
                title: {
                display: true,
                text: title,
                },
            },
        }} 
    />
    )
}

export default AreaChart