import type { BaseChat } from "@/types";
import { extractChatName } from "@/utils/formatter";
import { Users, Phone, Video, MoreVertical } from "lucide-react";
import React from "react";
import ChatAvatar from "./ChatAvatar";
import { useAuthStore } from "@/stores";

interface ChatHeaderProps {
  chat?: BaseChat | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chat }) => {
  const { user } = useAuthStore();

  if (!chat) {
    return (
      <div className="bg-violet-100 border-b-4 border-gray-900 p-6 flex items-center justify-center">
        <p className="text-gray-600 italic font-mono">
          No active chat. Select a conversation or start a new one.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-violet-100 border-b-4 border-gray-900 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ChatAvatar chat={chat} user={user} />

          <div>
            <h2 className="text-xl font-bold text-gray-900 font-tertiary uppercase tracking-wide">
              {extractChatName(chat, user)}
            </h2>
            <p className="text-sm text-gray-600 font-mono font-bold">
              {chat.type === "group"
                ? `${chat.participants?.length} MEMBERS`
                : "ONLINE"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-3 text-gray-900 bg-white border-2 border-gray-900 shadow-button hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
            <Phone className="h-5 w-5" />
          </button>
          <button className="p-3 text-gray-900 bg-white border-2 border-gray-900 shadow-button hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
            <Video className="h-5 w-5" />
          </button>
          {chat.type === "group" && (
            <div className="p-3 text-gray-900 bg-white border-2 border-gray-900 shadow-button hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer">
              <Users className="h-5 w-5" />
            </div>
          )}
          <button className="p-3 text-gray-900 bg-white border-2 border-gray-900 shadow-button hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
