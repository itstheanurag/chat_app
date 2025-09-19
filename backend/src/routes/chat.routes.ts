import { Router } from "express";
import {
  addUsersToGroupChat,
  archiveChat,
  createChat,
  deleteChat,
  listUserChats,
  listUsersArchivedChats,
  removeUsersFromGroupChat,
} from "handlers/chat";
import { auth } from "middleware/auth";
import { chatGuard } from "middleware/chat-guard";

const chatRouter: Router = Router();

chatRouter.use(auth);

chatRouter.post("/", createChat);
chatRouter.get("/", listUserChats);
chatRouter.get("/archived", listUsersArchivedChats);

chatRouter.use(chatGuard);

chatRouter.patch("/:chatId/archive", archiveChat);
chatRouter.patch("/:chatId/unarchive", archiveChat);
chatRouter.patch("/:chatId/add/participant", addUsersToGroupChat);
chatRouter.patch("/:chatId/remove/participant", removeUsersFromGroupChat);
chatRouter.delete("/:chatId", deleteChat);

export default chatRouter;
