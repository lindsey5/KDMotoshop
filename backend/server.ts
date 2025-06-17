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

app.use("/api/user", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/product", productRoutes)

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