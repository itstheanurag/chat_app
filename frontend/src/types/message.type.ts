export interface MessageSender {
  _id: string;
  name: string;
  email: string;
}

export interface Message {
  _id: string;
  chatId: string;
  senderId: MessageSender;
  text?: string;
  attachments?: string[];
  status: "sent" | "delivered" | "read";
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}
