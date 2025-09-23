import type { BaseChat, User } from "@/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function formatApiError(
  errorField: unknown,
  defaultMsg: string
): string {
  if (typeof errorField === "string") {
    return errorField;
  } else if (errorField && typeof errorField === "object") {
    return Object.entries(errorField as Record<string, string[]>)
      .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
      .join(" | ");
  }
  return defaultMsg;
}

export function extractErrorMessage(err: any, defaultMsg: string): string {
  const serverError = err?.response?.data?.error;
  if (serverError) return formatApiError(serverError, defaultMsg);
  if (err?.message) return err.message;
  return defaultMsg;
}
export const extractChatName = (chat?: BaseChat | null, user?: User | null) => {
  // console.log("Extracting chat name for chat:", chat, "and user:", user);
  if (!chat) return "Chat";

  if (chat.type === "group") return chat.name || "Group Chat";

  if (chat.type === "direct" && chat.participants?.length > 0) {
    const otherParticipant = chat.participants.find(
      (p) => p.userId?._id?.toString() !== user?.id
    );

    // console.log("Other Participant:", otherParticipant);

    return otherParticipant
      ? otherParticipant.userId?.name || "Unknown User"
      : "Direct Chat";
  }

  return "Chat";
};
