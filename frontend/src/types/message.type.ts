export interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  text?: string;
  attachments?: string[];
  status: "sent" | "delivered" | "read";
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}
