import MonthlySales from "../../components/charts/MonthlySales";
import { formatDateWithWeekday } from "../../utils/dateUtils";
import DashboardCards from "../../components/cards/DashboardCards";
import TopProductsChart from "../../components/charts/TopProducts";
import TopCategoriesChart from "../../components/charts/TopCategories";
import SalesPredictionChart from "../../components/charts/SalesPrediction";

const AdminDashboard = () => {
    return <div className="min-h-full p-5 bg-gray-100">
        <h1 className="text-red-500 font-bold text-4xl">Dashboard</h1>
        <p className="mt-2 text-lg">{formatDateWithWeekday(new Date())}</p>
        <DashboardCards />
        <div className="flex items-center mt-14 gap-5">
            <MonthlySales />
            <TopProductsChart />
        </div>
        <div className="flex mt-14 gap-5">
            <TopCategoriesChart />
            <SalesPredictionChart />
        </div>
    </div>  
}

export default AdminDashboard