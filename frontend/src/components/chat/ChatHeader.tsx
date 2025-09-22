import type { BaseChat } from "@/types";
import { Users, Phone, Video, MoreVertical } from "lucide-react";
import React from "react";

interface ChatHeaderProps {
  chat: BaseChat;
  onShowGroupInfo: () => void;
}
const ChatHeader: React.FC<ChatHeaderProps> = ({ chat, onShowGroupInfo }) => {
  return (
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
              chat?.name || "Group Chat"
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {chat?.name || "Group Chat"}
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
  );
};

export default ChatHeader;
