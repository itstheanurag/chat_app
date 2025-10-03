import { type Response, type NextFunction } from "express";
import { Chat } from "models";
import { sendError } from "lib/response";
import { AuthenticatedRequest } from "./auth";
import mongoose from "mongoose";

interface ChatGuardOptions {
  requireAdmin?: boolean;
}

export const chatGuard = (options: ChatGuardOptions = {}) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const chatId =
        req.params?.chatId || req.query?.chatId || req.body?.chatId;
      if (!chatId || !mongoose.Types.ObjectId.isValid(chatId)) {
        return sendError(res, 400, "Invalid chat ID format");
      }

      const userId = req.user?.id;
      const chat = await Chat.findById(chatId)
        .populate("participants.userId", "_id name email")
        .exec();

      if (!chat) return sendError(res, 404, "Chat not found");
      const isParticipant = chat.participants.some(
        (p) => p.userId?._id?.toString() === userId
      );

      if (!isParticipant) {
        return sendError(res, 403, "You are not part of this chat");
      }

      // If admin actions are required, enforce admin check
      if (options.requireAdmin && chat.type === "group") {
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
};
