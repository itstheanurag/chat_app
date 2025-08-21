import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import connectToDatabase from './config/db.js';
import { createClient, type RedisClientType } from 'redis';

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 3000;
let server: ReturnType<typeof app.listen>;

app.use(express.json());

const allowedOrigins = process.env.CORS_ORIGINS?.split(',')
  .map(o => o.trim())
  .filter(Boolean);
const allowedMethods = process.env.CORS_METHODS?.split(',')
  .map(m => m.trim())
  .filter(Boolean);
const allowedHeaders = process.env.CORS_HEADERS?.split(',')
  .map(h => h.trim())
  .filter(Boolean);

if (!allowedOrigins || !allowedOrigins.length ||
    !allowedMethods || !allowedMethods.length ||
    !allowedHeaders || !allowedHeaders.length) {
  console.error("❌ Missing or invalid CORS configuration in .env");
  process.exit(1);
}

// ✅ Dynamic CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: allowedMethods,
  allowedHeaders: allowedHeaders,
  credentials: true,
}));

// ✅ Create Redis client
export const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URI || 'redis://localhost:6379',
});

const startServer = async () => {
  try {
    await connectToDatabase();
    await redisClient.connect();
    console.log('✅ Connected to Redis');

    server = app.listen(PORT, () => {
      console.log(`🚀 User service is running on Port: ${PORT}`);
    });

  } catch (error: any) {
    console.error('❌ Startup Error:', error.message || error);
    process.exit(1);
  }
};

startServer();

// ✅ Graceful shutdown
const gracefulShutdown = async () => {
  console.log('\n🛑 Shutting down gracefully...');
  if (server) server.close(() => console.log('🚪 HTTP server closed.'));
  await mongoose.connection.close().catch(console.error);
  await redisClient.disconnect().catch(console.error);
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
