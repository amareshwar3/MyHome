import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import authRouter from './routes/auth.route.js'
import cookieParser from 'cookie-parser'
import userRouter from './routes/user.route.js'
import listingRouter from './routes/listing.route.js'
import path from 'path'
import { fileURLToPath } from 'url';

dotenv.config()

mongoose.connect(process.env.MONGODB_URI || process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
  .then(() => {
    console.log('MongoDB is connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Optionally, handle error events globally
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection lost');
});

const __filename = fileURLToPath(import.meta.url);

  const __dirname = path.dirname(__filename);

const app = express()

app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 3000;

app.listen(PORT,() => {
        console.log(`Server is running at port ${PORT}`)
    }
);

app.use('/api/user',userRouter);
app.use('/api/auth',authRouter)
app.use('/api/listing',listingRouter)

app.use(express.static(path.join(__dirname, '../../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Server error: '

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })
})
