/* eslint-disable @typescript-eslint/no-explicit-any */

import { formatApiError, extractErrorMessage } from "@/utils/formatter";
import type { LoginResult, RegisterResponse } from "@/types/auth.type";
import { flushLocalTokens, removeToken, saveToken } from "../storage";
import { errorToast, successToast } from "../toast";
import api from "../axios";
import type { ServerResponse } from "@/types";

export async function callLoginUserApi(
  email: string,
  password: string
): Promise<ServerResponse<LoginResult>> {
  try {
    const response = await api.post<ServerResponse<LoginResult>>(
      "/auth/login",
      { email, password }
    );

    const resData = response.data;

    console.log(resData)
    if (!resData.success) {
      return { success: false, error: resData.error };
    }

    const { data } = resData;
    if (data?.tokens?.accessToken)
      saveToken("accessToken", data?.tokens?.accessToken);
    if (data?.tokens?.refreshToken)
      saveToken("refreshToken", data?.tokens?.refreshToken);

    return {
      success: true,
      message: resData.message || "Login successful!",
      data: resData.data,
    };
  } catch (err: any) {
    const formattedError = extractErrorMessage(
      err,
      "Unexpected error during login."
    );

    return { success: false, error: formattedError };
  }
}

export async function callLogoutUserApi(): Promise<void> {
  try {
    const response = await api.post("/auth/logout");

    if (response.data?.success === false) {
      const formattedError = formatApiError(
        response.data.error,
        "Logout failed."
      );
      errorToast(formattedError);
    } else {
      successToast(response.data?.message || "Logged out successfully!");
    }
  } catch (err: any) {
    const formattedError = extractErrorMessage(
      err,
      "Unexpected error during logout."
    );
    errorToast(formattedError);
  } finally {
    flushLocalTokens();
  }
}

export async function callRegisterUserApi(
  email: string,
  password: string,
  name: string
): Promise<ServerResponse<RegisterResponse>> {
  try {
    const response = await api.post<ServerResponse<RegisterResponse>>(
      "/auth/register",
      { email, password, name }
    );

    const resData = response.data;

    if (!resData.success) {
      const formattedError = formatApiError(
        resData.error,
        "Registration failed."
      );
      errorToast(formattedError);
      return { success: false, error: formattedError };
    }

    const message =
      resData.message || "Registration triggered, please validate your email";
    successToast(message);

    const { data } = resData;
    saveToken("emailVerificationToken", data.verificationToken);

    return {
      success: true,
      message,
      data,
    };
  } catch (err: any) {
    const formattedError = extractErrorMessage(
      err,
      "Unexpected error during registration."
    );
    errorToast(formattedError);
    return { success: false, error: formattedError };
  }
}

export async function callVerifyUserEmailApi(
  token: string,
  otp: string
): Promise<ServerResponse<null>> {
  try {
    const response = await api.post<ServerResponse<null>>(
      "/auth/verify-email",
      {
        token,
        otp,
      }
    );

    const resData = response.data;

    if (!resData.success) {
      const formattedError = formatApiError(
        resData.error,
        "Email verification failed."
      );
      errorToast(formattedError);
      return { success: false, error: formattedError };
    }

    const message = resData.message || "Email verified successfully!";
    successToast(message);

    removeToken("emailVerificationToken");

    return {
      success: true,
      message,
      data: null,
    };
  } catch (err: any) {
    const formattedError = extractErrorMessage(
      err,
      "Unexpected error during email verification."
    );
    errorToast(formattedError);
    return { success: false, error: formattedError };
  }
}
