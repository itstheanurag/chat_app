import React, { useState, useEffect, useRef } from "react";
import type { BaseChat, Message } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { Send } from "lucide-react";
import ChatHeader from "./ChatHeader";
import { useAuthStore } from "@/stores/user.store";
import { useChatStore, useSocketStore } from "@/stores";
import { callFindChatByIdApi } from "@/lib/apis/chat";
import { errorToast } from "@/lib";

export const ChatWindow: React.FC = () => {
  const { user } = useAuthStore();
  const { fetchChats, activeChat, messages, setMessages } = useChatStore();
  const [chat, setChat] = useState<BaseChat | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fetchedChatRef = useRef<string | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const { socket, connect, sendMessage, typing, stopTyping } = useSocketStore();

  type TypingUser = { userId: string; username: string };
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  const renderTypingUsers = (users: { userId: string; username: string }[]) => {
    if (users.length === 0) return null;
    if (users.length === 1) return `${users[0].username} is typing…`;
    if (users.length === 2)
      return `${users[0].username} and ${users[1].username} are typing…`;
    return `${users[0].username} and ${users.length - 1} others are typing…`;
  };

  useEffect(() => {
    if (user && !socket) connect(user.id);
  }, [user, socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /** Fetch chat when activeChat changes */
  useEffect(() => {
    if (!activeChat || activeChat.length !== 24) return;
    if (fetchedChatRef.current === activeChat) return;

    let isMounted = true;

    const fetchChat = async () => {
      try {
        const res = await callFindChatByIdApi(activeChat);
        if (isMounted && res.success && res.data?.chat) {
          setChat(res.data.chat);
          setMessages(res.data.messages || []);
          fetchedChatRef.current = activeChat;
        }
      } catch (err) {
        errorToast((err as any)?.message || "Failed to load chat");
      }
    };

    fetchChat();
    return () => {
      isMounted = false;
    };
  }, [activeChat]);

  useEffect(() => {
    if (!socket || !activeChat) return;

    socket.emit("joinChat", activeChat);

    const handleNewMessage = async (message: Message) => {
      const currentMessages = useChatStore.getState().messages;
      setMessages([...currentMessages, message]);

      if (message.senderId._id !== user!.id) {
        await fetchChats();
      }
    };

    const handleUserTyping = (data: { userId: string; username: string }) => {
      if (data.userId === user!.id) return; // don't show yourself
      setTypingUsers((prev) =>
        prev.some((u) => u.userId === data.userId) ? prev : [...prev, data]
      );
    };

    const handleStopTyping = (data: { userId: string; username: string }) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    };

    socket.on("receiveMessage", handleNewMessage);
    socket.on("userTyping", handleUserTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("receiveMessage", handleNewMessage);
      socket.off("userTyping", handleUserTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [activeChat]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!socket || !activeChat || !user) return;
    const content = messageInput.trim();
    if (!content) return;
    sendMessage(activeChat, content, user.id);
    setMessageInput("");
  };

  const handleTyping = () => {
    if (!activeChat || !user) return;

    typing(activeChat, user.name);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(activeChat, user.name);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <ChatHeader chat={chat} />

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m) => (
          <MessageBubble
            key={m._id}
            message={m}
            isOwn={m.senderId.toString() === user?.id}
            showSeen={!!chat?.participants?.length}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator outside scrollable area */}
      {typingUsers.length > 0 && (
        <div className="p-2 text-sm text-neutral-500 italic">
          {renderTypingUsers(typingUsers)}
        </div>
      )}

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
              handleSendMessage();
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
