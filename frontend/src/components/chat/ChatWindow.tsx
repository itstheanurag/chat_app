import React, { useState, useRef, useEffect } from "react";
import type { Message, User } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { findChatById } from "@/lib/apis/chat";
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Users,
  Phone,
  Video,
} from "lucide-react";
import { useAuth } from "@/context/authContext";
import { getSocket, socket } from "@/lib/socket/socket";

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
        scrollToBottom();
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

    scrollToBottom();
    socket?.emit("sendMessage", {
      chatId,
      text: messageInput,
      senderId: user.id,
    });

    setMessageInput("");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <div className="bg-sage-100 border-b-4 border-slate-900 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 border-3 border-slate-900 flex items-center justify-center font-bold text-white ${
                chat?.type === "group" ? "bg-navy-500" : "bg-coral-500"
              }`}
            >
              {chat?.type === "group" ? (
                <Users className="h-6 w-6" />
              ) : (
                (chat?.name || "Group Chat")?.charAt(0).toUpperCase()
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {(chat?.name || "Group Chat")?.charAt(0).toUpperCase()}
              </h2>
              <p className="text-sm text-slate-600">
                {chat?.type === "group"
                  ? `${chat?.participants?.length} members`
                  : "Online"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-3 text-slate-600 hover:text-slate-900 hover:bg-white border-2 border-transparent hover:border-slate-300 transition-all">
              <Phone className="h-5 w-5" />
            </button>
            <button className="p-3 text-slate-600 hover:text-slate-900 hover:bg-white border-2 border-transparent hover:border-slate-300 transition-all">
              <Video className="h-5 w-5" />
            </button>
            {chat?.type === "group" && (
              <button
                onClick={onShowGroupInfo}
                className="p-3 text-slate-600 hover:text-slate-900 hover:bg-white border-2 border-transparent hover:border-slate-300 transition-all"
              >
                <Users className="h-5 w-5" />
              </button>
            )}
            <button className="p-3 text-slate-600 hover:text-slate-900 hover:bg-white border-2 border-transparent hover:border-slate-300 transition-all">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      {/* Messages */}

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m) => (
          <MessageBubble
            key={m._id}
            message={m}
            isOwn={m.senderId === user?.id}
            showSeen={!!chat?.participants?.length}
          />
        ))}
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
