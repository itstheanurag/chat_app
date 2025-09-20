import api from "../axios";
import type { User } from "@/types/auth.type"; // or your User type
import { formatApiError, extractErrorMessage } from "@/utils/formatter";
import { toast } from "react-toastify";

export async function searchUsers(
  q: string
): Promise<{ success: boolean; data?: User[]; message?: string }> {
  try {
    const response = await api.get("/users/search", {
      params: { q }, // <-- corrected here
    });

    if (response.data?.success === false) {
      const formattedError = formatApiError(
        response.data.error,
        "Failed to fetch users."
      );
      toast.error(formattedError);
      return { success: false, message: formattedError };
    }

    return {
      success: true,
      data: response.data.data, // the array of users
      message: response.data.message || "Users fetched successfully",
    };
  } catch (err: unknown) {
    const formattedError = extractErrorMessage(
      err,
      "Unexpected error during user search."
    );
    toast.error(formattedError);
    return { success: false, message: formattedError };
  }
}
