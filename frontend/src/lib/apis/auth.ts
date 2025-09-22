/* eslint-disable @typescript-eslint/no-explicit-any */

import { toast } from "react-toastify";
import { formatApiError, extractErrorMessage } from "@/utils/formatter";
import type { LoginResult, RegisterResponse } from "@/types/auth.type";
import api from "../axios";
import { flushLocalTokens, removeToken, saveToken } from "../storage";

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    const response = await api.post("/auth/login", { email, password });

    if (response.data?.success === false) {
      const formattedError = formatApiError(
        response.data.error,
        "Logout failed."
      );
      return { success: false, message: formattedError };
    }

    const { message = "Login successful!", data } = response.data;
    const tokens = data?.tokens;
    if (tokens?.accessToken) saveToken("accessToken", tokens.accessToken);
    if (tokens?.refreshToken) saveToken("refreshToken", tokens.refreshToken);

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
    flushLocalTokens();
  }
}

export async function registerUser(
  email: string,
  password: string,
  name: string
): Promise<RegisterResponse> {
  try {
    const response = await api.post("/auth/register", {
      email,
      password,
      name,
    });

    if (response.data?.success === false) {
      const formattedError = formatApiError(
        response.data.error,
        "Registration failed."
      );
      toast.error(formattedError);
      return { success: false, message: formattedError };
    }

    const message =
      response.data?.message ||
      "Registration triggered, please validate your email";
    toast.success(message);

    const { data } = response.data;

    saveToken("emailVerificationToken", data.verificationToken);

    return {
      success: true,
      message,
      data: data,
    };
  } catch (err: any) {
    const formattedError = extractErrorMessage(
      err,
      "Unexpected error during registration."
    );
    toast.error(formattedError);
    return { success: false, message: formattedError };
  }
}

export async function verifyUserEmail(
  token: string,
  otp: string
): Promise<RegisterResponse> {
  try {
    const response = await api.post("/auth/verify-email", {
      token,
      otp,
    });

    if (response.data?.success === false) {
      const formattedError = formatApiError(
        response.data.error,
        "Registration failed."
      );
      toast.error(formattedError);
      return { success: false, message: formattedError };
    }

    const message =
      response.data?.message ||
      "Registration triggered, please validate your email";
    toast.success(message);

    const { data } = response.data;
    removeToken("emailVerificationToken");
    return {
      success: true,
      message,
      data: data,
    };
  } catch (err: any) {
    const formattedError = extractErrorMessage(
      err,
      "Unexpected error during registration."
    );
    toast.error(formattedError);
    return { success: false, message: formattedError };
  }
}
