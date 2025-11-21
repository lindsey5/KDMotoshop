import DashboardCard from "./DashboardCard"
import { formatNumberToPeso } from "../../../../utils/utils";
import { Calendar, Package, ShoppingCart, User } from "lucide-react";
import useFetch from "../../../../hooks/useFetch";

const DashboardCards = ({ user } : { user : Admin }) => {
    const { data } = useFetch('/api/sales/statistics')
    const { data : customerData } = useFetch('/api/customers/total')
    const { data : productsData } = useFetch('/api/products/total')
    const { data : ordersData } = useFetch('/api/orders/statistics');

    return (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 my-10">
            {user.role === 'Super Admin' && (
                <>
                <DashboardCard label="Sales Today" value={`${formatNumberToPeso(data?.data.today ?? 0)}`} icon={Calendar}/>
                <DashboardCard label="Sales this week" value={`${formatNumberToPeso(data?.data.thisWeek ?? 0)}`} icon={Calendar}/>
                <DashboardCard label="Sales This Month" value={`${formatNumberToPeso(data?.data.thisMonth ?? 0)}`} icon={Calendar}/>
                <DashboardCard label="Sales This Year" value={`${formatNumberToPeso(data?.data.thisYear ?? 0)}`} icon={Calendar}/>
                </>
            )}
            <DashboardCard label="Total Customers" value={customerData?.total ?? 0} icon={User}/>
            <DashboardCard label="Total Products" value={productsData?.total ?? 0} icon={Package}/>
            <DashboardCard label="Pending Orders" value={ordersData?.pendingOrders ?? 0} icon={ShoppingCart}/>
            <DashboardCard label="Total Orders" value={ordersData?.overallTotalOrders ?? 0} icon={ShoppingCart}/>
        </div>
    )
}

export default DashboardCards