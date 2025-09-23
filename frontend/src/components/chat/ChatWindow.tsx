import React, { useState, useRef, useEffect } from "react";
import type { Message } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { findChatById } from "@/lib/apis/chat";
import { Send } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { getSocket } from "@/lib/socket/socket";
import ChatHeader from "./ChatHeader";
import { toast } from "react-toastify";

interface ChatWindowProps {
  chatId: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chatId,
}) => {
  const { user } = useAuth();
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<any>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const socket = getSocket();

  /** Scroll to bottom when messages change */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** Fetch chat details + history */
  useEffect(() => {
    let isMounted = true;
    const fetchChats = async () => {
      try {
        const res = await findChatById(chatId);
        if (isMounted && res.success && res.data?.chat) {
          setChat(res.data.chat);
          setMessages(res.data.messages || []);
        }
      } catch (err) {
        // console.error("Failed to fetch chat:", err);
        toast.error((err as any)?.message || "Failed to load chats");
      }
    };
    if (chatId?.length === 24) fetchChats();
    return () => {
      isMounted = false;
    };
  }, [chatId]);

  /** Join/leave chat room and listen for messages + typing events */
  useEffect(() => {
    if (!socket || !chatId) return;

    socket.emit("joinChat", chatId);

    const handleNewMessage = (msg: Message) => {
      if (msg.chatId === chatId) setMessages((prev) => [...prev, msg]);
    };

    const handleUserTyping = ({ username }: { username: string }) => {
      if (username === user?.name) return; // Ignore self
      setTypingUsers((prev) =>
        prev.includes(username) ? prev : [...prev, username]
      );
    };

    const handleStopTyping = ({ username }: { username: string }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== username));
    };

    socket.on("receiveMessage", handleNewMessage);
    socket.on("userTyping", handleUserTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.emit("leaveChat", chatId);
      socket.off("receiveMessage", handleNewMessage);
      socket.off("userTyping", handleUserTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [chatId, socket, user?.name]);

  /** Send typing signals */
  const handleTyping = () => {
    if (!socket || !chatId || !user) return;

    if (!isTyping) {
      socket.emit("typing", { chatId, username: user.name });
      setIsTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit("stopTyping", { chatId, username: user.name });
      setIsTyping(false);
    }, 2000);
  };

  /** Send message */
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !chatId || !user) return;

    const content = messageInput.trim();
    if (!content) return;

    socket.emit("sendMessage", { chatId, text: content, senderId: user.id });
    setMessageInput("");
    socket.emit("stopTyping", { chatId, username: user.name });
    setIsTyping(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <ChatHeader chat={chat} />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m) => (
          <MessageBubble
            key={m._id}
            message={m}
            isOwn={m.senderId.toString() === user?.id}
            showSeen={!!chat?.participants?.length}
          />
        ))}
        {typingUsers.length > 0 && (
          <div className="text-sm text-neutral-500 italic">
            {typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"}{" "}
            typing…
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-end gap-4 p-6 border-t"
      >
        <textarea
          value={messageInput}
          onChange={(e) => {
            setMessageInput(e.target.value);
            handleTyping();
          }}
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
