import React, { useState, useEffect, useRef } from "react";
import type { Message } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { Send } from "lucide-react";
import ChatHeader from "./ChatHeader";
import { useAuthStore } from "@/stores/user.store";
import { useChatStore, useSocketStore } from "@/stores";
import { formatDateSeparator } from "@/utils/formatter";

export const ChatWindow: React.FC = () => {
  const { user } = useAuthStore();
  const {
    fetchChats,
    activeChat,
    selectedChat,
    messages,
    setMessages,
    fetchMoreMessages,
    hasMore,
    isLoadingMessages,
  } = useChatStore();
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const { socket, connect, sendMessage, typing, stopTyping } = useSocketStore();
  const prevScrollHeightRef = useRef<number>(0);
  const isFetchingMoreRef = useRef(false);

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

  // Scroll to bottom on initial load or new message (if near bottom)
  useEffect(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100;

      const lastMessage = messages[messages.length - 1];
      const isOwnMessage =
        (typeof lastMessage?.senderId === "string"
          ? lastMessage.senderId
          : lastMessage?.senderId?._id) === user?.id;

      // If we just loaded the first page (or switched chats), scroll to bottom
      if (prevScrollHeightRef.current === 0) {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
      } else if (isFetchingMoreRef.current) {
        // If we loaded more messages (pagination), restore scroll position
        if (container.scrollHeight > prevScrollHeightRef.current) {
          container.scrollTop =
            container.scrollHeight - prevScrollHeightRef.current;
        }
        isFetchingMoreRef.current = false;
      } else if (isOwnMessage || isNearBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }

      prevScrollHeightRef.current = container.scrollHeight;
    }
  }, [messages]);

  // Reset scroll height ref when active chat changes
  useEffect(() => {
    prevScrollHeightRef.current = 0;
  }, [activeChat]);

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop } = messagesContainerRef.current;
      if (scrollTop === 0 && hasMore && !isLoadingMessages) {
        prevScrollHeightRef.current = messagesContainerRef.current.scrollHeight;
        isFetchingMoreRef.current = true;
        fetchMoreMessages();
      }
    }
  };

  useEffect(() => {
    if (!socket || !activeChat) return;

    socket.emit("joinChat", activeChat);

    const handleNewMessage = async (message: Message) => {
      const currentMessages = useChatStore.getState().messages;
      setMessages([...currentMessages, message]);

      const senderId =
        typeof message.senderId === "string"
          ? message.senderId
          : message.senderId._id;

      if (senderId !== user!.id) {
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
  }, [activeChat, socket]);

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
      <ChatHeader chat={selectedChat} />

      {/* Messages container */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 space-y-4"
      >
        {isLoadingMessages && hasMore && (
          <div className="text-center py-2">
            <span className="text-xs text-gray-500 font-mono">
              Loading older messages...
            </span>
          </div>
        )}
        {messages.map((m, index) => {
          const currentDate = new Date(m.createdAt).toDateString();
          const prevDate =
            index > 0
              ? new Date(messages[index - 1].createdAt).toDateString()
              : null;
          const showDateSeparator = currentDate !== prevDate;

          return (
            <React.Fragment key={m._id}>
              {showDateSeparator && (
                <div className="flex justify-center my-6 sticky top-0 z-10">
                  <span className="bg-violet-100 text-gray-900 text-xs font-bold font-mono px-3 py-1 border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] uppercase tracking-wider">
                    {formatDateSeparator(m.createdAt)}
                  </span>
                </div>
              )}
              <MessageBubble
                message={m}
                isOwn={m.senderId.toString() === user?.id}
                showSeen={!!selectedChat?.participants?.length}
              />
            </React.Fragment>
          );
        })}
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
        className="flex items-end gap-4 p-6 border-t-4 border-gray-900 bg-violet-50"
      >
        <textarea
          value={messageInput}
          onChange={(e) => {
            setMessageInput(e.target.value);
            handleTyping();
          }}
          placeholder="Type your message..."
          className="flex-1 resize-none border-2 border-gray-900 p-4 rounded-none bg-white font-mono focus:outline-none focus:bg-violet-50 transition-colors shadow-button"
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
          className="px-6 py-4 bg-gray-900 text-white font-bold font-mono border-2 border-gray-900 shadow-button hover:bg-violet-600 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};
