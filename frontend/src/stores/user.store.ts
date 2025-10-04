import { create } from "zustand";
import type { AuthState, User } from "@/types";
import { getToken, getUser, removeUser, saveUser } from "@/lib/storage";

import {
  callLoginUserApi,
  callLogoutUserApi,
  callRegisterUserApi,
  callVerifyUserEmailApi,
  errorToast,
  successToast,
} from "@/lib";

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<User | null>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string, otp: string) => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  initialize: () => {
    const token = getToken("accessToken");
    const storedUser = getUser();

    if (token && storedUser) {
      const user: User = JSON.parse(storedUser);
      set({ user, isAuthenticated: true, isLoading: false });
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const result = await callLoginUserApi(email, password);

      if (!result.success) {
        errorToast(result.error ?? "Login failed");
        set({ isLoading: false });
        return null;
      }

      const { id, email: userEmail, name, isEmailVerified } = result.data!;

      const user: User = {
        id,
        email: userEmail,
        name,
        isOnline: true,
        lastSeen: new Date(),
        isEmailVerified,
      };

      saveUser(user);

      set({ user, isAuthenticated: true, isLoading: false });
      successToast(result.message || "Logged in successfully");
      return user;
    } catch {
      errorToast("Unexpected error during login");
      set({ isLoading: false });
      return null;
    }
  },

  register: async (email, password, name) => {
    set({ isLoading: true });
    try {
      await callRegisterUserApi(email, password, name);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    callLogoutUserApi();
    removeUser();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  verifyEmail: async (token, otp) => {
    await callVerifyUserEmailApi(token, otp);
  },
}));
