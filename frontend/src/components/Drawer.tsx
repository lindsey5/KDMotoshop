import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import GradeIcon from '@mui/icons-material/Grade';
import WarningIcon from '@mui/icons-material/Warning';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { formatDate } from "../utils/dateUtils";
import { useState, type JSX } from "react";
import useDarkmode from "../hooks/useDarkmode";
import { Title } from "./text/Text";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { notificationsNextPage, updateAllNotifications } from "../redux/notification-reducer";

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
    const { notifications, total } = useSelector((state : RootState) => state.notification)
    const [page, setPage] = useState(1);
    const isDark = useDarkmode();
    const dispatch = useDispatch<AppDispatch>();

    const handleNextPage = () => {
        const next = page + 1;
        setPage(next);
        dispatch(notificationsNextPage({ page: next, user: 'customer'}));
    };

    const navigateToOrder = (order_id : string) => {
        dispatch(updateAllNotifications("customer"))
        window.location.href = `/order/${order_id}`
    }

    return (
        <Box sx={{ width: 300, backgroundColor: isDark ? '#2a2a2a' : 'white', color: isDark ? 'white' : 'black'}}>
            <Title className="pt-10 px-3 pb-3">Notifications</Title>
            {notifications.length < 1 && <p className="w-full text-center mt-4">No notifications yet</p>}
            <List sx={{ backgroundColor: isDark ? '#2a2a2a' : 'white' }}>
                {notifications.map((n) => {
                const status = extractStatus(n.content);
                const icon = status ? statusMap[status] : <NotificationsOutlinedIcon />;

                return (
                    <ListItem key={n._id} disablePadding>
                    <ListItemButton
                        onClick={() => navigateToOrder(n.order_id)}
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