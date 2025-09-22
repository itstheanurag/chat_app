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
  const formatTime = (date: Date | string) => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return parsedDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? "order-2" : "order-1"}`}>
        <div
          className={`p-4 border border-gray-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${
            isOwn
              ? "bg-blue-600 text-white" // Own messages: blue background, white text
              : "bg-gray-200 text-gray-900" // Others: light gray background, dark text
          }`}
        >
          <p className="text-sm leading-relaxed">{message.text}</p>

          <div
            className={`flex items-center justify-between mt-2 pt-2 border-t border-opacity-20 ${
              isOwn ? "border-blue-400" : "border-gray-300"
            }`}
          >
            <span
              className={`text-xs ${isOwn ? "text-blue-200" : "text-gray-500"}`}
            >
              {formatTime(message.createdAt)}
            </span>

            {/* Seen indicators (optional)
            {isOwn && showSeen && (
              <div
                className={`ml-2 ${
                  message.seenBy.length > 0 ? "text-blue-200" : "text-blue-400"
                }`}
              >
                {message.seenBy.length === 0 && <Check className="h-3 w-3" />}
                {message.seenBy.length === 1 && <Check className="h-3 w-3" />}
                {message.seenBy.length > 1 && <CheckCheck className="h-3 w-3" />}
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};
