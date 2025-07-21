import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { fetchData, updateData } from "../services/api";
import { SocketContext } from "./socketContext";
import { toast } from "react-toastify";

type Notification = {
    _id: string;
    to: string;
    from: string | Customer;
    order_id:  string;
    isViewed: boolean;
    content: string;
    createdAt: Date;
}

// Context type
interface AdminNotificationContextType {
  notifications: Notification[];
  total: number;
  unread: number;
  setPage: Dispatch<SetStateAction<number>>;
  updateNotification: (id : string) => Promise<void>;
}

// Create the context with a default value
export const AdminNotificationContext = createContext<AdminNotificationContextType>({
  notifications: [],
  total: 0,
  unread: 0,
  setPage: () => {},
  updateNotification: async () => {}
});

interface AdminNotificationContextProviderProps {
  children: ReactNode;
}

export const AdminNotificationContextProvider = ({ children }: AdminNotificationContextProviderProps) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [unread, setUnread] = useState<number>(0);
    const { socket } = useContext(SocketContext);
    const [page, setPage] = useState<number>(1);

    const updateNotification = async (id : string) => {
        const response = await updateData(`/api/notification/${id}/admin`, {});
        if(response.success){
            setNotifications(prev => prev.map(n => {
                return n._id === id ? {...n, isViewed: true } : n 
            }))
            setUnread(prev => prev - 1)
        }
    }

    useEffect(() => {
        const getNotifications = async () => {
            const response = await fetchData(`/api/notification/admin?limit=30&page=${page}`);

            if(response.success) {
                setNotifications(response.notifications);
                setTotal(response.totalNotifications);
                setUnread(response.totalUnread);
            }
        }

        getNotifications()
    }, [page])

    useEffect(() => {
        if (!socket) return;

        const handleNotification = (notification: any) => {
            toast.success(notification.content)
            setNotifications(prev => [notification, ...prev])
            setUnread(prev => prev + 1)
            setTotal(prev => prev + 1)
        };

        socket.on('adminNotification', handleNotification);

    }, [socket]);

    return (
        <AdminNotificationContext.Provider value={{ notifications, setPage, total, unread, updateNotification }}>
        {children}
        </AdminNotificationContext.Provider>
    );
};
