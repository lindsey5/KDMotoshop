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
import useDarkmode from '../hooks/useDarkmode';

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

type Dataset = {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
  fill?: boolean;
};

type AreaChartProps = {
  title?: string;
  labels: string[];
  datasets: Dataset[];
};

const AreaChart = ({ title, labels, datasets }: AreaChartProps) => {
  const isDark = useDarkmode();

  return (
    <Line
      data={{
        labels: labels,
        datasets: datasets.map(ds => ({
          ...ds,
          tension: 0.1,
          fill: ds.fill ?? true,
          backgroundColor: ds.backgroundColor ?? 'rgba(224, 104, 104, 0.2)',
          borderColor: ds.borderColor ?? 'red',
        }))
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: isDark ? 'white' : 'black',
            },
            position: 'top' as const,
          },
          title: {
            display: !!title,
            text: title,
          },
        },
        scales: {
          y: {
            ticks: {
              color: isDark ? '#e0e0e0' : 'black',
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
              display: false, 
            }
          }
        },
      }}
    />
  );
};


export default AreaChart