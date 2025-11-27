import { create } from "zustand";
import type { BaseChat, Message } from "@/types";
import {
  callCreateDirectChatApi,
  callCreateGroupChatApi,
  callFindChatByIdApi,
  callGetUserChatsApi,
  callGetChatMessagesApi,
} from "@/lib";

interface ChatStore {
  chats: BaseChat[];
  activeChat: string | null;
  selectedChat: BaseChat | null;
  messages: Message[] | [];
  typingUsers: string[];
  isLoadingChats: boolean;
  isLoadingMessages: boolean;
  page: number;
  hasMore: boolean;

  fetchChats: () => Promise<void>;
  setActiveChat: (chatId: string) => Promise<void>;
  fetchMoreMessages: () => Promise<void>;
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
  selectedChat: null,
  messages: [],
  typingUsers: [],
  isLoadingChats: false,
  isLoadingMessages: false,
  page: 1,
  hasMore: true,

  fetchChats: async () => {
    set({ isLoadingChats: true });
    try {
      const res = await callGetUserChatsApi();
      if (res.success && Array.isArray(res.data) && res.data.length) {
        set({ chats: res.data });
        if (!get().activeChat && res.data.length > 0) {
          get().setActiveChat(res.data[0]._id);
        }
      }
    } finally {
      set({ isLoadingChats: false });
    }
  },

  setActiveChat: async (chatId: string) => {
    set({ isLoadingMessages: true, page: 1, hasMore: true, messages: [] });
    try {
      const res = await callFindChatByIdApi(chatId, 1, 20);
      if (res.success && res.data?.chat) {
        const newMessages = res.data.messages || [];
        set({
          activeChat: res.data.chat._id,
          selectedChat: res.data.chat,
          messages: newMessages,
          hasMore: newMessages.length === 20,
        });
      }
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  fetchMoreMessages: async () => {
    const { activeChat, page, hasMore, isLoadingMessages } = get();
    if (!activeChat || !hasMore || isLoadingMessages) return;

    set({ isLoadingMessages: true });
    try {
      const nextPage = page + 1;
      const res = await callGetChatMessagesApi(activeChat, nextPage, 20);
      if (res.success && Array.isArray(res.data)) {
        const newMessages = res.data;
        set((state) => ({
          messages: [...newMessages, ...state.messages],
          page: nextPage,
          hasMore: newMessages.length === 20,
        }));
      } else {
        set({ hasMore: false });
      }
    } finally {
      set({ isLoadingMessages: false });
    }
  },

  createChat: async (type: string, participantIds: string[], name?: string) => {
    if (type === "direct") {
      await callCreateDirectChatApi(participantIds[0]);
    } else {
      await callCreateGroupChatApi(participantIds, name);
    }
  },

  setMessages: (messages: Message[]) => set({ messages }),

  reset: () => {
    set({
      chats: [],
      activeChat: null,
      messages: [],
      typingUsers: [],
      isLoadingChats: false,
      isLoadingMessages: false,
      page: 1,
      hasMore: true,
    });
  },
}));
