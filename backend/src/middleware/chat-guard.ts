// middleware/chatGuard.ts
import { type Request, type Response, type NextFunction } from "express";
import { Chat } from "models"; // adjust to your chat model path
import { sendError } from "lib/response";
import { AuthenticatedRequest } from "./auth";

/**
 * Ensures:
 * - User is part of the chat.
 * - If chat is a group, only the admin can update/delete.
 */
export const chatGuard = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const chatId = req.params.chatId || req.query.chatId || req.body.chatId;

    if (!chatId) {
      return sendError(
        res,
        404,
        "Chat Id is required field for this operation"
      );
    }

    const userId = req.user?.id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return sendError(res, 404, "Chat not found");
    }

    if (chat.type === "direct") {
      const isParticipant = chat.participants.some(
        (p) => p.userId.toString() === userId
      );

      if (!isParticipant) {
        return sendError(res, 403, "You are not part of this chat");
      }
    }

    if (chat.type === "group") {
      const isAdmin = chat.admins?.some(
        (adminId) => adminId.toString() === userId
      );

      if (!isAdmin) {
        return sendError(
          res,
          403,
          "Only a group admin can perform this action"
        );
      }
    }

    (req as any).chat = chat;

    next();
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Failed to authorize chat action");
  }
};
