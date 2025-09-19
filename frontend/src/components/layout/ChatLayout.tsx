import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import type { User, Chat, Message } from "../../types";
import { ChatSidebar } from "../chat/ChatSideBar";
import { ChatWindow } from "../chat/ChatWindow";

interface ChatLayoutProps {
  currentUser: User;
}

export const ChatLayout: React.FC<ChatLayoutProps> = ({ currentUser }) => {
  const [selectedChatId, setSelectedChatId] = useState<string>("1");
  const mockChats: Chat[] = [
    {
      id: "1",
      name: "Design Team",
      isGroup: true,
      participants: ["1", "2", "3", "4"],
      lastMessage: {
        id: "1",
        content: "Hey everyone! The new designs are ready for review",
        senderId: "2",
        chatId: "1",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        seenBy: ["1", "3"],
        messageType: "text",
      },
      unreadCount: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      name: undefined,
      isGroup: false,
      participants: ["1", "2"],
      lastMessage: {
        id: "2",
        content: "Thanks for the quick feedback!",
        senderId: "2",
        chatId: "2",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        seenBy: ["2"],
        messageType: "text",
      },
      unreadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      name: "Weekend Plans",
      isGroup: true,
      participants: ["1", "2", "3", "4", "5"],
      lastMessage: {
        id: "3",
        content: "Anyone up for hiking this Saturday?",
        senderId: "3",
        chatId: "3",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        seenBy: [],
        messageType: "text",
      },
      unreadCount: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockMessages: Message[] = [
    {
      id: "1",
      content:
        "Hey everyone! The new designs are ready for review. I've incorporated all the feedback from our last meeting.",
      senderId: "2",
      chatId: selectedChatId,
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      seenBy: ["1", "3"],
      messageType: "text",
    },
    {
      id: "2",
      content: "Looks great! I really like the new color scheme.",
      senderId: "1",
      chatId: selectedChatId,
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      seenBy: ["2", "3"],
      messageType: "text",
    },
    {
      id: "3",
      content:
        "The typography choices are perfect. Much more readable than the previous version.",
      senderId: "3",
      chatId: selectedChatId,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      seenBy: ["1"],
      messageType: "text",
    },
    {
      id: "4",
      content:
        "Should we schedule a meeting to discuss the implementation details?",
      senderId: "1",
      chatId: selectedChatId,
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      seenBy: [],
      messageType: "text",
    },
  ];

  const selectedChat = mockChats.find((chat) => chat.id === selectedChatId);

  const handleSendMessage = (content: string) => {
    // Handle sending message
    console.log("Sending message:", content);
  };

  return (
    <div className="h-screen bg-sage-50 flex">
      <ChatSidebar
        chats={mockChats}
        currentUser={currentUser}
        selectedChatId={selectedChatId}
        onSelectChat={setSelectedChatId}
        onNewChat={() => console.log("New chat")}
        onNewGroup={() => console.log("New group")}
      />

      {selectedChat ? (
        <ChatWindow
          chat={selectedChat}
          messages={mockMessages}
          currentUser={currentUser}
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
