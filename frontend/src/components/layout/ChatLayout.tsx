import React, { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { ChatSidebar } from "../chat/ChatSideBar";
import { ChatWindow } from "../chat/ChatWindow";
import { connectSocket } from "@/lib/socket";
import { getToken } from "@/lib/storage";
import { useChatStore } from "@/stores/chat.store";

export const ChatLayout: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  const { activeChat, setActiveChat } = useChatStore();
  const token = getToken("accessToken");

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    return () => {
      socket.disconnect();
      setIsConnected(false);
    };
  }, [token]);

  return (
    <div className="h-screen bg-sage-50 flex">
      {/* Sidebar handles chat selection */}
      <ChatSidebar
        selectedChatId={activeChat?._id || null}
        onSelectChat={setActiveChat}
      />

      {/* Main window */}
      {activeChat ? (
        <ChatWindow chatId={activeChat._id} />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white border-r-4 border-slate-900">
          <div className="text-center">
            <div className="w-24 h-24 bg-sage-100 border-4 border-slate-900 flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-12 w-12 text-sage-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Select a conversation
            </h3>
            <p className="text-slate-600">
              Choose from your existing conversations or start a new one
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
