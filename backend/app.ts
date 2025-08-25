import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import salesRoutes from './routes/salesRoutes';
import customerRoutes from './routes/customerRoutes';
import cartRoutes from './routes/cartRoutes';
import paymentRoutes from './routes/paymentRoutes';
import notificationRoutes from './routes/notificationRoutes';
import activityLogRoutes from './routes/activityLogRoutes';
import reviewRoutes from './routes/reviewRoutes';
import { paymongoWebhook } from './middlewares/paymongo';
import cors from 'cors';
import express from 'express'
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import refundRoutes from './routes/refundRoutes';

const app = express();

const origins = process.env.NODE_ENV === 'production' ? [] : ['http://localhost:5173', 'http://192.168.1.3:5000']

// middleware & static files
app.use(cors({
    origin: origins,
    credentials: true
}))
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

app.get('/api/regions', async (req, res) => {
  const response = await fetch('https://psgc.gitlab.io/api/regions');
  const data = await response.json();
  res.status(200).json({ success: true, regions: data});
});

app.get('/api/regions/:regionCode/cities-municipalities', async (req, res) => {
  if (!req.params.regionCode) {
    res.status(400).json({ success: false, message: 'Region code is required' });
    return;
  }
  const response = await fetch(`https://psgc.gitlab.io/api/regions/${req.params.regionCode}/cities-municipalities/`);
  const data = await response.json();
  res.status(200).json({ success: true, cities: data});
});

app.get('/api/cities-municipalities/:cityOrMunicipalityCode/barangays', async (req, res) => {
  const { cityOrMunicipalityCode } = req.params;

  if (!cityOrMunicipalityCode) {
    res.status(400).json({ success: false, message: 'City code is required' });
    return;
  }

  const response = await fetch(`https://psgc.gitlab.io/api/cities-municipalities/${cityOrMunicipalityCode}/barangays`);

  const data = await response.json();

  res.status(200).json({ success: true, barangays: data });
});

app.post('/api/paymongo/webhook', paymongoWebhook)
app.use("/api/admins", adminRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use('/api/sales', salesRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/activities', activityLogRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/refunds', refundRoutes)

export default app