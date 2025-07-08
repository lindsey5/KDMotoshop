import express from 'express'
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { createServer } from 'http';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import salesRoutes from './routes/salesRoutes';
import customerRoutes from './routes/customerRoutes';
import cartRoutes from './routes/cartRoutes';
import paymentRoutes from './routes/paymentRoutes';
import { initializeSocket } from './middlewares/socket';
import { paymongoWebhook } from './middlewares/paymongo';

dotenv.config();
const PORT = process.env.PORT || 3000; 
const app = express();
const server = createServer(app);

// Connect to mongodb
const dbURI = <string>process.env.MONGODB_URI;
mongoose.connect(dbURI)
    .then((result) => console.log('Connected to db'))
    .catch((err) => console.log(err));

// middleware & static files
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/api/regions', async (req, res) => {
  const response = await fetch('https://psgc.gitlab.io/api/regions');
  const data = await response.json();
  res.status(200).json(data);
});

app.get('/api/regions/:regionCode/cities-municipalities', async (req, res) => {
  if (!req.params.regionCode) {
    res.status(400).json({ success: false, message: 'Region code is required' });
    return;
  }
  const response = await fetch(`https://psgc.gitlab.io/api/regions/${req.params.regionCode}/cities-municipalities/`);
  const data = await response.json();
  res.status(200).json(data);
});

app.get('/api/cities-municipalities/:cityOrMunicipalityCode/barangays', async (req, res) => {
  const { cityOrMunicipalityCode } = req.params;

  if (!cityOrMunicipalityCode) {
    res.status(400).json({ success: false, message: 'City code is required' });
    return;
  }

  const response = await fetch(`https://psgc.gitlab.io/api/cities-municipalities/${cityOrMunicipalityCode}/barangays`);

  const data = await response.json();

  res.status(200).json(data);
});

app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/product", productRoutes)
app.use("/api/order", orderRoutes)
app.use('/api/sales', salesRoutes)
app.use('/api/customer', customerRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/payment', paymentRoutes)

app.post('/api/paymongo/webhook', paymongoWebhook)

initializeSocket(server)

const dirname = path.resolve();

// Now you can use __dirname
if (process.env.NODE_ENV === "production") { 
  app.use(express.static(path.join(dirname, "/frontend/dist")));
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.resolve(dirname, "frontend", "dist", "index.html"));
  });
}

// Start the server and connect to the database
server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});