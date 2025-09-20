import { io, Socket } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_SCOEKT_SERVER_URL!;

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  if (!socket || !socket.connected) {
    socket = io(BACKEND_URL, {
      transports: ["websocket"],
      query: { token },
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("✅ Connected to socket server:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.warn("❌ Disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connection Error:", err.message);
    });
  }
  return socket;
};

export const getSocket = (): Socket | null => socket;
