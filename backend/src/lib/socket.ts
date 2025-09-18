import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import type { Server as HTTPServer } from "http";

interface JwtPayloadOptions {
  id: string;
  email: string;
  name: string;
}

interface InitSocketOptions {
  server: HTTPServer;
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  jwtSecret: string;
}

export function initializeSocket({
  server,
  allowedOrigins,
  allowedMethods,
  allowedHeaders,
  jwtSecret,
}: InitSocketOptions): Server {
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: allowedMethods,
      allowedHeaders,
      credentials: true,
    },
  });

  // Middleware for authentication
  io.use((socket, next) => {
    const token = socket.handshake.query.token as string;
    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = jwt.verify(token, jwtSecret) as JwtPayloadOptions;
      socket.user = decoded; // ✅ TypeScript now knows about this
      next();
    } catch (err) {
      console.error("❌ JWT verification failed:", err);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.user?.name || "Unknown"}`);

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.user?.name || "Unknown"}`);
    });
  });

  return io;
}
