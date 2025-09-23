import { useAuth } from "@/context/authContext";
import type { BaseChat } from "@/types";
import { extractChatName } from "@/utils/formatter";
import { Users, Phone, Video, MoreVertical } from "lucide-react";
import React from "react";
import ChatAvatar from "./ChatAvatar";

interface ChatHeaderProps {
  chat: BaseChat;
}
const ChatHeader: React.FC<ChatHeaderProps> = ({ chat }) => {
  const { user } = useAuth();
  return (
    <div className="bg-sage-100 border-b-4 border-slate-900 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <ChatAvatar chat={chat} user={user} />

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {extractChatName(chat, user)}
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
            <div className="p-3 text-slate-600 hover:text-slate-900 hover:bg-white border-2 border-transparent hover:border-slate-300 transition-all">
              <Users className="h-5 w-5" />
            </div>
          )}
          <button className="p-3 text-slate-600 hover:text-slate-900 hover:bg-white border-2 border-transparent hover:border-slate-300 transition-all">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
