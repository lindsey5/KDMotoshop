import { useMemo, useState } from "react";
import { formatDateWithWeekday } from "../../../utils/dateUtils";
import type { DateRange } from "@mui/x-date-pickers-pro";
import type { Dayjs } from "dayjs";
import ActivityLogsPage from "./ActivityLogsPage";
import useFetch from "../../../hooks/useFetch";

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
    { label: 'My Activity', href: '/admin/myactivity' },
]

const MyActivity = () => {
    const [selectedDates, setSelectedDates] = useState<DateRange<Dayjs> | undefined>()
    const [page, setPage] = useState(1);
    const { startDate, endDate } = useMemo(()=> {
        const startDate = selectedDates?.[0] ? selectedDates?.[0].toString() : '';
        const endDate = selectedDates?.[1] ? selectedDates?.[1].toString()  : '';

        return { startDate, endDate }
    }, [selectedDates])

    const { data, loading } = useFetch(`/api/activities/admin?limit=50&page=${page}&startDate=${startDate}&endDate=${endDate}`);

    const activityLogs = useMemo<GroupedActivityLogs>(() => {
        if(!data) return {}
        const groupedLogs = data.activityLogs.reduce((acc : GroupedActivityLogs, item : ActivityLog) => {
            const dateKey = formatDateWithWeekday(item.createdAt);
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(item);
            return acc;
        }, {})
        return groupedLogs
    }, [data])

    return (
        <ActivityLogsPage 
            title="My Activity"
            activityLogs={activityLogs}
            selectedDates={selectedDates}
            setSelectedDates={setSelectedDates}
            breadcrumbs={PageBreadCrumbs}
            loading={loading}
            setPage={setPage}
            page={page}
            totalPages={data?.totalPages}
        />
    )
}

export default MyActivity