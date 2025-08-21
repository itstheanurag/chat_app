import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});


export const verifyEmailSchema = z.object({
  otp: z.string(),
  token: z.string()
});


export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type EmailVerification = z.infer<typeof verifyEmailSchema>;
