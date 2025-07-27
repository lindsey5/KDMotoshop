import { memo, useContext } from "react";
import useDarkmode from "../../hooks/useDarkmode"
import { cn } from "../../utils/utils"
import { Title } from "../../components/text/Text";
import BreadCrumbs from "../../components/BreadCrumbs";
import Card from "../../components/cards/Card";
import { RedButton } from "../../components/buttons/Button";
import { AdminContext } from "../../context/AdminContext";
import { Navigate, useNavigate } from "react-router-dom";
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import CustomizedPagination from "../../components/Pagination";
import type { DateRange } from "@mui/x-date-pickers-pro";
import type { Dayjs } from "dayjs";
import { CustomDateRangePicker } from "../../components/DatePicker";
import UserAvatar from "../../components/images/UserAvatar";
import PageContainer from "../../components/containers/admin/PageContainer";
import { CircularProgress } from "@mui/material";

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
                    <div className="flex flex-wrap items-center gap-2">
                        <p>
                            <span className="font-bold mr-1">{admin?._id === activityLog.admin_id._id ? 'You' : `${activityLog.admin_id.firstname} ${activityLog.admin_id.lastname}`}</span>
                            {activityLog.description}
                        </p>
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
           {(activityLog.order_id || activityLog.product_id) && <RedButton onClick={handleClick}>View</RedButton>}
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

type ActivityContainerProps = {
    title: string
    activityLogs : GroupedActivityLogs,
    breadcrumbs: { label: string, href: string }[],
    selectedDates: DateRange<Dayjs> | undefined
    setSelectedDates : React.Dispatch<React.SetStateAction<DateRange<Dayjs> | undefined>>
    pagination: Pagination
    setPagination:React.Dispatch<React.SetStateAction<Pagination>>
    loading: boolean
}

const ActivityLogsPage = memo(({ title, activityLogs, breadcrumbs, selectedDates, setSelectedDates, pagination, setPagination, loading} :ActivityContainerProps) => {
    const { admin } = useContext(AdminContext);

    const handlePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPagination(prev => ({...prev, page: value}))
    };

    
    if(admin && admin.role !== 'Super Admin'){
        return <Navigate to="/admin/dashboard"/>
    }

    return (
        <PageContainer className="min-h-full">
            <div className="flex items-center justify-between">
                <div>
                    <Title className="mb-4">{title}</Title>
                    <BreadCrumbs breadcrumbs={breadcrumbs}/>
                </div>
                <CustomDateRangePicker 
                    value={selectedDates}
                    setValue={setSelectedDates}
                />
            </div>

            {!activityLogs || loading ? <div className="w-full h-[400px] flex justify-center items-center">
                <CircularProgress sx={{ color: 'red'}}/>
            </div> :

            Object.entries(activityLogs).map(([key, value]) => (
                <Card key={key} className="mt-5 flex flex-col gap-5">
                    <h1 className="font-bold text-lg">{key}</h1>
                    {value.map(act => <ActiviyContainer key={act._id} activityLog={act}/>)}
                </Card>
            ))}
            {activityLogs && !loading && <div className="flex justify-end mt-6">
                <CustomizedPagination count={pagination.totalPages} onChange={handlePage} page={pagination.page}/>
            </div>}
        </PageContainer>
    )
})

export default ActivityLogsPage