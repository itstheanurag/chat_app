import React, { useState, useRef, useEffect } from "react";
import type { Message, User } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { findChatById } from "@/lib/apis/chat";
import { Send, MoreVertical, Users, Phone, Video } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { getSocket, socket } from "@/lib/socket/socket";
import ChatHeader from "./ChatHeader";

interface ChatWindowProps {
  chatId: string;
  onShowGroupInfo: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chatId,
  onShowGroupInfo,
}) => {
  const { user } = useAuth();
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await findChatById(chatId);
        if (res.success && res.data?.chat) {
          setChat(res.data.chat);
          setMessages(res.data.messages || []);
        }
      } catch (err) {
        console.error("Failed to fetch chat:", err);
      }
    };

    if (chatId?.length === 24) fetchChats();
  }, [chatId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !chatId) return;

    socket.emit("joinChat", chatId);

    const handleNewMessage = (msg: Message) => {
      if (msg.chatId === chatId) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handleNewMessage);

    return () => {
      socket.emit("leaveChat", chatId);
      socket.off("receiveMessage", handleNewMessage);
    };
  }, [chatId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const content = messageInput.trim();
    if (!content || !user) return;
    socket?.emit("sendMessage", {
      chatId,
      text: messageInput,
      senderId: user.id,
    });

    setMessageInput("");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <ChatHeader chat={chat} onShowGroupInfo={onShowGroupInfo} />
      {/* Messages */}

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m) => (
          <MessageBubble
            key={m._id}
            message={m}
            isOwn={m.senderId._id === user?.id}
            showSeen={!!chat?.participants?.length}
          />
        ))}
        {/* Invisible div at the bottom to scroll into */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-end gap-4 p-6 border-t"
      >
        <textarea
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 resize-none border p-3 rounded"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={!messageInput.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};
