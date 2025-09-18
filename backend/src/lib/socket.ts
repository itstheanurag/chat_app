import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import type { Server as HTTPServer } from "http";

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
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.query.token as string;
    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = jwt.verify(token, jwtSecret) as JwtPayloadOptions;
      socket.user = decoded;
      next();
    } catch (err) {
      console.error("JWT verification failed:", err);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.user?.name || "Unknown"}`);
  });

  return io;
}

// export function handleChatMessage(socket: AuthenticatedSocket, message: any) {
//   console.log(`📨 Message from ${socket.user?.name || "Unknown"}:`, message);

//   const chatMessage = {
//     user: socket.user?.name || "Anonymous",
//     message: message.text,
//     timestamp: new Date().toISOString(),
//   };

//   // Broadcast to all clients
//   socket.broadcast.emit("message", chatMessage);
// }
