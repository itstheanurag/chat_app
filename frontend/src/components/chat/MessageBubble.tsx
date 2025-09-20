import React from "react";
import { Check, CheckCheck } from "lucide-react";
import type { Message } from "@/types";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showSeen: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showSeen,
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? "order-2" : "order-1"}`}>
        <div
          className={`p-4 border-3 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${
            isOwn ? "bg-sage-500 text-white" : "bg-white text-slate-900"
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>

          <div
            className={`flex items-center justify-between mt-2 pt-2 border-t border-opacity-20 ${
              isOwn ? "border-white" : "border-slate-300"
            }`}
          >
            <span
              className={`text-xs ${
                isOwn ? "text-sage-100" : "text-slate-500"
              }`}
            >
              {formatTime(message.timestamp)}
            </span>

            {isOwn && showSeen && (
              <div
                className={`ml-2 ${
                  message.seenBy.length > 0 ? "text-sage-200" : "text-sage-300"
                }`}
              >
                {message.seenBy.length === 0 && <Check className="h-3 w-3" />}
                {message.seenBy.length === 1 && <Check className="h-3 w-3" />}
                {message.seenBy.length > 1 && (
                  <CheckCheck className="h-3 w-3" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
