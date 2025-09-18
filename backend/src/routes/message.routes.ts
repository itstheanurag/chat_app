import { Router } from "express";
import { createMessage, getMessages } from "handlers";
import { auth } from "middleware/auth";
const router: Router = Router();

router.use(auth);

router.post("/", createMessage);
router.get("/:chatId", getMessages);

export default router;
