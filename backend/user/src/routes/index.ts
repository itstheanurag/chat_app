import express from 'express';

const userRouter = express.Router();

userRouter.post('register', register);
userRouter.post('login', login);
userRouter.post('validate-otp', verifyEmail)

