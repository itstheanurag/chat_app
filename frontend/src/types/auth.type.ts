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
    tokens?: {
      accessToken: string;
      refreshToken: string;
    };
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
  name: string;
  email: string;
}
