import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import { createClient, type RedisClientType } from 'redis';
import connectToDatabase from 'config';
import helmet from 'helmet';

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 3000;
let server: ReturnType<typeof app.listen>;

app.use(express.json());
app.use(express.urlencoded({ limit: '2mb', extended: true }));
app.use(helmet())

const allowedOrigins = process.env.CORS_ORIGINS?.split(',')
  .map((o) => o.trim())
  .filter(Boolean);
const allowedMethods = process.env.CORS_METHODS?.split(',')
  .map((m) => m.trim())
  .filter(Boolean);
const allowedHeaders = process.env.CORS_HEADERS?.split(',')
  .map((h) => h.trim())
  .filter(Boolean);

if (
  !allowedOrigins ||
  !allowedOrigins.length ||
  !allowedMethods ||
  !allowedMethods.length ||
  !allowedHeaders ||
  !allowedHeaders.length
) {
  console.error('❌ Missing or invalid CORS configuration in .env');
  process.exit(1);
}

app.use(
  cors({
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
  }),
);

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

const gracefulShutdown = async () => {
  console.log('\n🛑 Shutting down gracefully...');

  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) {
            return reject(err);
          }
          console.log('🚪 HTTP server closed.');
          resolve();
        });
      });
    }

    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed.');

    await redisClient.destroy();
    console.log('✅ Redis client disconnected.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
