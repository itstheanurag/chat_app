import React from "react";
import { Users, Check, CheckCheck } from "lucide-react";
import type { Chat } from "../../types";

interface ChatItemProps {
  chat: Chat;
  isSelected: boolean;
  onClick: () => void;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  chat,
  isSelected,
  onClick,
}) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getDisplayName = () => {
    if (chat.isGroup) {
      return chat.name || "Group Chat";
    }
    return "Direct Message";
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-4 text-left transition-all duration-200 border-2 hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${
        isSelected
          ? "bg-sage-100 border-sage-500 shadow-[3px_3px_0px_0px_rgba(34,197,94,1)]"
          : "bg-white border-slate-300 hover:border-slate-400 shadow-[2px_2px_0px_0px_rgba(148,163,184,1)]"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div
            className={`w-12 h-12 border-2 border-slate-900 flex items-center justify-center font-bold text-white ${
              chat.isGroup ? "bg-navy-500" : "bg-coral-500"
            }`}
          >
            {chat.isGroup ? (
              <Users className="h-6 w-6" />
            ) : (
              getDisplayName().charAt(0).toUpperCase()
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 truncate">
                {getDisplayName()}
              </h3>
              <span className="text-xs text-slate-500 ml-2">
                {chat.lastMessage && formatTime(chat.lastMessage.timestamp)}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              {chat.lastMessage && (
                <>
                  {chat.lastMessage.seenBy.length > 0 && (
                    <div className="text-sage-600">
                      {chat.lastMessage.seenBy.length === 1 ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <CheckCheck className="h-3 w-3" />
                      )}
                    </div>
                  )}
                  <p className="text-sm text-slate-600 truncate flex-1">
                    {chat.lastMessage.content}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {chat.unreadCount > 0 && (
          <div className="bg-coral-500 text-white text-xs font-bold px-2 py-1 border border-slate-900 min-w-[20px] text-center">
            {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
          </div>
        )}
      </div>
    </button>
  );
};
