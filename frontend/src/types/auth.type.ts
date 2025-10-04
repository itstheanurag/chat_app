export interface LoginResult {
  id: string;
  email: string;
  name: string;
  isEmailVerified: boolean;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

  export interface RegisterResponse {
    verificationToken: string;
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
