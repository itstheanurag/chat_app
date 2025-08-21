import express, { Router } from 'express';
import { login, verifyEmail, register } from '../handlers/user.js';

const userRouter: Router = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/validate-otp', verifyEmail);

export default userRouter;
