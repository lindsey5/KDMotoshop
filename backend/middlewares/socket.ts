import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Server as HTTPServer } from 'http';
import Cart, { ICart } from '../models/Cart';

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

    socket.on('add-to-cart', async (cart : ICart) => {
        try{
          const query : any = {
            product_id: cart.product_id,
            customer_id: cart.customer_id
          }

          if(cart.variant_id) query.variant_id = cart.variant_id

          const existedCart = await Cart.findOne(query)
          
          if(existedCart){
            existedCart.quantity += cart.quantity;
            await existedCart.save();
            socket.emit('add-to-cart', existedCart);
          }else{
            const newCart = new Cart(cart);
            await newCart.save()
            socket.emit('add-to-cart', newCart);
          }
        }catch(err : any){
          console.log('Error: ', err.message)
        }
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
