import { Router } from "express";
import {
  login,
  register,
  verifyEmail,
  userLogInCheck,
  searchUser,
  logout,
} from "handlers";

import { auth, refreshTokenGuard } from "middleware/auth";

export const authRouter: Router = Router();

authRouter.post("/register", register);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/login", login);

authRouter.get("/me", auth, userLogInCheck);
authRouter.get("/search", auth, searchUser);
authRouter.post("/logout", auth, logout);

authRouter.post("/refresh", refreshTokenGuard, refreshTokenGuard);

// export default authRouter;
