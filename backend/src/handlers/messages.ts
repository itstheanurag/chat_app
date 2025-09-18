import { Request, Response } from "express";
import { Message } from "../models/message.model";
import { messageSchema } from "schemas";
import { sendResponse, sendError } from "../lib/response";
import { AuthenticatedRequest } from "middleware/auth";

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
  sendResponse(res, 201, message, "Message created successfully");
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId });
    sendResponse(res, 200, messages, "Messages fetched successfully");
  } catch (err: unknown) {
    sendError(res, 500, err);
  }
};
