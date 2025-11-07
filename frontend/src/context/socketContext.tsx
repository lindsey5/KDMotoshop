import React, { createContext, useEffect, useState, type ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import type { AppDispatch } from '../features/store';
import { clearCart } from '../features/cart/cartSlice';
import { resetNotifications } from '../features/notifications/notificationSlice';
import { logoutUser } from '../features/user/userThunks';

const SOCKET_URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';

// 1. Define the shape of your context value
interface SocketContextType {
  socket: Socket | null;
}

// 2. Create context with default (initial) value
export const SocketContext = createContext<SocketContextType>({
  socket: null,
});

// 3. Define props for the provider component
interface SocketContextProviderProps {
  children: ReactNode;
}

// 4. Implement the provider
export const SocketContextProvider: React.FC<SocketContextProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const connectSocket =() => {
      try {
        const newSocket = io(SOCKET_URL, { withCredentials: true });

        newSocket.on("connect", () => {
          console.log("Connected to Socket");
        });

        newSocket.on("logout", () => {
          dispatch(clearCart());
          dispatch(resetNotifications());
          dispatch(logoutUser({ path: '/'}));
        })

        setSocket(newSocket);
      } catch (error : any) {
        console.error("Error connecting to socket:", error.message);
      }
    };

    connectSocket();

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
