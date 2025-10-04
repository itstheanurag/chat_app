export * from "./auth.type";
export * from "./message.type";
export * from "./chat";

export interface ServerResponse<T> {
  success: boolean;
  message?: string;
  error?: boolean;
  data?: T;
}
