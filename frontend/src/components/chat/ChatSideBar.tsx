import React, { useState } from "react";
import { Search, Plus, Users, MessageCircle, Settings } from "lucide-react";
import { ChatItem } from "./ChatItem";
import type { Chat, User } from "../../types";

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

  const filteredChats = chats.filter(
    (chat) =>
      chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (!chat.isGroup && searchQuery === "")
  );

  return (
    <div className="w-80 bg-white border-r-4 border-slate-900 flex flex-col h-full">
      {/* Header */}
      <div className="bg-sage-100 border-b-4 border-slate-900 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-900">Messages</h1>
          <button className="p-2 text-slate-600 hover:text-slate-900 hover:bg-white border-2 border-transparent hover:border-slate-300 transition-all">
            <Settings className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-slate-300 focus:border-sage-500 focus:outline-none transition-colors bg-white text-slate-900"
            placeholder="Search conversations..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onNewChat}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-coral-500 hover:bg-coral-600 text-white font-medium border-2 border-slate-900 transition-all duration-200 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
          >
            <MessageCircle className="h-4 w-4" />
            New Chat
          </button>
          <button
            onClick={onNewGroup}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-navy-500 hover:bg-navy-600 text-white font-medium border-2 border-slate-900 transition-all duration-200 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
          >
            <Users className="h-4 w-4" />
            New Group
          </button>
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
              <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">
                No conversations found
              </p>
              <p className="text-slate-400 text-sm mt-2">
                Start a new chat to begin messaging
              </p>
            </div>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="border-t-4 border-slate-900 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sage-500 border-2 border-slate-900 flex items-center justify-center text-white font-bold">
            {currentUser.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900">{currentUser.username}</p>
            <p className="text-sm text-slate-600">{currentUser.email}</p>
          </div>
          <div className="w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
