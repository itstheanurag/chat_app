import { Router } from "express";
import { auth } from "middleware/auth";

const router: Router = Router();

router.use(auth);

// router.post("/", createChat);
// router.get("/", getChats);

export default router;
