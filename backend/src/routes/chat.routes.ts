import { Router } from "express";
import {
  addUsersToGroupChat,
  archiveChat,
  createChat,
  deleteChat,
  findChatById,
  listUserChats,
  listUsersArchivedChats,
  removeUsersFromGroupChat,
} from "handlers/chat";
import { auth } from "middleware/auth";
import { chatGuard } from "middleware/chat-guard";

export const chatRouter: Router = Router();

chatRouter.use(auth);

chatRouter.post("/", createChat);
chatRouter.get("/", listUserChats);
chatRouter.get("/archived", listUsersArchivedChats);

chatRouter.get("/:chatId", chatGuard, findChatById);
chatRouter.patch("/:chatId/archive", chatGuard, archiveChat);
chatRouter.patch("/:chatId/unarchive", chatGuard, archiveChat);
chatRouter.patch("/:chatId/add/participant", chatGuard, addUsersToGroupChat);
chatRouter.patch(
  "/:chatId/remove/participant",
  chatGuard,
  removeUsersFromGroupChat
);
chatRouter.delete("/:chatId", chatGuard, deleteChat);

// export default chatRouter;
