import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import GradeIcon from '@mui/icons-material/Grade';
import WarningIcon from '@mui/icons-material/Warning';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { formatDate } from "../utils/dateUtils";
import { useContext, useState, type JSX } from "react";
import { CustomerNotificationContext } from "../context/CustomerNotifContext";
import useDarkmode from "../hooks/useDarkmode";
import { useNavigate } from "react-router-dom";

const statusMap: Record<string, JSX.Element> = {
    'Pending':  <PendingActionsOutlinedIcon fontSize="large" />,
    'Accepted': <CheckCircleIcon fontSize="large" />,
    'Shipped': <LocalShippingIcon fontSize="large" />,
    'Completed': <AssignmentTurnedInIcon fontSize="large" />,
    'Rated': <GradeIcon fontSize="large" />,
    'Cancelled': <WarningIcon fontSize="large" />,
    'Rejected': <WarningIcon fontSize="large" />,
    'Refunded': <WarningIcon fontSize="large" />,
};

const extractStatus = (content: string): string | undefined => {
  return Object.keys(statusMap).find(status => content.includes(status));
};

export const NotificationsDrawerList = () => {
    const { notifications, nextPage, total, updateNotification } = useContext(CustomerNotificationContext);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const isDark = useDarkmode();

    const handleNextPage = () => {
        const next = page + 1;
        setPage(next);
        nextPage(next);
    };

    const navigateToOrder = (order_id : string, notification : any) => {
        navigate(`/order/${order_id}`)
        if(!notification.isViewed) updateNotification(notification._id);
    }

    return (
        <Box sx={{ width: 300, backgroundColor: isDark ? '#2a2a2a' : 'white', color: isDark ? 'white' : 'black'}}>
            <h1 className="pt-10 px-3 pb-3 text-2xl font-bold text-red-500">Notifications</h1>
            {notifications.length < 1 && <p className="w-full text-center mt-4">No notifications yet</p>}
            <List sx={{ backgroundColor: isDark ? '#2a2a2a' : 'white' }}>
                {notifications.map((n) => {
                const status = extractStatus(n.content);
                const icon = status ? statusMap[status] : <NotificationsOutlinedIcon />;

                return (
                    <ListItem key={n._id} disablePadding>
                    <ListItemButton
                        onClick={() => navigateToOrder(n.order_id, n)}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            backgroundColor: isDark ? '#2a2a2a' : 'white',
                            '&:hover': {
                            backgroundColor: isDark ? '#3d3d3d' : '#f0f0f0',
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: isDark ? 'white' : 'inherit' }}>
                            {icon}
                        </ListItemIcon>
                        <ListItemText
                        primary={n.content}
                        secondary={formatDate(n.createdAt)}
                        primaryTypographyProps={{
                            fontWeight: n.isViewed ? '' : 'bold'
                        }}
                        secondaryTypographyProps={{
                            style: {
                            color: isDark ? '#aaa' : '#666'
                            }
                        }}
                        />
                        {!n.isViewed && <span className="rounded-full p-1 bg-red-500"/>}
                    </ListItemButton>
                    </ListItem>
                );
                })}
                {total !== notifications.length && <button className="w-full mt-4 text-center cursor-pointer hover:text-gray-300" onClick={handleNextPage}>See more</button>}
            </List>
        </Box>
    );
};