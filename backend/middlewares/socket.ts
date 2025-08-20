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

export let socketInstance: AuthenticatedSocket | undefined;

export const userSocketMap = new Map<string, string>();

export const initializeSocket = (server: HTTPServer): void => {
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

  io.on('connection', (socket: AuthenticatedSocket) => {
    const rawCookie = socket.handshake.headers.cookie || '';
    const cookies: { [key: string]: string } = {};

    rawCookie.split(';').forEach(cookieStr => {
      const [name, ...rest] = cookieStr.trim().split('=');
      cookies[name] = decodeURIComponent(rest.join('='));
    });

    const token = cookies.accessToken;

    socket.on('disconnect', () => {
      for (const [id, sId] of userSocketMap) {
        if (sId === socket.id) {
          userSocketMap.delete(id);
          break;
        }
      }
      socketInstance = undefined;
      console.log('User disconnected:', socket.id);
    });

    try {
      if (token) {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        socket.user = decodedToken;
        userSocketMap.set(socket.user.id, socket.id);
        console.log('User connected:', socket.id)
      }
    } catch (err: any) {
      console.log('Error verifying token:', err.message);
      socket.disconnect();
    }

    socketInstance = socket;
  });
};
