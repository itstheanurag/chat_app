import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { randomInt } from "crypto";
import { User } from "models";
import { redisClient } from "lib/server";
import { registerSchema, loginSchema, verifyEmailSchema } from "schemas";
import { sendResponse, sendError } from "lib/response";
import { AuthenticatedRequest } from "middleware/auth";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedResult = registerSchema.safeParse(req.body);

    if (!parsedResult.success) {
      // Validation failed
      sendError(res, 400, parsedResult.error.format());
      return;
    }

    const parsedData = parsedResult.data;

    const existingUser = await User.findOne({ email: parsedData.email });
    if (existingUser) {
      sendError(res, 400, "Email already in use");
      return;
    }

    const user = new User(parsedData);
    await user.save();

    const otp = randomInt(100000, 999999).toString();
    console.log(otp);
    const verificationToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );

    await redisClient.setEx(`verify:${user._id}`, 15 * 60, otp);
    console.log(`OTP for ${user.email}: ${otp}`);

    sendResponse(
      res,
      201,
      { verificationToken },
      "User registered successfully. Please verify your email."
    );
  } catch (err) {
    sendError(res, 400, err);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const parsedResult = loginSchema.safeParse(req.body);

    if (!parsedResult.success) {
      // Validation failed
      sendError(res, 400, parsedResult.error.format());
      return;
    }

    const parsedData = parsedResult.data;

    const user = await User.findOne({ email: parsedData.email });
    if (!user) {
      sendError(res, 400, "Invalid credentials");
      return;
    }

    const isMatch = await user.comparePassword(parsedData.password);
    if (!isMatch) {
      sendError(res, 400, "Invalid credentials");
      return;
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    sendResponse(res, 200, { token }, "Login successful");
  } catch (err) {
    sendError(res, 400, err);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const parsedResult = verifyEmailSchema.safeParse(req.body);

    if (!parsedResult.success) {
      // Validation failed
      sendError(res, 400, parsedResult.error.format());
      return;
    }

    const { otp, token } = parsedResult.data;

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    const userId = decoded.userId;

    const storedOtp = await redisClient.get(`verify:${userId}`);
    if (!storedOtp) {
      sendError(res, 400, "OTP expired or not found");
      return;
    }

    if (storedOtp !== otp) {
      sendError(res, 400, "Invalid OTP");
      return;
    }

    await User.findByIdAndUpdate(userId, { isEmailVerified: true });
    await redisClient.del(`verify:${userId}`);

    sendResponse(res, 200, null, "Email verified successfully");
  } catch (err) {
    sendError(res, 400, err);
  }
};

export const userLogInCheck = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { user } = req;
    sendResponse(res, 200, user, "user is loggedIn");
  } catch (err) {
    sendError(res, 400, err);
  }
};
