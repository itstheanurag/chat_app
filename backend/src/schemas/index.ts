import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;
export const objectIdSchema = z
  .string()
  .regex(objectIdRegex, "Invalid ObjectId");

export const registerSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.email("Please Provide a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
  email: z.email("Please Provide a valid email"),
  password: z.string().min(6),
});

export const verifyEmailSchema = z.object({
  otp: z.string(),
  token: z.string(),
});

export const messageSchema = z.object({
  chatId: objectIdSchema,
  senderId: objectIdSchema,
  text: z.string().trim().optional(),
  attachments: z.array(z.url("Invalid attachment URL")).optional(),
  status: z.enum(["sent", "delivered", "read"]).default("sent"),
  readAt: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  ),
});

export const chatSchema = z.object({
  type: z.enum(["direct", "group"]),
  name: z.string().trim().optional(),
  avatar: z.url().optional(),
  participants: z
    .array(
      z.object({
        userId: objectIdSchema,
        joinedAt: z.preprocess(
          (val) => (val ? new Date(val as string) : new Date()),
          z.date()
        ),
      })
    )
    .min(1, "A chat must have at least one participant"),
  lastMessage: z
    .object({
      text: z.string(),
      senderId: objectIdSchema,
      createdAt: z.preprocess(
        (val) => (val ? new Date(val as string) : new Date()),
        z.date()
      ),
    })
    .optional(),
  isArchived: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

export const modifyParticipantsSchema = z.object({
  userIds: z.array(z.string()).nonempty("At least one user ID is required"),
});

export type MessageInput = z.infer<typeof messageSchema>;
export type ChatInput = z.infer<typeof chatSchema>;

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type EmailVerification = z.infer<typeof verifyEmailSchema>;
