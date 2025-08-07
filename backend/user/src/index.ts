import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectToDatabase from './config/db.js';
import { createClient, type RedisClientOptions } from 'redis';

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 3000;

const redisOptions = {
  socket: {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  password: process.env.REDIS_PASSWORD || undefined,
} as RedisClientOptions;

const redisAuth = createClient(redisOptions);
const redisOTP = createClient(redisOptions);
const redisOther = createClient(redisOptions);

let server: ReturnType<typeof app.listen>;

const startServer = async () => {
  try {
    await connectToDatabase();
    console.log("✅ Connected to MongoDB");

    await Promise.all([
      redisAuth.connect(),
      redisOTP.connect(),
      redisOther.connect(),
    ]);
    console.log("✅ Connected to Redis (auth, otp, other)");

    server = app.listen(PORT, () => {
      console.log(`🚀 User service is running on Port: ${PORT}`);
    });

  } catch (error: any) {
    console.error("❌ Startup Error:", error.message || error);
    process.exit(1);
  }
};

startServer();

const gracefulShutdown = async () => {
  console.log("\n🛑 Shutting down gracefully...");
  if (server) server.close(() => console.log("🚪 HTTP server closed."));
  await mongoose.connection.close().catch(console.error);
  await Promise.allSettled([
    redisAuth.disconnect(),
    redisOTP.disconnect(),
    redisOther.disconnect(),
  ]);
  console.log("🧹 MongoDB & Redis connections closed.");
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
