import express, { type Express } from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import { createClient, type RedisClientType } from "redis";
import connectToDatabase from "../config";
import userRoutes from "../routes/user.routes";
import chatRoutes from "../routes/chat.routes";
import messageRoutes from "../routes/message.routes";
import { initializeSocket } from "./socket";
import mongoose from "mongoose";

dotenv.config();

const app: Express = express();

const PORT = process.env.APP_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ limit: "2mb", extended: true }));
app.use(helmet());

const allowedOrigins = process.env.CORS_ORIGINS?.split(",")
  .map((o) => o.trim())
  .filter(Boolean);
const allowedMethods = process.env.CORS_METHODS?.split(",")
  .map((m) => m.trim())
  .filter(Boolean);
const allowedHeaders = process.env.CORS_HEADERS?.split(",")
  .map((h) => h.trim())
  .filter(Boolean);

if (
  !allowedOrigins?.length ||
  !allowedMethods?.length ||
  !allowedHeaders?.length
) {
  console.error("❌ Missing or invalid CORS configuration in .env");
  process.exit(1);
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: allowedMethods,
    allowedHeaders,
    credentials: true,
  })
);

// Routes
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

export const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URI || "redis://localhost:6379",
});

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
    jwtSecret: process.env.JWT_SECRET as string,
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
