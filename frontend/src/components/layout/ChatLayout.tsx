import React, { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { ChatSidebar } from "../chat/ChatSideBar";
import { ChatWindow } from "../chat/ChatWindow";
import { useAuth } from "@/context/authContext";
import { connectSocket } from "@/lib/socket/socket";
import { getToken } from "@/lib/token";
import { getUserChats } from "@/lib/apis/chat";
import type { BaseChat } from "@/types/chat";

export const ChatLayout: React.FC = () => {
  const { user } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState<string>("1");
  const [isConnected, setIsConnected] = useState(false);
  const [chats, setChats] = useState<BaseChat[]>([]);
  const [loading, setLoading] = useState(true);

  const token = getToken("accessToken");

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);

    socket.on("connect", () => setIsConnected(true));

    // Example: listen for incoming messages
    socket.on("message", (msg) => {
      console.log("📩 New message:", msg);
    });

    return () => {
      socket.off("connect");
      socket.off("message");
      socket.disconnect();
      setIsConnected(false);
    };
  }, [token]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const res = await getUserChats();
        if (res.success && Array.isArray(res.data)) {
          setChats(res.data);
          if (res.data.length > 0) {
            setSelectedChatId(res.data[0]._id);
          }
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

  const handleSendMessage = (content: string) => {
    console.log("Sending message:", content);
  };

  const selectedChat = chats.find((chat) => chat._id === selectedChatId);

  return (
    <div className="h-screen bg-sage-50 flex">
      <ChatSidebar
        chats={chats}
        selectedChatId={selectedChatId}
        onSelectChat={setSelectedChatId}
        rerenderRequired={isRenderRequired}
      />

      {selectedChat ? (
        <ChatWindow
          chat={selectedChat}
          messages={[]}
          currentUser={user}
          onSendMessage={handleSendMessage}
          onShowGroupInfo={() => console.log("Show group info")}
        />
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
