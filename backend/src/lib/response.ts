import type { Response } from "express";
import z, { ZodError } from "zod";

interface SuccessResponse<T> {
  success: true;
  message?: string;
  data?: T;
}

interface ErrorResponse {
  success: false;
  error: string | Record<string, string[]>;
  details?: unknown;
}
/**
 * Send a success response.
 */
export function sendResponse<T>(
  res: Response,
  statusCode: number,
  data?: T,
  message?: string
): Response<SuccessResponse<T>> {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

/**
 * Send an error response.
 */
export function sendError(
  res: Response,
  statusCode: number,
  error: unknown,
  details?: unknown
): Response<ErrorResponse> {
  // Handle Zod errors
  if (error instanceof ZodError) {
    const fieldErrors = z.flattenError(error).fieldErrors;

    return res.status(statusCode).json({
      success: false,
      error: fieldErrors, // e.g., { otp: ["Invalid input"], token: ["Required"] }
      details,
    });
  }

  const errorMessage =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Unknown error occurred";

  return res.status(statusCode).json({
    success: false,
    error: errorMessage,
    details,
  });
}
