import { Router } from "express";
import { createMessage, getMessages } from "handlers";
import { auth } from "middleware/auth";

export const messageRouter: Router = Router();

messageRouter.use(auth);

messageRouter.post("/", createMessage);
messageRouter.get("/:chatId", getMessages);

// export default messageRouter;
