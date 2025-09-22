import type { Message } from "./message.type";

export interface GetUserChatsResult {
  success: boolean;
  message: string;
  data?: BaseChat[];
}

export interface CreateDirectChatResult {
  success: boolean;
  message: string;
  data?: BaseChat;
}

export interface ChatUser {
  _id: string;
  name: string;
  email: string;
}

// Base type (unpopulated IDs)
export interface BaseParticipant {
  _id: string;
  userId: ChatUser;
  joinedAt: string;
}

export interface BaseChat {
  _id: string;
  type: "direct" | "group";
  name: string;
  participants: BaseParticipant[];
  admins: string[]; // Admin IDs
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  lastMessage?: {
    text: string;
    senderId: {
      _id: string;
      name: string;
    };
    createdAt: Date;
  };
  __v: number;
}

// Populated user type
export interface ChatUser {
  _id: string;
  name: string;
  email: string;
}

// Populated version
export interface ChatParticipantPopulated {
  _id: string;
  userId: ChatUser;
  joinedAt: string;
}

export interface ChatPopulated
  extends Omit<BaseChat, "participants" | "admins"> {
  participants: ChatParticipantPopulated[];
  admins: ChatUser[];
}

export type ChatList = ChatPopulated[];

export interface FindChatByIdResult {
  success: boolean;
  message: string;
  data?: { chat: BaseChat; messages: Message[] };
}
