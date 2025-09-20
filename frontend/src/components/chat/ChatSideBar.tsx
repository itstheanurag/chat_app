import React, { useState } from "react";
import { Search, Users, MessageCircle } from "lucide-react";
import { ChatItem } from "./ChatItem";
import type { Chat, User } from "@/types";
import Button from "../ui/Button";
import { useAuth } from "@/context/authContext";

interface ChatSidebarProps {
  chats: Chat[];
  currentUser: User;
  selectedChatId?: string;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onNewGroup: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  currentUser,
  selectedChatId,
  onSelectChat,
  onNewChat,
  onNewGroup,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();

  const filteredChats = chats.filter(
    (chat) =>
      chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (!chat.isGroup && searchQuery === "")
  );

  return (
    <div className="w-80 bg-white border-r-4 border-neutral-900 flex flex-col h-full overflow-x-hidden">
      {/* Header */}
      <div className="bg-neutral-100 border-b-4 border-neutral-900 p-6">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-600" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-neutral-300 focus:border-orange-500 focus:outline-none transition-colors bg-white text-neutral-900"
            placeholder="Search conversations..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onNewChat}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm tracking-tighter"
          >
            <MessageCircle className="h-4 w-4" />
            New Chat
          </Button>
          <Button
            onClick={onNewGroup}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white font-medium text-sm"
          >
            <Users className="h-4 w-4" />
            New Group
          </Button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="space-y-2">
            {filteredChats.map((chat) => (
              <ChatItem
                key={chat.id}
                chat={chat}
                isSelected={selectedChatId === chat.id}
                onClick={() => onSelectChat(chat.id)}
              />
            ))}
          </div>

          {filteredChats.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600 font-medium">
                No conversations found
              </p>
              <p className="text-neutral-400 text-sm mt-2">
                Start a new chat to begin messaging
              </p>
            </div>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="relative border-t-4 border-neutral-900 bg-white p-4">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <div className="w-10 h-10 bg-green-500 border-2 border-neutral-900 flex items-center justify-center text-white font-bold shadow-button">
            {currentUser.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-bold text-neutral-900">{currentUser.username}</p>
            <p className="text-sm text-neutral-600">{currentUser.email}</p>
          </div>
          <div className="w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>

        {menuOpen && (
          <div className="absolute bottom-full right-4 mb-2 bg-white border border-neutral-300 rounded shadow-lg">
            <button
              onClick={logout}
              className="block w-full px-4 py-2 text-left text-neutral-700 hover:bg-neutral-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
