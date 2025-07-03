import { useEffect, useState } from "react"
import DashboardCard from "../DashboardCard"
import { fetchData } from "../../../services/api";
import { formatNumber } from "../../../utils/utils";

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
        <div className="grid grid-cols-4 gap-5 mt-10">
            <DashboardCard label="Sales Today" value={`₱${formatNumber(data.today)}`} />
            <DashboardCard label="Sales this week" value={`₱${formatNumber(data.thisWeek)}`} />
            <DashboardCard label="Sales This Month" value={`₱${formatNumber(data.thisMonth)}`} />
            <DashboardCard label="Sales This Year" value={`₱${formatNumber(data.thisYear)}`} />
        </div>
    )
}

export default DashboardCards