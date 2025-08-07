import MonthlySales from "../../components/charts/MonthlySales";
import { formatDateWithWeekday } from "../../utils/dateUtils";
import DashboardCards from "../../components/cards/admin/DashboardCards";
import TopProductsChart from "../../components/charts/TopProducts";
import TopCategoriesChart from "../../components/charts/TopCategories";
import SalesPredictionChart from "../../components/charts/SalesPrediction";
import { cn } from "../../utils/utils";
import useDarkmode from "../../hooks/useDarkmode";
import ItemForecastChart from "../../components/charts/ItemForecastChart";
import PageContainer from "../../components/containers/admin/PageContainer";
import ExpectedItemSales from "../../components/charts/ExpectedItemSales";

const AdminDashboard = () => {
    const isDark = useDarkmode();

    return <PageContainer className="min-h-full">
        <h1 className={cn("font-bold text-4xl text-red-500", isDark && 'text-white')}>Dashboard</h1>
        <p className="mt-2 text-lg">{formatDateWithWeekday(new Date())}</p>
        <DashboardCards />
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-5">
            <MonthlySales />
            <TopProductsChart />
        </div>
        <div className="flex xl:flex-row flex-col mt-14 gap-5">
            <TopCategoriesChart />
            <SalesPredictionChart />
        </div>
        <ItemForecastChart />
        <ExpectedItemSales />
    </PageContainer>
}

export default AdminDashboard