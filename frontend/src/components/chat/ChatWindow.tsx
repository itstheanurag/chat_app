import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Users,
  Phone,
  Video,
} from "lucide-react";
import type { Message, User } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { findChatById } from "@/lib/apis/chat";
import { type BaseChat } from "@/types";

interface ChatWindowProps {
  chatId: string;
  currentUser: User | null;
  onSendMessage: (content: string) => void;
  onShowGroupInfo: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chatId,
  currentUser,
  onSendMessage,
  onShowGroupInfo,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [chat, setChat] = useState<BaseChat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      onSendMessage(messageInput.trim());
      setMessageInput("");
    }
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const res = await findChatById(chatId);

        // ✅ Check if backend returned the expected structure
        if (res.success && res.data) {
          const { chat, messages } = res.data;
          setChat(chat);
          setMessages(messages || []);
        }
      } catch (err) {
        console.error("Failed to fetch chats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [chatId]);

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      {/* Chat Header */}
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

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message?._id}
            message={message}
            isOwn={message.senderId === currentUser?.id}
            showSeen={!!chat?.participants?.length}
          />
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            Someone is typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t-4 border-slate-900 bg-sage-50 p-6">
        <form onSubmit={handleSendMessage} className="flex items-end gap-4">
          <div className="flex-1">
            <div className="flex items-end bg-white border-3 border-slate-300 focus-within:border-sage-500 transition-colors">
              <button
                type="button"
                className="p-3 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <Paperclip className="h-5 w-5" />
              </button>

              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 resize-none focus:outline-none text-slate-900 bg-transparent max-h-32"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />

              <button
                type="button"
                className="p-3 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <Smile className="h-5 w-5" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="p-4 bg-coral-500 hover:bg-coral-600 disabled:bg-slate-300 text-white border-3 border-slate-900 transition-all duration-200 hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
