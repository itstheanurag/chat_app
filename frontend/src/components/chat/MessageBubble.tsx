import React from "react";
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
    return parsedDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? "order-2" : "order-1"}`}>
        <div
          className={`p-4 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] ${
            isOwn ? "bg-violet-500 text-white" : "bg-white text-gray-900"
          }`}
        >
          <p className="text-sm leading-relaxed font-mono font-medium">
            {message.text}
          </p>

          <div
            className={`flex items-center justify-between mt-2 pt-2 border-t-2 ${
              isOwn ? "border-violet-400" : "border-gray-200"
            }`}
          >
            <span
              className={`text-xs font-bold font-mono ${
                isOwn ? "text-violet-200" : "text-gray-500"
              }`}
            >
              {formatTime(message.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
