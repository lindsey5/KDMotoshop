import MonthlySales from "../../components/charts/MonthlySales";
import { formatDateWithWeekday } from "../../utils/dateUtils";
import DashboardCards from "../../components/cards/admin/DashboardCards";
import TopProductsChart from "../../components/charts/TopProducts";
import TopCategoriesChart from "../../components/charts/TopCategories";
import SalesPredictionChart from "../../components/charts/SalesPrediction";
import { cn } from "../../utils/utils";
import useDarkmode from "../../hooks/useDarkmode";

const AdminDashboard = () => {
    const isDark = useDarkmode();

    return <div className={cn("transition-colors duration-600  min-h-full p-5 bg-gray-100", isDark && 'text-white bg-[#121212]')}>
        <h1 className={cn("font-bold text-4xl text-red-500", isDark && 'text-white')}>Dashboard</h1>
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