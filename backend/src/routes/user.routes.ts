import { Router } from "express";
import {
  login,
  register,
  verifyEmail,
  userLogInCheck,
  searchUser,
} from "handlers";
import { auth } from "middleware/auth";
const router: Router = Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);

router.use(auth);
router.get("/me", userLogInCheck);
router.get("/search", searchUser);

export default router;
