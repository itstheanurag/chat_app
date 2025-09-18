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

const router: Router = Router();

router.use(auth);

router.post("/", createChat);
router.get("/", listUserChats);
router.get("/archived", listUsersArchivedChats);

router.use(chatGuard);

router.patch("/:chatId/archive", archiveChat);
router.patch("/:chatId/unarchive", archiveChat);
router.patch("/:chatId/add/participant", addUsersToGroupChat);
router.patch("/:chatId/remove/participant", removeUsersFromGroupChat);
router.delete("/:chatId", deleteChat);

export default router;
