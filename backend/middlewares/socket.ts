import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Server as HTTPServer } from 'http';
import Admin from '../models/Admin';
import { Types } from 'mongoose';

interface JwtPayload {
  id: string;
  [key: string]: any;
}

interface AuthenticatedSocket extends Socket {
  user?: JwtPayload;
}

export let io: Server;

export const initializeSocket = (server: HTTPServer): void => {
  const origin = [
    'http://localhost:5173',
    'https://kdmotoshop.onrender.com',
  ];

  io = new Server(server, {
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

    if(!token){
      return socket.disconnect();
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      socket.join(decodedToken.id);
      
      console.log('User connected:', decodedToken.id);
      triggerCustomerStatus(decodedToken.id, true)

      socket.on('disconnect', async () => {
        await triggerCustomerStatus(decodedToken.id, false);
        console.log('User disconnected:', decodedToken.id);
      });

      socket.on('isOnline', async (customer_id : string) => {
        const isOnline = await isUserOnline(customer_id);
        io.emit('customerStatus', { customer_id, status: isOnline});
      })

    } catch (err: any) {
      console.log('Error verifying token:', err.message);
      socket.disconnect();
    }

  });
};

export const triggerCustomerStatus = async (customer_id : string, status : boolean) => {
  if (!io) return false; 
  const admins = await Admin.find();
  for(const admin of admins){
    const admin_id = (admin._id as Types.ObjectId).toString();
    io.to(admin_id).emit('customerStatus', { customer_id, status });
  }
}

export const isUserOnline = async (userId: string): Promise<boolean> => {
  if (!io) return false; 
  const sockets = await io.in(userId).fetchSockets();

  return sockets.length > 0;
};

export const logoutUser = (user_id : string) => {
  if (!io) return; 
  io.to(user_id).emit('logout');
}

export const successCheckout = (customer_id : string) => {
  if(!io) return;
  io.to(customer_id).emit('successCheckout');
}