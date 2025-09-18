import { Router } from "express";
import { createMessage, getMessages } from "handlers/messages";
import auth from "middleware";

const router: Router = Router();

router.use(auth);

router.post("/", createMessage);
router.get("/:chatId", getMessages);

export default router;
