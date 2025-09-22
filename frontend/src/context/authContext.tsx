import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AuthState, User } from "@/types";
import {
  loginUser,
  logoutUser,
  registerUser,
  verifyUserEmail,
} from "@/lib/apis/auth";
import { toast } from "react-toastify";
import { getToken, getUser, removeUser, saveUser } from "@/lib/storage";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string, otp: string) => Promise<void>;
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

  useEffect(() => {
    const token = getToken("accessToken");
    const storedUser = getUser();

    if (token && storedUser) {
      const user: User = JSON.parse(storedUser);
      setAuthState({ user, isAuthenticated: true, isLoading: false });
    } else {
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
    }
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const result = await loginUser(email, password);

      if (!result.success) {
        toast.error(result.message || "Login failed");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return null;
      }

      const { id, email: userEmail, name, isEmailVerified } = result.data!;

      const user = {
        id,
        email: userEmail,
        name: name,
        isOnline: true,
        lastSeen: new Date(),
        isEmailVerified,
      };

      saveUser(user);

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      toast.success(result.message || "Logged in successfully");
      return result.data;
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error during login");
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return null;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    await registerUser(email, password, name);
  };

  const logout = () => {
    logoutUser();
    removeUser();

    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const verifyEmail = async (token: string, otp: string) => {
    await verifyUserEmail(token, otp);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        verifyEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
