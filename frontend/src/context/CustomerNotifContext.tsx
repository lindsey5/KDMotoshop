import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchData, updateData } from "../services/api";
import { SocketContext } from "./socketContext";

type Notification = {
    _id: string;
    to: string;
    order_id:  string;
    isViewed: boolean;
    content: string;
    createdAt: Date;
}

// Context type
interface CustomerNotificationContextType {
  notifications: Notification[];
  total: number;
  unread: number;
  nextPage: (page : number) => void;
  updateNotification: (id : string) => Promise<void>;
}

// Create the context with a default value
export const CustomerNotificationContext = createContext<CustomerNotificationContextType>({
  notifications: [],
  total: 0,
  unread: 0,
  nextPage: () => {},
  updateNotification: async () => {}
});

interface CustomerNotificationContextProviderProps {
  children: ReactNode;
}

export const CustomerNotificationContextProvider = ({ children }: CustomerNotificationContextProviderProps) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [unread, setUnread] = useState<number>(0);
    const { socket } = useContext(SocketContext);

    const updateNotification = async (id : string) => {
        const response = await updateData(`/api/notification/${id}/customer`, {});
        if(response.success){
            setNotifications(prev => prev.map(n => {
                return n._id === id ? {...n, isViewed: true } : n 
            }))
            setUnread(prev => prev - 1)
        }
    }

    useEffect(() => {
        const getNotifications = async () => {
            const response = await fetchData('/api/notification/customer?limit=30&page=1');

            if(response.success) {
                setNotifications(response.notifications);
                setTotal(response.totalNotifications);
                setUnread(response.totalUnread);
            }
        }

        getNotifications()
    }, [])

    const nextPage = async (page : number) => {
        const response = await fetchData(`/api/notification/customer?limit=30&page=${page}`)
        if(response.success) setNotifications(prev => [...prev, ...response.notifications])
    }

    useEffect(() => {
        if (!socket) return;

        const handleNotification = (notification: any) => {
            setNotifications(prev => [notification, ...prev])
            setUnread(prev => prev + 1)
            setTotal(prev => prev + 1)
        };

        socket.on('customerNotification', handleNotification);

    }, [socket]);

    return (
        <CustomerNotificationContext.Provider value={{ notifications, nextPage, total, unread, updateNotification }}>
        {children}
        </CustomerNotificationContext.Provider>
    );
};
