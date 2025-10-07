import { create } from "zustand";
import { Socket } from "socket.io-client";
import { connectSocket, getToken } from "@/lib";

interface SocketStore {
  socket: Socket | null;
  connect: (userId: string) => void;
  disconnect: () => void;
  sendMessage: (chatId: string, text: string, senderId: string) => void;
  typing: (chatId: string, username: string) => void;
  stopTyping: (chatId: string, username: string) => void;
}

export const useSocketStore = create<SocketStore>((set, get) => {
  return {
    socket: null,

    connect: () => {
      if (get().socket) return;
      const token = getToken("accessToken");

      if (token) {
        const socket = connectSocket(token);
        set({ socket });
      }
    },

    disconnect: () => {
      get().socket?.disconnect();
      set({ socket: null });
    },

    sendMessage: (chatId, text, senderId) => {
      get().socket?.emit("sendMessage", { chatId, text, senderId });
    },

    typing: (chatId, username) => {
      const socket = get().socket;
      if (!socket) return;
      socket.emit("typing", { chatId, username });
    },

    stopTyping: (chatId, username) => {
      const socket = get().socket;
      if (!socket) return;
      socket.emit("stopTyping", { chatId, username });
    },
  };
});
