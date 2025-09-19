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
