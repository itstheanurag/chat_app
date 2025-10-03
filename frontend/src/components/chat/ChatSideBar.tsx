import React, { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { ChatItem } from "./ChatItem";
import type { BaseChat } from "@/types/chat";
import { getUserChats } from "@/lib/apis/chat";
import Modal from "./Modal";
import { toast } from "react-toastify";
import { useAuthStore } from "@/stores/user.store";

interface ChatSidebarProps {
  selectedChatId?: string;
  onSelectChat: (chatId: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  selectedChatId,
  onSelectChat,
}) => {
  const { user, logout } = useAuthStore();

  const [isLoading, setLoading] = useState<boolean>(true);
  const [chats, setChats] = useState<BaseChat[]>([]);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const res = await getUserChats();
      if (res.success && Array.isArray(res.data)) {
        setChats(res.data);
        if (res.data.length > 0) {
          onSelectChat(res.data[0]._id);
        }
      }
    } catch (err: unknown) {
      toast.error((err as any)?.message || "Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user]);

  return (
    <div className="w-100 bg-white border-r-4 border-neutral-900 flex flex-col h-full overflow-x-hidden">
      <Modal onChatCreated={fetchChats} />
      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {chats.length > 0 ? (
            <div className="space-y-2">
              {chats.map((chat: BaseChat) => (
                <ChatItem
                  key={chat._id}
                  chat={{ ...chat }}
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
            {(user?.name || "?").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="font-bold text-neutral-900">{user?.name || "User"}</p>
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
