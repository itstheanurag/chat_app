/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  BaseChat,
  CreateDirectChatResult,
  GetUserChatsResult,
} from "@/types/chat";
import { formatApiError, extractErrorMessage } from "@/utils/formatter";
import api from "../axios";
import { toast } from "react-toastify";

/**
 * Fetch user chats from the backend.
 */
export async function getUserChats(): Promise<GetUserChatsResult> {
  try {
    const response = await api.get("/chats");

    // Check for explicit failure in response
    if (!response.data?.success) {
      const formattedError = formatApiError(
        response.data?.error,
        "Failed to retrieve chats."
      );
      return { success: false, message: formattedError };
    }

    const { message, data } = response.data as {
      success: boolean;
      message: string;
      data: BaseChat[];
    };

    return { success: true, message, data };
  } catch (err: any) {
    const formattedError = extractErrorMessage(
      err,
      "Unexpected error while retrieving chats."
    );
    return { success: false, message: formattedError };
  }
}

/**
 * Create a direct chat between the current user and another user.
 * @param participantId - The userId of the participant to include in the direct chat.
 * @returns A result object containing the newly created chat or an error message.
 */
export async function createDirectChat(
  participantId: string,
  name: string
): Promise<CreateDirectChatResult> {
  try {
    const response = await api.post("/chats", {
      type: "direct",
      participants: [{ userId: participantId }],
      name,
    });

    if (!response.data?.success) {
      const formattedError = formatApiError(
        response.data?.error,
        "Failed to create direct chat."
      );
      toast.error(formattedError);
      return { success: false, message: formattedError };
    }

    const { message, data } = response.data as {
      success: boolean;
      message: string;
      data: BaseChat;
    };

    toast.success(message);
    return { success: true, message, data };
  } catch (err: any) {
    const formattedError = extractErrorMessage(
      err,
      "Unexpected error while creating direct chat."
    );
    return { success: false, message: formattedError };
  }
}

/**
 * Create a direct chat between the current user and another user.
 * @param participantId - The userId of the participant to include in the direct chat.
 * @returns A result object containing the newly created chat or an error message.
 */
export async function createGroupChat(
  participantIds: string[],
  name: string
): Promise<CreateDirectChatResult> {
  try {
    const response = await api.post("/chats", {
      type: "group",
      participants: participantIds.map((id) => ({ userId: id })),
      name,
    });

    if (!response.data?.success) {
      const formattedError = formatApiError(
        response.data?.error,
        "Failed to create group chat."
      );
      toast.error(formattedError);
      return { success: false, message: formattedError };
    }

    const { message, data } = response.data as {
      success: boolean;
      message: string;
      data: BaseChat;
    };

    toast.success(message);

    return { success: true, message, data };
  } catch (err: any) {
    const formattedError = extractErrorMessage(
      err,
      "Unexpected error while creating group chat."
    );
    return { success: false, message: formattedError };
  }
}

/**
 * Create a direct chat between the current user and another user.
 * @param participantId - The userId of the participant to include in the direct chat.
 * @returns A result object containing the newly created chat or an error message.
 */
export async function findChatById(
  id: string
): Promise<CreateDirectChatResult> {
  try {
    const response = await api.post("/chats", {
      type: "group",
      participants: participantIds.map((id) => ({ userId: id })),
      name,
    });

    if (!response.data?.success) {
      const formattedError = formatApiError(
        response.data?.error,
        "Failed to create group chat."
      );
      toast.error(formattedError);
      return { success: false, message: formattedError };
    }

    const { message, data } = response.data as {
      success: boolean;
      message: string;
      data: BaseChat;
    };

    toast.success(message);

    return { success: true, message, data };
  } catch (err: any) {
    const formattedError = extractErrorMessage(
      err,
      "Unexpected error while creating group chat."
    );
    return { success: false, message: formattedError };
  }
}
