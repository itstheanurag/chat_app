import { Router } from "express";
import {
  findChatById,
  archiveChat,
  addUsersToGroupChat,
  removeUsersFromGroupChat,
  deleteChat,
  listUserChats,
  createChat,
} from "handlers/chat";
import { auth } from "middleware/auth";
import { chatGuard } from "middleware/chat-guard";

export const chatRouter: Router = Router();

chatRouter.use(auth);

chatRouter.post("", createChat);
chatRouter.get("", listUserChats);

chatRouter.get("/:chatId", chatGuard(), findChatById);

chatRouter.patch(
  "/:chatId/archive",
  chatGuard({ requireAdmin: true }),
  archiveChat
);
chatRouter.patch(
  "/:chatId/unarchive",
  chatGuard({ requireAdmin: true }),
  archiveChat
);

chatRouter.patch(
  "/:chatId/add/participant",
  chatGuard({ requireAdmin: true }),
  addUsersToGroupChat
);
chatRouter.patch(
  "/:chatId/remove/participant",
  chatGuard({ requireAdmin: true }),
  removeUsersFromGroupChat
);

chatRouter.delete("/:chatId", chatGuard({ requireAdmin: true }), deleteChat);
