import React, { useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { ChatSidebar } from "../chat/ChatSideBar";
import { ChatWindow } from "../chat/ChatWindow";
import { useChatStore } from "@/stores/chat.store";

export const ChatLayout: React.FC = () => {
  const { chats, fetchChats, activeChat, setActiveChat } = useChatStore();

  useEffect(() => {
    let isMounted = true;

    const fetch = async () => {
      if (!isMounted) return;
      await fetchChats();
    };

    fetch();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="h-screen bg-sage-50 flex">
      <ChatSidebar
        chats={chats}
        selectedChatId={activeChat || null}
        onSelectChat={setActiveChat}
      />

      {activeChat ? (
        <ChatWindow />
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
