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

    try {
      if (token) {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        socket.join(decodedToken.id);
        console.log('User connected:', decodedToken.id)

        socket.on('disconnect', () => {
          socket.join(token);
          socketInstance = undefined;
          console.log('User disconnected:', decodedToken.id);
        });
      }
    } catch (err: any) {
      console.log('Error verifying token:', err.message);
      socket.disconnect();
    }

    socketInstance = socket;
  });
};
