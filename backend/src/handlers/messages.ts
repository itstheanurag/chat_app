import { Request, Response } from "express";
import { Message } from "../models/message.model";
import { messageSchema } from "schemas";
import { sendResponse, sendError } from "../lib/response";
import { AuthenticatedRequest } from "middleware/auth";

import { AuthenticatedSocket } from "lib/socket/socket";

export function handleChatMessage(socket: AuthenticatedSocket, message: any) {
  // console.log(`📨 Message from ${socket.user?.name || "Unknown"}:`, message);

  const chatMessage = {
    user: socket.user?.name || "Anonymous",
    message: message.text || message,
    timestamp: new Date().toISOString(),
  };

  socket.broadcast.emit("chat_message", chatMessage);
}

export const createMessage = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { body, user } = req;

  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) {
    sendError(
      res,
      400,
      parsed.error.issues.map((i) => i.message)
    );
    return;
  }

  const message = new Message({ ...parsed.data, senderId: user!.id });
  await message.save();
  await message.populate("senderId", "name email");
  sendResponse(res, 201, message, "Message created successfully");
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const messages = await Message.find({ chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("senderId", "name email");

    const sortedMessages = messages.reverse();

    sendResponse(res, 200, sortedMessages, "Messages fetched successfully");
  } catch (err: unknown) {
    sendError(res, 500, err);
  }
};
