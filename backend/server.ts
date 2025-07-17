import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initializeSocket } from './middlewares/socket';
import app from './app';
import path from 'path';
import express from 'express'

dotenv.config();
const PORT = process.env.PORT || 3000; 

const server = createServer(app);

initializeSocket(server)

// Connect to mongodb
const dbURI = <string>process.env.MONGODB_URI;
mongoose.connect(dbURI)
    .then((result) => console.log('Connected to db'))
    .catch((err) => console.log(err));


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