import MonthlySales from "./ui/MonthlySales";
import { formatDateWithWeekday } from "../../../utils/dateUtils";
import DashboardCards from "./ui/DashboardCards";
import TopProductsChart from "./ui/TopProducts";
import TopCategoriesChart from "./ui/TopCategories";
import SalesPredictionChart from "./ui/SalesPrediction";
import { cn } from "../../../utils/utils";
import useDarkmode from "../../../hooks/useDarkmode";
import PageContainer from "../ui/PageContainer";
import ItemDemandForecast from "./ui/ItemDemandForecast";
import ChannelSalesChart from "./ui/ChannelSalesChart";

const AdminDashboard = () => {
    const isDark = useDarkmode();

    return <PageContainer className="min-h-full">
        <h1 className={cn("font-bold text-4xl text-red-500", isDark && 'text-white')}>Dashboard</h1>
        <p className="mt-2 text-lg">{formatDateWithWeekday(new Date())}</p>
        <DashboardCards />
        <div className="flex xl:flex-row flex-col gap-5">
            <MonthlySales />
            <TopProductsChart />
        </div>
        <div className="flex xl:flex-row flex-col mt-14 gap-5">
            <TopCategoriesChart />
            <ChannelSalesChart />
        </div>
        <SalesPredictionChart />
        <ItemDemandForecast />
    </PageContainer>
}

export default AdminDashboard