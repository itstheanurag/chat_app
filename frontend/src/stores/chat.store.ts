/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import type { BaseChat, Message } from "@/types";
import { callFindChatByIdApi, callGetUserChatsApi, getSocket } from "@/lib";

interface ChatStore {
  chats: BaseChat[];
  activeChat: BaseChat | null;
  messages: Message[];
  typingUsers: string[];
  isLoading: boolean;

  fetchChats: () => Promise<void>;
  setActiveChat: (chatId: string) => Promise<void>;
  sendMessage: (text: string, userId: string) => void;
  handleTyping: (username: string) => void;
  reset: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => {
  const socket = getSocket();

  if (socket && !socket.hasListeners) {
    socket.on("receiveMessage", (msg: Message) => {
      const { activeChat } = get();
      if (msg.chatId === activeChat?._id) {
        set((state) => ({ messages: [...state.messages, msg] }));
      }
    });

    socket.on("userTyping", ({ username }: { username: string }) => {
      set((state) => ({
        typingUsers: state.typingUsers.includes(username)
          ? state.typingUsers
          : [...state.typingUsers, username],
      }));
    });

    socket.on("stopTyping", ({ username }: { username: string }) => {
      set((state) => ({
        typingUsers: state.typingUsers.filter((u) => u !== username),
      }));
    });

    (socket as any).hasListeners = true;
  }

  return {
    chats: [],
    activeChat: null,
    messages: [],
    typingUsers: [],
    isLoading: false,

    fetchChats: async () => {
      set({ isLoading: true });
      try {
        const res = await callGetUserChatsApi();
        if (res.success && Array.isArray(res.data)) {
          set({ chats: res.data });

          if (!get().activeChat && res.data.length > 0) {
            await get().setActiveChat(res.data[0]._id);
          }
        }
      } finally {
        set({ isLoading: false });
      }
    },

    setActiveChat: async (chatId: string) => {
      set({ isLoading: true });
      try {
        const res = await callFindChatByIdApi(chatId);
        if (res.success && res.data?.chat) {
          socket?.emit("joinChat", chatId);
          set({
            activeChat: res.data.chat,
            messages: res.data.messages || [],
          });
        }
      } finally {
        set({ isLoading: false });
      }
    },

    /** Send a message */
    sendMessage: (text: string, userId: string) => {
      const { activeChat } = get();
      if (!activeChat) return;

      socket?.emit("sendMessage", {
        chatId: activeChat._id,
        text,
        senderId: userId,
      });
    },

    handleTyping: (username: string) => {
      const { activeChat } = get();
      if (!activeChat) return;

      socket?.emit("typing", { chatId: activeChat._id, username });

      setTimeout(() => {
        socket?.emit("stopTyping", { chatId: activeChat._id, username });
      }, 2000);
    },

    reset: () => {
      set({
        chats: [],
        activeChat: null,
        messages: [],
        typingUsers: [],
        isLoading: false,
      });
    },
  };
});
