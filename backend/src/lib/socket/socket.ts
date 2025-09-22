import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import type { Server as HTTPServer } from "http";
import { registerChatEvents } from ".";

interface JwtPayloadOptions {
  id: string;
  email: string;
  name: string;
}

export interface AuthenticatedSocket extends Socket {
  user?: JwtPayloadOptions;
}

interface InitSocketOptions {
  server: HTTPServer;
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
}

export function initializeSocket({
  server,
  allowedOrigins,
  allowedMethods,
  allowedHeaders,
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
    console.log(
      `🔗 [${new Date().toISOString()}] Socket connected: ${socket.id}, ` +
        `IP: ${socket.handshake.address}, ` +
        `Transport: ${socket.conn.transport}`
    );

    const token = socket.handshake.query.token as string;
    if (!token) return next(new Error("Authentication error"));

    try {
      const secret: jwt.Secret = process.env.JWT_ACCESS_SECRET!;
      const decoded = jwt.verify(token, secret) as JwtPayloadOptions;
      socket.user = decoded;
      next();
    } catch (err) {
      console.error("JWT verification failed:", err);
      next(new Error("Authentication error"));
    }
  });

  registerChatEvents(io);

  return io;
}
