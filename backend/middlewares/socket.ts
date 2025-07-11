import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Server as HTTPServer } from 'http';

interface JwtPayload {
  id: string;
  [key: string]: any;
}

interface AuthenticatedSocket extends Socket {
  user?: JwtPayload;
}

let socketInstance: AuthenticatedSocket | undefined;

const initializeSocket = (server: HTTPServer): void => {
  const origin = [
    'http://localhost:5173',
    'https://kdmotoshop.onrender.com',
  ];

  const io = new Server(server, {
    cors: {
      origin,
      methods: ['GET', 'POST'],
      allowedHeaders: ['Authorization'],
      credentials: true,
    },
  });

  const userSocketMap = new Map<string, string>();

  io.on('connection', (socket: AuthenticatedSocket) => {
    const token = socket.handshake.auth.token;

    socket.on('disconnect', () => {
      socketInstance = undefined;
      console.log('User disconnected:', socket.id);
    });

    socket.on('add-to-cart', () => {
        socket.emit('add-to-cart');
    })

    try {
      if (token) {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        socket.user = decodedToken;
        userSocketMap.set(socket.user.id, socket.id);
      }
    } catch (err: any) {
      console.log('Error verifying token:', err.message);
      socket.disconnect();
    }

    socketInstance = socket;
  });
};

export { initializeSocket, socketInstance };
