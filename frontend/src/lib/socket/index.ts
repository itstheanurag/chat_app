import { io, Socket } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_SCOEKT_SERVER_URL!;

export let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  if (!socket || !socket.connected) {
    socket = io(BACKEND_URL, {
      transports: ["websocket"],
      query: { token },
      withCredentials: true,
    });
  }
  return socket;
};

export const getSocket = (): Socket | null => socket;
