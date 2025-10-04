import api from "../axios";
import type { User } from "@/types/auth.type";
import { formatApiError, extractErrorMessage } from "@/utils/formatter";
import { errorToast } from "../toast";
import type { ServerResponse } from "@/types";

export async function callSearchUsersApi(
  q: string
): Promise<ServerResponse<User[]>> {
  try {
    const response = await api.get<ServerResponse<User[]>>("/user/search", {
      params: { q },
    });

    const resData = response.data;

    if (!resData.success) {
      const formattedError = formatApiError(
        resData.error,
        "Failed to fetch users."
      );
      errorToast(formattedError);
      return { success: false, error: formattedError };
    }

    return {
      success: true,
      message: resData.message || "Users fetched successfully.",
      data: resData.data,
    };
  } catch (err: unknown) {
    const formattedError = extractErrorMessage(
      err,
      "Unexpected error during user search."
    );
    errorToast(formattedError);
    return { success: false, error: formattedError };
  }
}
