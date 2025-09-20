import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { AuthState } from "@/types";
import { loginUser, logoutUser, registerUser } from "@/lib/apis/auth";
import { toast } from "react-toastify";

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
    isEmailVerified: false,
  });

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    const result = await loginUser(email, password);

    if (!result.success) {
      toast.error(result.message);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    const { id, email: userEmail, name, isEmailVerified } = result.data!;

    setAuthState({
      user: {
        id,
        email: userEmail,
        username: name,
        isOnline: true,
        lastSeen: new Date(),
      },
      isAuthenticated: true,
      isLoading: false,
      isEmailVerified: isEmailVerified,
    });

    toast.success(result.message);
  };

  const register = async (
    email: string,
    password: string,
    username: string
  ) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    const result = await registerUser(email, password, username);

    if (result.success) {
      // Do NOT set user or isAuthenticated yet
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isEmailVerified: false,
      });
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isEmailVerified: false,
      });
    }
  };

  const logout = () => {
    logoutUser();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isEmailVerified: false,
    });
  };

  const verifyEmail = async (token: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

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
