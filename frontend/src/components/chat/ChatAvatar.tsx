import { Users } from "lucide-react";
import { extractChatName } from "@/utils/formatter";
import type { BaseChat, User } from "@/types";
import { cn } from "@/utils/cn";

interface ChatAvatarProps {
  chat: BaseChat | null | undefined;
  user: User | null | undefined;
}

const ChatAvatar: React.FC<ChatAvatarProps> = ({ chat, user }) => {
  const type = chat?.type ?? "unknown";

  const chatLabel =
    extractChatName(chat ?? ({} as BaseChat), user)?.[0]?.toUpperCase() ?? "?";

  return (
    <div
      className={cn(
        "w-12 h-12 rounded-full border-2 flex items-center justify-center font-semibold text-white select-none",
        type === "group"
          ? "bg-green-500 border-green-700"
          : "bg-orange-500 border-orange-700"
      )}
    >
      {type === "group" ? <Users className="h-6 w-6" /> : chatLabel}
    </div>
  );
};

export default ChatAvatar;
