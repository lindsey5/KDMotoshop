import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import categoryRoutes from './routes/categoryRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import salesRoutes from './routes/salesRoutes';
import customerRoutes from './routes/customerRoutes';
import cartRoutes from './routes/cartRoutes';
import paymentRoutes from './routes/paymentRoutes';
import notificationRoutes from './routes/notificationRoutes';
import { paymongoWebhook } from './middlewares/paymongo';
import cors from 'cors';
import express from 'express'
import morgan from 'morgan';

const app = express();
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

app.post('/api/paymongo/webhook', paymongoWebhook)

app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/product", productRoutes)
app.use("/api/order", orderRoutes)
app.use('/api/sales', salesRoutes)
app.use('/api/customer', customerRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/notification', notificationRoutes);

export default app