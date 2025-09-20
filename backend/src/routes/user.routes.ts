import { Router } from "express";
import { searchUser } from "handlers";

import { auth } from "middleware/auth";

export const userRouter: Router = Router();

userRouter.get("/search", auth, searchUser);
