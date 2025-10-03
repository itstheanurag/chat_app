import api from "../axios";
import type { User } from "@/types/auth.type";
import { formatApiError, extractErrorMessage } from "@/utils/formatter";
import { errorToast } from "../toast";

export async function callSearchUsersApi(
  q: string
): Promise<{ success: boolean; data?: User[]; message?: string }> {
  try {
    const response = await api.get("/user/search", {
      params: { q },
    });

    if (response.data?.success === false) {
      const formattedError = formatApiError(
        response.data.error,
        "Failed to fetch users."
      );
      errorToast(formattedError);
      return { success: false, message: formattedError };
    }

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Users fetched successfully",
    };
  } catch (err: unknown) {
    const formattedError = extractErrorMessage(
      err,
      "Unexpected error during user search."
    );

    errorToast(formattedError);
    return { success: false, message: formattedError };
  }
}
