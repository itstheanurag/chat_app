import React, { useEffect, useState } from "react";
import { Search, Users, MessageCircle } from "lucide-react";
import { ChatItem } from "./ChatItem";
import Button from "../ui/Button";
import { useAuth } from "@/context/authContext";
import { getUserChats } from "@/lib/apis/chat";
import type { BaseChat, ChatPopulated } from "@/types/chat";

interface ChatSidebarProps {
  selectedChatId?: string;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onNewGroup: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  selectedChatId,
  onSelectChat,
  onNewChat,
  onNewGroup,
}) => {
  const { logout, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [chats, setChats] = useState<BaseChat[]>([]);
  const [loading, setLoading] = useState(true);

  // Load chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const res = await getUserChats();
        if (res.success && Array.isArray(res.data)) {
          setChats(res.data);
          console.log(JSON.stringify(res.data));
        } else {
          setChats([]);
        }
      } catch (err) {
        console.error("Failed to fetch chats:", err);
        setChats([]);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  // Helpers
  const getChatDisplayName = (chat: BaseChat): string => {
    if (chat.type === "group") {
      // Show group name if set, otherwise a generic label
      return chat.name || `Group Chat (${chat.participants.length})`;
    }

    // Direct chat: find the participant who is NOT the current user
    const other = chat.participants.find((p) => p.userId._id !== user?.id);
    return other?.userId.name || "Direct Chat";
  };

  const filteredChats = chats.filter((chat) =>
    getChatDisplayName(chat).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-100 bg-white border-r-4 border-neutral-900 flex flex-col h-full overflow-x-hidden">
      {/* Search and actions */}
      <div className="bg-neutral-100 border-b-4 border-neutral-900 p-6">
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

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {loading ? (
            <p className="text-center text-neutral-500 py-8">Loading chats…</p>
          ) : filteredChats.length > 0 ? (
            <div className="space-y-2">
              {filteredChats.map((chat) => (
                <ChatItem
                  key={chat._id}
                  chat={chat}
                  isSelected={selectedChatId === chat._id}
                  onClick={() => onSelectChat(chat._id)}
                />
              ))}
            </div>
          ) : (
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

      {/* User profile */}
      <div className="relative border-t-4 border-neutral-900 bg-white p-4">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <div className="w-10 h-10 bg-green-500 border-2 border-neutral-900 flex items-center justify-center text-white font-bold shadow-button">
            {(user?.username || "?").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-bold text-neutral-900">
              {user?.username || "User"}
            </p>
            <p className="text-sm text-neutral-600">{user?.email || ""}</p>
          </div>
          <div className="w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
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
