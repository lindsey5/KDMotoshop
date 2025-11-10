import BreadCrumbs from "../../components/BreadCrumbs";
import Card from "../../components/Card";
import CustomizedTable from "../../components/Table";
import { Title } from "../../components/text/Text";
import CustomizedPagination from "../../components/Pagination";
import PageContainer from "./ui/PageContainer";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../features/store";
import { fetchNotifications, updateNotification } from "../../features/notifications/notificationThunks";
import { Avatar, Button } from "@mui/material";
import { cn } from "../../utils/utils";
import useDarkmode from "../../hooks/useDarkmode";
import { formatDate } from "../../utils/dateUtils";
import { useNavigate } from "react-router-dom";
import { RedButton } from "../../components/buttons/Button";
import { updateData } from "../../services/api";
import { successAlert } from "../../utils/swal";

const PageBreadCrumbs : { label: string, href: string }[] = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Notifications', href: '/admin/notifications' },
]

const AdminNotifications = () => {
    const isDark = useDarkmode();
    const { notifications, total } = useSelector((state : RootState) => state.notification)
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const handlePage = async (_event: React.ChangeEvent<unknown>, value: number) => {
        await dispatch(fetchNotifications({ page: value, user: 'admin'}))
    };


    const navigateToOrder = (notification : any) => {
        if(notification.review_id && notification.product_id){
            navigate(`/admin/reviews/${notification.product_id}?id=${notification.review_id}`)
        }else if(notification.refund_id){
             navigate(`/admin/refunds?id=${notification.refund_id}`)
        }else {
            navigate(`/admin/orders/${notification.order_id}`)
        }
        if(!notification.isViewed)  dispatch(updateNotification({ id: notification._id, user: "admin"}));
    }

    const markedAllAsRead = async () => {
        const response = await updateData('/api/notifications/admin', {});
        if(response.success){
            await successAlert('Success', response.message);
            window.location.reload();
        }
    }

    return (
        <PageContainer className="h-full flex flex-col">
            <Title className="mb-4">Notifications</Title>
            <BreadCrumbs breadcrumbs={PageBreadCrumbs}/>
            <Card className="flex-grow min-h-0 flex flex-col mt-10 gap-5">
                <div className="flex justify-end">
                    <Button onClick={markedAllAsRead} sx={{ color: isDark ? 'white' : 'red' }}>Mark All As Read</Button>
                </div>
                <CustomizedTable
                    cols={['Customer Name', 'Message', 'Date', 'Action']}
                    rows={notifications.map(n => {
                        const customer = typeof n.from === 'object' ? n.from : undefined
                        
                        return ({
                            'Customer Name' : (
                                <div className={cn('flex gap-3', !n.isViewed ? 'font-bold' : 'opacity-50')}>
                                    <Avatar src={(customer?.image as UploadedImage)?.imageUrl}/>
                                    <div>
                                        <h1>{customer?.firstname} {customer?.lastname}</h1>
                                        <p className={cn('mt-2', isDark ? 'text-gray-400' : 'text-gray-500')}>{customer?.email}</p>
                                    </div>
                                </div>
                            ),
                            'Message' : <p className={`${!n.isViewed ? 'font-bold' : 'opacity-50'}`}>{n.content}</p>,
                            'Date' : <p className={`${!n.isViewed ? 'font-bold' : 'opacity-50'}`}>{formatDate(n.createdAt)}</p>,
                            'Action' : <RedButton onClick={() => navigateToOrder(n)}>View</RedButton>
                        })

                    })}
                />
                <div className="flex justify-end">
                    <CustomizedPagination count={Math.ceil(total / 30)} onChange={handlePage} />
                </div>
            </Card>
        </PageContainer>
    )
}

export default AdminNotifications