/* eslint-disable @typescript-eslint/no-explicit-any */
import type { BaseChat, FindChatByIdResult } from "@/types/chat";
import { formatApiError, extractErrorMessage } from "@/utils/formatter";
import api from "../axios";
import { errorToast, successToast } from "../toast";
import type { ServerResponse } from "@/types";

/**
 * Fetch user chats from the backend.
 */
export async function callGetUserChatsApi(): Promise<
  ServerResponse<BaseChat[]>
> {
  try {
    const response = await api.get<ServerResponse<BaseChat[]>>("/chats");
    const resData = response.data;

    if (!resData.success) {
      const formattedError = formatApiError(
        resData.error,
        "Failed to retrieve chats."
      );

      errorToast(formattedError);
      return { success: false, error: formattedError };
    }

    return {
      success: true,
      message: resData.message || "Chats retrieved successfully.",
      data: resData.data,
    };
  } catch (err: any) {
    const formattedError = extractErrorMessage(
      err,
      "Unexpected error while retrieving chats."
    );
    return { success: false, error: formattedError };
  }
}

/**
 * Create a direct chat between the current user and another user.
 * @param participantId - The userId of the participant to include in the direct chat.
 * @returns A result object containing the newly created chat or an error message.
 */
export async function callCreateDirectChatApi(
  participantId: string
): Promise<ServerResponse<BaseChat>> {
  try {
    const response = await api.post<ServerResponse<BaseChat>>("/chats", {
      type: "direct",
      participants: [{ userId: participantId }],
    });

    const resData = response.data;

    if (!resData.success) {
      const formattedError = formatApiError(
        resData.error,
        "Failed to create direct chat."
      );

      errorToast(formattedError);
      return { success: false, error: formattedError };
    }

    successToast(resData.message || "Direct chat created.");
    return {
      success: true,
      message: resData.message,
      data: resData.data,
    };
  } catch (err: any) {
    const formattedError = extractErrorMessage(
      err,
      "Unexpected error while creating direct chat."
    );
    return { success: false, error: formattedError };
  }
}

/**
 * Create a group chat with multiple participants.
 * @param participantIds - The userIds of the participants to include in the group chat.
 * @param name - The name of the group chat.
 * @returns A result object containing the newly created chat or an error message.
 */
export async function callCreateGroupChatApi(
  participantIds: string[],
  name?: string
): Promise<ServerResponse<BaseChat>> {
  try {
    const response = await api.post<ServerResponse<BaseChat>>("/chats", {
      type: "group",
      participants: participantIds.map((id) => ({ userId: id })),
      name,
    });

    const resData = response.data;

    if (!resData.success) {
      const formattedError = formatApiError(
        resData.error,
        "Failed to create group chat."
      );
      errorToast(formattedError);
      return { success: false, error: formattedError };
    }

    successToast(resData.message || "Group chat created successfully.");
    return {
      success: true,
      message: resData.message,
      data: resData.data,
    };
  } catch (err: any) {
    const formattedError = extractErrorMessage(
      err,
      "Unexpected error while creating group chat."
    );
    errorToast(formattedError);
    return { success: false, error: formattedError };
  }
}

/**
 * Fetch a chat by its ID.
 * @param chatId - The ID of the chat to fetch.
 * @returns A result object containing the chat or an error message.
 */
export async function callFindChatByIdApi(
  chatId: string
): Promise<ServerResponse<FindChatByIdResult>> {
  try {
    const response = await api.get<ServerResponse<FindChatByIdResult>>(
      `/chats/${chatId}`
    );
    const resData = response.data;

    if (!resData.success) {
      const formattedError = formatApiError(
        resData.error,
        "Failed to fetch chat details."
      );
      errorToast(formattedError);
      return { success: false, error: formattedError };
    }

    return {
      success: true,
      message: resData.message || "Chat fetched successfully.",
      data: resData.data,
    };
  } catch (err: any) {
    const formattedError = extractErrorMessage(
      err,
      "Unexpected error while fetching chat details."
    );
    errorToast(formattedError);
    return { success: false, error: formattedError };
  }
}
