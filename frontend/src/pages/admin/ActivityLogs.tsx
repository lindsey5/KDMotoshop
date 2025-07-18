import { useContext, useEffect, useState } from "react";
import useDarkmode from "../../hooks/useDarkmode"
import { cn } from "../../utils/utils"
import { fetchData } from "../../services/api";
import { Title } from "../../components/Text";
import BreadCrumbs from "../../components/BreadCrumbs";
import Card from "../../components/Card";
import { formatDateWithWeekday } from "../../utils/dateUtils";
import { Avatar } from "@mui/material";
import { RedButton } from "../../components/Button";
import { AdminContext } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import CustomizedPagination from "../../components/Pagination";
import type { DateRange } from "@mui/x-date-pickers-pro";
import type { Dayjs } from "dayjs";
import { CustomDateRangePicker } from "../../components/DatePicker";

const UserAvatar = ({ image, sx } : { image : Admin['image'], sx?: Object }) => {
    const avatar = typeof  image === 'object' &&  image !== null && 'imageUrl' in  image
                ?  image.imageUrl
                    : typeof  image === 'string'
                    ? image
                : ''
    return (
        <Avatar src={avatar} sx={sx}/>
    )
}

const ActiviyContainer = ({ activityLog } : { activityLog: ActivityLog}) => {
    const isDark = useDarkmode();
    const { admin } = useContext(AdminContext);
    const navigate = useNavigate();
    const time = new Date(activityLog.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    const handleClick = () => {
        if(activityLog.order_id?._id){
            navigate(`/admin/orders/${activityLog.order_id._id}`)
        }else if(activityLog.product_id?._id){
            navigate(`/admin/product?id=${activityLog.product_id._id}`)
        }
    }

    return (
        <div className={cn("flex p-5 border-b border-gray-300 justify-between items-center", isDark && 'border-gray-500')}>
            <div className="flex gap-5 items-center">
                <UserAvatar image={activityLog.admin_id.image} sx={{ width: 60, height: 60}}/>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold">{admin?._id === activityLog.admin_id._id ? 'You' : `${activityLog.admin_id.firstname} ${activityLog.admin_id.lastname}`}</span>
                        {activityLog.description}
                        {activityLog.order_id?._id && activityLog.prev_value && activityLog.new_value && (
                        <div className={cn("flex items-center gap-3 bg-gray-200 px-3 py-1 rounded-full", isDark && 'bg-gray-600')}>
                            {activityLog.prev_value}
                            <ArrowRightAltIcon />
                            {activityLog.new_value}
                        </div>)}
                    </div>
                    <p className="mt-2">{time}</p>
                </div>
            </div>
            <RedButton onClick={handleClick}>View</RedButton>
        </div>
    )
}

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
    const isDark = useDarkmode();
    const [activityLogs, setActivityLogs] = useState<GroupedActivityLogs>({})
    const [selectedDates, setSelectedDates] = useState<DateRange<Dayjs> | undefined>()
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        searchTerm: '',
        totalPages: 1,
    });

    const handlePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPagination(prev => ({...prev, page: value}))
    };

    useEffect(() => {
        const get_activity_logs = async () => {
            const startDate = selectedDates?.[0] ? new Date(selectedDates[0].toString()) : '';
             const endDate = selectedDates?.[1] ? new Date(selectedDates[1].toString()) : '';
            const response = await fetchData(`/api/activity?limit=100&page=${pagination.page}&startDate=${startDate}&endDate=${endDate}`)
            if(response.success){
                const groupedLogs = response.activityLogs.reduce((acc : GroupedActivityLogs, item : ActivityLog) => {
                    const dateKey = new Date(item.createdAt).toISOString().split("T")[0];
                    if (!acc[dateKey]) {
                        acc[dateKey] = [];
                    }
                    acc[dateKey].push(item);
                    return acc;
                }, {})
                setPagination(prev => ({ ...prev, totalPages: response.totalPages}))
                setActivityLogs(groupedLogs)
            }
        }

        get_activity_logs()
    }, [pagination.page, selectedDates])

    return (
        <div className={cn("transition-colors duration-600  min-h-full p-5 bg-gray-100", isDark && 'text-white bg-[#121212]')}>
            <div className="flex items-center justify-between">
                <div>
                    <Title className="mb-4">Activity Logs</Title>
                    <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
                </div>
                <CustomDateRangePicker 
                    value={selectedDates}
                    setValue={setSelectedDates}
                />
            </div>
            
            {Object.entries(activityLogs).map(([key, value]) => (
                <Card key={key} className="mt-5 flex flex-col gap-5">
                    <h1 className="font-bold text-lg">{formatDateWithWeekday(new Date(key))}</h1>
                    {value.map(act => <ActiviyContainer key={act._id} activityLog={act}/>)}
                </Card>
            ))}
            <div className="flex justify-end mt-6">
                <CustomizedPagination count={pagination.totalPages} onChange={handlePage} />
            </div>
        </div>
    )
}

export default ActivityLogs