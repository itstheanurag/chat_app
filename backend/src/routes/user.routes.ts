import { Router } from "express";
import { login, register } from "handlers/user";
const router: Router = Router();

router.post("/register", register);
router.post("/login", login);

export default router;
