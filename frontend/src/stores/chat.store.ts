import { create } from "zustand";
import type { BaseChat, Message } from "@/types";
import {
  callCreateDirectChatApi,
  callCreateGroupChatApi,
  callFindChatByIdApi,
  callGetUserChatsApi,
} from "@/lib";

interface ChatStore {
  chats: BaseChat[];
  activeChat: string | null;
  messages: Message[] | [];
  typingUsers: string[];
  isLoading: boolean;

  fetchChats: () => Promise<void>;
  setActiveChat: (chatId: string) => Promise<void>;
  createChat: (
    type: string,
    participantIds: string[],
    name?: string
  ) => Promise<void>;
  setMessages: (messages: Message[]) => void;
  reset: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  activeChat: null,
  messages: [],
  typingUsers: [],
  isLoading: false,

  fetchChats: async () => {
    set({ isLoading: true });
    try {
      const res = await callGetUserChatsApi();
      if (res.success && Array.isArray(res.data) && res.data.length) {
        set({ chats: res.data });
        if (!get().activeChat && res.data.length > 0) {
          get().setActiveChat(res.data[0]._id);
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
        set({
          activeChat: res.data.chat._id,
          messages: res.data.messages || [],
        });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  createChat: async (type: string, participantIds: string[], name?: string) => {
    if (type === "direct") {
      await callCreateDirectChatApi(participantIds[0]);
    } else {
      await callCreateGroupChatApi(participantIds, name);
    }
  },

  setMessages: (messages: Message[]) => set({ messages }), // added

  reset: () => {
    set({
      chats: [],
      activeChat: null,
      messages: [],
      typingUsers: [],
      isLoading: false,
    });
  },
}));
