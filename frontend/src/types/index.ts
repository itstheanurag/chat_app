export interface User {
  id: string;
  email: string;
  username: string;
  isEmailVerified: boolean;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  chatId: string;
  timestamp: Date;
  seenBy: string[];
  messageType: "text" | "image" | "file";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
