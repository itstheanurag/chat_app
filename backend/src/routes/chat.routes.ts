import { Router } from "express";
import {
  addUsersToGroupChat,
  archiveChat,
  createChat,
  deleteChat,
  listUserChats,
  removeUsersFromGroupChat,
} from "handlers/chat";
import { auth } from "middleware/auth";
import { chatGuard } from "middleware/chat-guard";

const router: Router = Router();

router.use(auth);

router.post("/chat", createChat);
router.get("/chat", listUserChats);
router.get("/chat/archived");

router.use(chatGuard);

router.patch("/chat/:chatId/archive", archiveChat);
router.patch("/chat/:chatId/unarchive", archiveChat);
router.patch("/chat/:chatId/add/participant", addUsersToGroupChat);
router.patch("/chat/:chatId/remove/participant", removeUsersFromGroupChat);
router.delete("/chat/:chatId", deleteChat);

export default router;
