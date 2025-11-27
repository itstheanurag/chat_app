import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { ChatItem } from "./ChatItem";
import Modal from "./Modal";
import { useAuthStore, useChatStore } from "@/stores";

export const ChatSidebar: React.FC = () => {
  const { user, logout } = useAuthStore();

  const { chats, isLoadingChats, fetchChats, activeChat, setActiveChat } =
    useChatStore();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (chats.length === 0) {
      fetchChats();
    }
  }, [chats]);

  return (
    <div className="w-100 bg-white border-r-4 border-gray-900 flex flex-col h-full">
      <Modal />

      <div className="flex-1 overflow-y-auto p-4">
        {isLoadingChats ? (
          <p className="text-center text-gray-500 font-mono mt-4">
            Loading chats...
          </p>
        ) : chats.length > 0 ? (
          <div className="space-y-3">
            {chats?.map((chat) => (
              <ChatItem
                key={chat._id}
                chat={chat}
                isSelected={activeChat === chat._id}
                onClick={() => setActiveChat(chat._id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 border-2 border-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-900 font-bold font-mono">
              No conversations found
            </p>
            <p className="text-gray-500 text-sm mt-2 font-mono">
              Start a new chat to begin messaging
            </p>
          </div>
        )}
      </div>

      {/* User profile footer */}
      <div className="border-t-4 border-gray-900 bg-violet-50 p-4 flex-shrink-0 relative">
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <div className="w-12 h-12 bg-violet-500 border-2 border-gray-900 flex items-center justify-center text-white font-bold font-mono text-xl shadow-button group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none transition-all">
            {(user?.name || "?").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 font-mono truncate">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-600 font-mono truncate">
              {user?.email || ""}
            </p>
          </div>
          <div className="w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full" />
        </div>

        {menuOpen && (
          <div className="absolute bottom-full right-4 mb-2 bg-white border-4 border-gray-900 shadow-button z-50 w-48">
            <button
              onClick={logout}
              className="block w-full px-4 py-3 text-left text-gray-900 font-bold font-mono hover:bg-violet-100 transition-colors"
            >
              LOGOUT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
