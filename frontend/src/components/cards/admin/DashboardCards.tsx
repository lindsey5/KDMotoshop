import DashboardCard from "../DashboardCard"
import { formatNumber } from "../../../utils/utils";
import { Calendar } from "lucide-react";
import useFetch from "../../../hooks/useFetch";

const DashboardCards = () => {
    const { data } = useFetch('/api/sales/statistics')

    return (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mt-10">
            <DashboardCard label="Sales Today" value={`₱${formatNumber(data?.data.today ?? 0)}`} icon={Calendar}/>
            <DashboardCard label="Sales this week" value={`₱${formatNumber(data?.data.thisWeek ?? 0)}`} icon={Calendar}/>
            <DashboardCard label="Sales This Month" value={`₱${formatNumber(data?.data.thisMonth ?? 0)}`} icon={Calendar}/>
            <DashboardCard label="Sales This Year" value={`₱${formatNumber(data?.data.thisYear ?? 0)}`} icon={Calendar}/>
        </div>
    )
}

export default DashboardCards