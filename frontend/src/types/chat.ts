import type { Message } from "./message.type";

export interface ChatUser {
  _id: string;
  name: string;
  email: string;
}

export interface GetUserChatsResult {
  data: BaseChat[];
}

export interface CreateDirectChatResult {
  data: BaseChat;
}

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
  chat: BaseChat;
  messages: Message[];
}
