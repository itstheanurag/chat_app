import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectToDatabase from './config/db.js';
import { createClient, type RedisClientType } from 'redis';

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 3000;

let server: ReturnType<typeof app.listen>;

// Create Redis client
export const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URI || 'redis://localhost:6379',
});

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    console.log('✅ Connected to MongoDB');

    // Connect to Redis
    await redisClient.connect();
    console.log('✅ Connected to Redis');

    // Start Express server
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
  if (server) server.close(() => console.log('🚪 HTTP server closed.'));
  await mongoose.connection.close().catch(console.error);
  await redisClient.disconnect().catch(console.error);
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
