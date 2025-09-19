/* eslint-disable @typescript-eslint/no-explicit-any */

import { toast } from "react-toastify";
import api from "../axios";
import { formatApiError, extractErrorMessage } from "../../utils/formatter";

export type ServerErrorResponse = {
  success: false;
  error: string | Record<string, string[]>;
  details?: unknown;
};

export interface LoginResult {
  success: boolean;
  message: string;
  data?: {
    id: string;
    email: string;
    name: string;
    tokens?: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    const response = await api.post("/auth/login", { email, password });

    // If backend uses { success: false } even for 200 responses:
    if (response.data?.success === false) {
      const formattedError = formatApiError(
        response.data.error,
        "Logout failed."
      );
      return { success: false, message: formattedError };
    }

    const { message = "Login successful!", data } = response.data;

    const tokens = data?.tokens;
    if (tokens?.accessToken)
      localStorage.setItem("accessToken", tokens.accessToken);
    if (tokens?.refreshToken)
      localStorage.setItem("refreshToken", tokens.refreshToken);

    return { success: true, message, data };
  } catch (err: any) {
    const formattedError = extractErrorMessage(
      err,
      "Unexpected error during logout."
    );

    return { success: false, message: formattedError };
  }
}

export async function logoutUser(): Promise<void> {
  try {
    const response = await api.post("/auth/logout");

    if (response.data?.success === false) {
      const formattedError = formatApiError(
        response.data.error,
        "Logout failed."
      );
      toast.error(formattedError);
    } else {
      toast.success(response.data?.message || "Logged out successfully!");
    }
  } catch (err: any) {
    const formattedError = extractErrorMessage(
      err,
      "Unexpected error during logout."
    );
    toast.error(formattedError);
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
}
