export type ServerErrorResponse = {
  success: false;
  error: string | Record<string, string[]>;
  details?: unknown;
};

export interface LoginResult {
  success: boolean;
  message: string;
  data?: {
    id: string;
    email: string;
    name: string;
    isEmailVerified: boolean;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    verificationToken: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  isEmailVerified: boolean;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
