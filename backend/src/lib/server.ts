import express, { type Express } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import connectToDatabase from "../config";
import { initializeSocket } from "./socket/socket";
import mongoose from "mongoose";
import { authRouter, chatRouter, messageRouter, userRouter } from "routes";
import { redisClient } from "./redis";
import {
  allowedHeaders,
  allowedMethods,
  allowedOrigins,
  corsMiddleware,
} from "./cors";
import { apiLogger } from "middleware/looger";

dotenv.config();

const app: Express = express();

const PORT = process.env.APP_PORT || 3000;

if (
  !allowedOrigins?.length ||
  !allowedMethods?.length ||
  !allowedHeaders?.length
) {
  console.error("❌ Missing or invalid CORS configuration in .env");
  process.exit(1);
}

app.use(express.json());
app.use(express.urlencoded({ limit: "2mb", extended: true }));
app.use(helmet());
app.use(corsMiddleware);
app.use(apiLogger);

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/messages", messageRouter);

export const startServer = async () => {
  await connectToDatabase();
  await redisClient.connect();
  console.log("✅ Connected to Redis");

  const server = app.listen(PORT, () => {
    console.log(`🚀 User service is running on Port: ${PORT}`);
  });

  initializeSocket({
    server,
    allowedOrigins,
    allowedMethods,
    allowedHeaders,
  });

  return { server };
};

export const gracefulShutdown = async (
  server?: ReturnType<typeof app.listen>
) => {
  console.log("\n🛑 Shutting down gracefully...");
  try {
    if (server && server.listening) {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => {
          if (err) return reject(err);
          console.log("🚪 HTTP server closed.");
          resolve();
        });
      });
    } else {
      console.log("⚠️ No HTTP server running, skipping server.close()");
    }

    if (mongoose.connection.readyState) {
      await mongoose.connection.close();
      console.log("✅ MongoDB connection closed.");
    }

    if (redisClient.isOpen) {
      await redisClient.quit();
      console.log("✅ Redis client disconnected.");
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error during shutdown:", err);
    process.exit(1);
  }
};
