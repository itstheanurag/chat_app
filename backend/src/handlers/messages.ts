import { Request, Response } from "express";
import { Message } from "../models/message.model";
import { AuthenticatedRequest } from "middleware";
import { messageSchema } from "schemas";

export const createMessage = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const validatedData = messageSchema.safeParse(req.body);
    const message = new Message({ ...validatedData, senderId: req.user.id });
    await message.save();
    res.status(201).json(message);
  } catch (error: unknown) {
    res.status(400).json({ error: error.message });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId });
    res.json(messages);
  } catch (error: unknown) {
    res.status(500).json({ error: error.message });
  }
};
