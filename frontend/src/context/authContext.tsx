import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { AuthState, User } from "../types";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    // Simulate API call
    setTimeout(() => {
      const mockUser: User = {
        id: "1",
        email,
        username: email.split("@")[0],
        isOnline: true,
        lastSeen: new Date(),
      };

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
    }, 1000);
  };

  const register = async (
    email: string,
    password: string,
    username: string
  ) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    // Simulate API call
    setTimeout(() => {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }, 1000);
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const verifyEmail = async (token: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    // Simulate API call
    setTimeout(() => {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }, 1000);
  };

  return (
    <AuthContext.Provider
      value={{ ...authState, login, register, logout, verifyEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
};
