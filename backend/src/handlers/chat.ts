import type { Response } from "express";
import jwt from "jsonwebtoken";
import { randomInt } from "crypto";
import { Chat, User } from "models";
import { redisClient } from "lib/server";
import { chatSchema, modifyParticipantsSchema } from "schemas";
import { AuthenticatedRequest } from "middleware/auth";
import { sendResponse, sendError } from "lib/response";
import { Types } from "mongoose";

export const createChat = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      return sendError(res, 403, null, "User id is missing");
    }

    const parsedResult = chatSchema.safeParse(req.body);

    if (!parsedResult.success) {
      return sendError(res, 400, parsedResult.error.format());
    }

    const parsedData = parsedResult.data;
    const { type, participants, name, avatar, lastMessage } = parsedData;

    const allParticipants = [
      ...participants.map((p) => p.userId.toString()),
      currentUserId?.toString(),
    ];

    if (type === "direct") {
      if (allParticipants.length !== 2) {
        return sendError(
          res,
          400,
          "Direct chats can only have exactly two participants."
        );
      }

      const existingChat = await Chat.findOne({
        type: "direct",
        "participants.userId": { $all: allParticipants },
        $expr: { $eq: [{ $size: "$participants" }, 2] },
      });

      if (existingChat) {
        return sendResponse(
          res,
          200,
          existingChat,
          "Direct chat already exists"
        );
      }
    }

    const newChat = new Chat({
      type,
      name: type === "group" ? name : undefined,
      avatar,
      participants: [
        ...participants.filter(
          (p) => p.userId.toString() !== currentUserId?.toString()
        ),
        { userId: currentUserId, joinedAt: new Date() },
      ],
      lastMessage,
      isArchived: false,
      isDeleted: false,
    });

    if (type === "group") {
      newChat.admins = [new Types.ObjectId(currentUserId)];
    }

    await newChat.save();

    return sendResponse(res, 201, newChat, "Chat created successfully");
  } catch (err: any) {
    console.error(err);
    return sendError(res, 500, err.message || "Failed to create chat");
  }
};

export const listUserChats = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;

    const userChats = await Chat.find({
      isArchived: { $ne: true },
      $or: [{ "participants.userId": userId }, { admins: userId }],
    }).sort({ updatedAt: -1 });

    return sendResponse(res, 200, userChats, "Chats retrieved successfully");
  } catch (err: any) {
    console.error(err);
    return sendError(res, 400, err.message || "Failed to fetch user chats");
  }
};

export const listUsersArchivedChats = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;

    const userChats = await Chat.find({
      isArchived: true,
      $or: [{ "participants.userId": userId }, { admins: userId }],
    }).sort({ updatedAt: -1 });

    return sendResponse(res, 200, userChats, "Chats retrieved successfully");
  } catch (err: any) {
    console.error(err);
    return sendError(res, 400, err.message || "Failed to fetch user chats");
  }
};

export const archiveChat = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const chat = req.chat;

    if (!chat) {
      return sendError(res, 404, "Chat not found");
    }

    if (chat.isArchived) {
      return sendError(res, 400, "Chat is already archived");
    }

    chat.isArchived = true;
    await chat.save();

    return sendResponse(res, 200, chat, "Chat archived successfully");
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Failed to archive chat");
  }
};

export const unarchiveChat = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const chat = req.chat;

    if (!chat) {
      return sendError(res, 404, "Chat not found");
    }

    if (!chat.isArchived) {
      return sendError(res, 400, "Chat is not archived");
    }

    chat.isArchived = false;
    await chat.save();

    return sendResponse(res, 200, chat, "Chat unarchived successfully");
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Failed to unarchive chat");
  }
};

export const deleteChat = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const { user } = req;
    return sendResponse(res, 200, user, "user is loggedIn");
  } catch (err) {
    return sendError(res, 400, err);
  }
};

export const addUsersToGroupChat = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const chat = req.chat;

    if (!chat) {
      return sendError(res, 400, "This action is only allowed for group chats");
    }

    const parsed = modifyParticipantsSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, 400, parsed.error.format());
    }

    const { userIds } = parsed.data;

    const currentUserId = req.user?.id;
    if (
      !chat.admins?.some((a: Types.ObjectId) => a.toString() === currentUserId)
    ) {
      return sendError(res, 403, "Only admins can add users");
    }

    // Filter out users already in the chat
    const existingIds = chat.participants.map(
      (p: { userId: Types.ObjectId; joinedAt: Date }) => p.userId.toString()
    );
    const newUsers = userIds.filter((id) => !existingIds.includes(id));

    if (newUsers.length === 0) {
      return sendError(res, 400, "All provided users are already in the chat");
    }

    // Add new participants
    newUsers.forEach((id) =>
      chat.participants.push({
        userId: new Types.ObjectId(id),
        joinedAt: new Date(),
      })
    );

    await chat.save();
    return sendResponse(res, 200, chat, "Users added to the group chat");
  } catch (err: any) {
    console.error(err);
    return sendError(res, 500, err.message || "Failed to add users to chat");
  }
};

export const removeUsersFromGroupChat = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const chat = req.chat;

    if (!chat) {
      return sendError(res, 400, "This action is only allowed for group chats");
    }

    const parsed = modifyParticipantsSchema.safeParse(req.body);
    if (!parsed.success) {
      return sendError(res, 400, parsed.error.format());
    }

    const { userIds } = parsed.data;

    const currentUserId = req.user?.id;
    if (
      !chat.admins?.some((a: Types.ObjectId) => a.toString() === currentUserId)
    ) {
      return sendError(res, 403, "Only admins can remove users");
    }

    const beforeCount = chat.participants.length;

    // Remove matching participants
    chat.participants = chat.participants.filter(
      (p: { userId: Types.ObjectId; joinedAt: Date }) =>
        !userIds.includes(p.userId.toString())
    );

    if (chat.participants.length === beforeCount) {
      return sendError(res, 400, "None of the provided users were in the chat");
    }

    await chat.save();
    return sendResponse(res, 200, chat, "Users removed from the group chat");
  } catch (err: any) {
    console.error(err);
    return sendError(
      res,
      500,
      err.message || "Failed to remove users from chat"
    );
  }
};
