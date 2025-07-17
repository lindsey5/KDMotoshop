import React, { createContext, useEffect, useState, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

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

  useEffect(() => {
    const connectSocket =() => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          const newSocket = io(SOCKET_URL, {
            auth: {
              token: token,
            },
          });

          newSocket.on("connect", () => {
            console.log("Connected to Socket");
          });

          setSocket(newSocket);
        }
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
