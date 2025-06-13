import DashboardCard from "../../components/DashboardCard"
import { formatDateWithWeekday } from "../../utils/dateUtils";
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from "@mui/x-charts";
import { LineChart } from "@mui/x-charts";

const salesData = [
  { month: 'Jan', total: 12000 },
  { month: 'Feb', total: 15000 },
  { month: 'Mar', total: 18000 },
  { month: 'Apr', total: 20000 },
  { month: 'May', total: 25000 },
  { month: 'Jun', total: 22000 },
  { month: 'Jul', total: 30000 },
  { month: 'Aug', total: 28000 },
  { month: 'Sep', total: 31000 },
  { month: 'Oct', total: 35000 },
  { month: 'Nov', total: 37000 },
  { month: 'Dec', total: 40000 },
];

const categoryData = {
    data: [
        { id: 0, value: 40, label: "Full-faced Helmet" },
        { id: 2, value: 15, label: "Topbox" },
    ]
};

const dateLabels = [
  '5-01', '5-02', '5-03', '5-04', '5-05', '5-06', '5-07',
  '5-08', '5-09', '5-10', '5-11', '5-12', '5-13', '5-14',
  '5-15', '5-16', '5-17', '5-18', '5-19', '5-20', '5-21',
  '5-22', '5-23', '5-24', '5-25', '5-26', '5-27', '5-28',
  '5-29', '5-30', '5-31',
];

// Example actual and forecast sales data for May (31 days)
const actualSales = [
  1000, 1200, 900, 1500, 1300, 1600, 1400,
  1700, 1800, 1600, 1500, 1900, 2000, 2100,
];

const forecastSales = [
  1100, 1150, 950, 1400, 1350, 1650, 1450,
  1750, 1850, 1650, 1550, 1950, 2050, 2150,
  1850, 2250, 2350, 2150, 2450, 2550, 2650,
  2750, 2850, 2950, 3050, 3150, 3250, 3350,
  3450, 3550, 3650
];


const AdminDashboard = () => {
    return <div className="min-h-full p-5 bg-gray-100">
        <h1 className="text-red-500 font-bold text-4xl">Dashboard</h1>
        <p className="mt-2 text-lg">{formatDateWithWeekday(new Date())}</p>
        <div className="grid grid-cols-4 gap-10 mt-10">
            <DashboardCard label="Sales Today" value="₱2,000"/>
            <DashboardCard label="Sales this week" value="₱10,000"/>
            <DashboardCard label="Sales This Month" value="₱100,000"/>
            <DashboardCard label="Sales This Year" value="₱1,000,000"/>
        </div>
        <div className="flex items-center mt-14 gap-5">
            <div className="bg-white flex-1 p-5 shadow-lg border-1 border-gray-200 rounded-md">
                <BarChart
                    dataset={salesData}
                    xAxis={[{ dataKey: 'month' }]}
                    series={[{ dataKey: 'total', label: 'Monthly Sales' }]}
                    height={350}
                    colors={['red']}
                    grid={{ horizontal: true }}
                />
            </div>
            <div className="bg-white p-5 shadow-lg border-1 border-gray-200 rounded-md">
                <h1>Most Popular Categories</h1>
            <PieChart
                series={[ categoryData ]}
                width={200}
                height={200}
            />
            </div>
        </div>
        <div className="h-[450px] bg-white flex-1 p-5 shadow-lg border-1 border-gray-200 rounded-md mt-14">
                <h1 className="font-bold text-xl">This Month Forecast</h1>
                <LineChart
                    series={[
                        { data: actualSales, label: 'Actual sales', color: 'black' },
                        { data: forecastSales, label: 'Forecast sales', color: 'red' },
                    ]}
                    xAxis={[{ scaleType: 'point', data: dateLabels }]}
                    yAxis={[{ width: 50 }]}
                    grid={{ horizontal: true }}
                />
        </div>

    </div>  
}

export default AdminDashboard