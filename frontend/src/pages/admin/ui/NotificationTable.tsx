import { Avatar, TableRow } from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../../../components/Table";
import { formatDate } from "../../../utils/dateUtils";
import { useNavigate } from 'react-router-dom';
import useDarkmode from "../../../hooks/useDarkmode";
import { cn } from "../../../utils/utils";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../../redux/store";
import { updateNotification } from "../../../redux/notification-reducer";

type Notification = {
    _id: string;
    to: string;
    from?: string | Customer;
    refund_id?: string;
    order_id?:  string;
    product_id?: string;
    review_id?: string;
    isViewed: boolean;
    content: string;
    createdAt: Date;
}

export const NotificationsTableColumns = () => {
    return (
        <TableRow sx={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <StyledTableCell>Customer Name</StyledTableCell>
            <StyledTableCell>Message</StyledTableCell>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell></StyledTableCell>
        </TableRow>
    )
}

type NotificationCellProps = {
    children: React.ReactNode;
    isDark: boolean;
    isViewed: boolean;
}

const NotificationCell = ({ children, isDark, isViewed } : NotificationCellProps) => {
    return <StyledTableCell 
        isDark={isDark} 
        sx={{ 
            fontWeight: isViewed ? '' : 'bold', 
            cursor: 'pointer', 
        }}
    >
        {children}
    </StyledTableCell>
}

export const NotificationTableRow = ({ notification } : { notification : Notification }) => {
    const navigate = useNavigate();
    const isDark = useDarkmode();
    const dispatch = useDispatch<AppDispatch>();

    const customer = typeof notification.from === 'object' ? notification.from : undefined
    const navigateToOrder = () => {
        if(notification.review_id && notification.product_id){
            navigate(`/admin/reviews/${notification.product_id}?id=${notification.review_id}`)
        }else if(notification.refund_id){
             navigate(`/admin/refunds?id=${notification.refund_id}`)
        }else {
            navigate(`/admin/orders/${notification.order_id}`)
        }
        if(!notification.isViewed)  dispatch(updateNotification({ id: notification._id, user: "admin"}));
    }

    return (
        <StyledTableRow
            sx={{
                ":hover": {
                backgroundColor: isDark ? ' #555555' : '#bebebe'
                }
            }}
            isDark={isDark}
            onClick={navigateToOrder}
        >
            <NotificationCell isDark={isDark} isViewed={notification.isViewed}>
            <div className="flex gap-3">
                <Avatar src={(customer?.image as UploadedImage).imageUrl}/>
                <div>
                    <h1>{customer?.firstname} {customer?.lastname}</h1>
                    <p className={cn('mt-2', isDark ? 'text-gray-400' : 'text-gray-500')}>{customer?.email}</p>
                </div>
            </div>
            </NotificationCell>
            <NotificationCell isDark={isDark} isViewed={notification.isViewed}>
                <div className="min-w-[200px]">
                    {notification.content}
                </div>
            </NotificationCell>
            <NotificationCell isDark={isDark} isViewed={notification.isViewed}>
                <div className="min-w-[150px]">
                    {formatDate(notification.createdAt)}
                </div>
            </NotificationCell>
            <NotificationCell isDark={isDark} isViewed={notification.isViewed}>
                {!notification.isViewed && <div className="flex">
                    <div className="p-[5px] bg-red-600 rounded-full" />
                </div>}
            </NotificationCell>
        </StyledTableRow>
    )
}