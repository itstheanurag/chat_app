import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { AuthenticatedSocket, JwtPayloadOptions } from "../types/auth";
import { chatHandler } from "../handlers/chat";
import type { Server as HTTPServer } from "http";

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

  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.query.token as string;
    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = jwt.verify(token, jwtSecret) as JwtPayloadOptions;
      socket.user = decoded;
      next();
    } catch (err: unknown) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    console.log("✅ User connected to socket");
    chatHandler(io, socket);

    socket.on("disconnect", () => {
      console.log("❌ User disconnected from socket");
    });
  });

  return io;
}
