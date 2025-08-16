import { useEffect, useState } from "react"
import DashboardCard from "../DashboardCard"
import { fetchData } from "../../../services/api";
import { formatNumber } from "../../../utils/utils";
import { Calendar } from "lucide-react";

const DashboardCards = () => {
    const [data, setData] = useState({
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        thisYear: 0,
    });

    useEffect(() => {
        const getSalesStats = async () => {
            const response = await fetchData('/api/sales/statistics');
            if(response.success){
                setData(response.data)
            }
        }

        getSalesStats();
    }, [])

    return (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-5 mt-10">
            <DashboardCard label="Sales Today" value={`₱${formatNumber(data.today)}`} icon={Calendar}/>
            <DashboardCard label="Sales this week" value={`₱${formatNumber(data.thisWeek)}`} icon={Calendar}/>
            <DashboardCard label="Sales This Month" value={`₱${formatNumber(data.thisMonth)}`} icon={Calendar}/>
            <DashboardCard label="Sales This Year" value={`₱${formatNumber(data.thisYear)}`} icon={Calendar}/>
        </div>
    )
}

export default DashboardCards