import React from "react";
import { MessageSquare } from "lucide-react";
import { ChatSidebar } from "../chat/ChatSideBar";
import { ChatWindow } from "../chat/ChatWindow";
import { useChatStore } from "@/stores/chat.store";

export const ChatLayout: React.FC = () => {
  const { activeChat } = useChatStore();
  return (
    <div className="h-screen bg-violet-50 flex overflow-hidden">
      <ChatSidebar />

      {activeChat ? (
        <ChatWindow />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white border-r-4 border-gray-900 relative">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="text-center relative z-10 p-8 max-w-md">
            <div className="w-24 h-24 bg-violet-100 border-4 border-gray-900 flex items-center justify-center mx-auto mb-8 shadow-background transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <MessageSquare className="h-12 w-12 text-violet-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4 font-tertiary uppercase tracking-wider">
              Select a conversation
            </h3>
            <p className="text-gray-600 font-mono text-lg font-medium border-2 border-gray-900 p-4 bg-white shadow-button">
              Choose from your existing conversations or start a new one to
              begin chatting.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
