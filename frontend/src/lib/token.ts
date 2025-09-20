import type { User } from "@/types";

type TokenType = "accessToken" | "refreshToken" | "emailVerificationToken";

/**
 * Get a token from localStorage.
 * @param type - The token type to retrieve.
 * @returns The token string or null if not found.
 */
export const getToken = (type: TokenType): string | null => {
  return localStorage.getItem(type);
};

/**
 * Save a token to localStorage.
 * @param type - The token type to save.
 * @param value - The token value to store.
 */
export const saveToken = (type: TokenType, value: string): void => {
  localStorage.setItem(type, value);
};

/**
 * Remove a token from localStorage.
 * @param type - The token type to remove.
 */
export const removeToken = (type: TokenType): void => {
  localStorage.removeItem(type);
};

export const flushLocalTokens = () => {
  removeToken("accessToken");
  removeToken("refreshToken");
  removeToken("emailVerificationToken");
};

export const saveUser = (user: User) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getUser = () => {
  return localStorage.getItem("user");
};

export const removeUser = () => {
  localStorage.removeItem("user");
};
