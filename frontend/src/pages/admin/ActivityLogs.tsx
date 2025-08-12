import { useEffect, useState } from "react";
import { fetchData } from "../../services/api";
import { formatDateWithWeekday } from "../../utils/dateUtils";
import { Navigate } from "react-router-dom";
import type { DateRange } from "@mui/x-date-pickers-pro";
import type { Dayjs } from "dayjs";
import usePagination from "../../hooks/usePagination";
import ActivityLogsPage from "./ActivityLogsPage";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

interface ActivityLog{
    _id: string;
    admin_id: Admin;
    product_id?: Product;
    order_id?: Order;
    description: string;
    prev_value?: string;
    new_value?: string;
    createdAt: Date;
}

type GroupedActivityLogs = {
    [date: string] : ActivityLog[]
}

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Activity Logs', href: '/admin/activities' },
]

const ActivityLogs = () => {
    const [activityLogs, setActivityLogs] = useState<GroupedActivityLogs>({})
    const [selectedDates, setSelectedDates] = useState<DateRange<Dayjs> | undefined>()
    const { pagination, setPagination } = usePagination();
    const { user, loading : userLoading } = useSelector((state : RootState) => state.user)

    if (user && user.role === 'Admin' && !userLoading) {
        return <Navigate to="/admin/login" />;
    }
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const get_activity_logs = async () => {
            setLoading(true);
            const startDate = selectedDates?.[0] ? selectedDates?.[0].toString() : '';
            const endDate = selectedDates?.[1] ? selectedDates?.[1].toString()  : '';
            const response = await fetchData(`/api/activity?limit=50&page=${pagination.page}&startDate=${startDate}&endDate=${endDate}`)
            if(response.success){
                const groupedLogs = response.activityLogs.reduce((acc : GroupedActivityLogs, item : ActivityLog) => {
                    const dateKey = formatDateWithWeekday(item.createdAt);
                    if (!acc[dateKey]) {
                        acc[dateKey] = [];
                    }
                    acc[dateKey].push(item);
                    return acc;
                }, {})
                setPagination(prev => ({ ...prev, totalPages: response.totalPages}))
                setActivityLogs(groupedLogs)
            }
            setLoading(false);
        }

        get_activity_logs()
    }, [pagination.page, selectedDates])
    
    if(user && user.role !== 'Super Admin'){
        return <Navigate to="/admin/dashboard"/>
    }

    return (
        <ActivityLogsPage 
            title="Activity Logs"
            activityLogs={activityLogs}
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            breadcrumbs={PageBreadCrumbs}
            loading={loading}
            setPagination={setPagination}
            pagination={pagination}
        />
    )
}

export default ActivityLogs