import Card from "../../components/Card";
import MonthlySales from "../../components/dashboard/MonthSales";
import { formatDateWithWeekday } from "../../utils/dateUtils";
import { LineChart } from "@mui/x-charts";
import DashboardCards from "../../components/dashboard/DashboardCards";
import TopProductsChart from "../../components/dashboard/TopProducts";
import TopCategoriesChart from "../../components/dashboard/TopCategories";

const dateLabels = Array.from({ length: 31 }, (_, i) => i + 1);

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
        <DashboardCards />
        <div className="flex items-center mt-14 gap-5">
            <MonthlySales />
            <TopProductsChart />
        </div>
        <div className="flex items-center mt-14 gap-5">
            <TopCategoriesChart />
            <Card className="h-[400px] bg-white flex-3">
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
        </Card>
        </div>
    </div>  
}

export default AdminDashboard