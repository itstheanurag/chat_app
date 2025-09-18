import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { randomInt } from "crypto";
import { User } from "models";
import { redisClient } from "lib/server";
import { registerSchema, loginSchema, verifyEmailSchema } from "schemas";
import { AuthenticatedRequest } from "middleware/auth";
import { sendResponse, sendError } from "lib/response";
import { Types } from "mongoose";
import z from "zod";

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const parsedResult = registerSchema.safeParse(req.body);

    if (!parsedResult.success) {
      // Validation failed
      return sendError(res, 400, parsedResult.error.format());
    }

    const parsedData = parsedResult.data;

    const existingUser = await User.findOne({ email: parsedData.email });
    if (existingUser) {
      return sendError(res, 400, "Email already in use");
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

    return sendResponse(
      res,
      201,
      { verificationToken },
      "User registered successfully. Please verify your email."
    );
  } catch (err) {
    return sendError(res, 400, err);
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const parsedResult = loginSchema.safeParse(req.body);

    if (!parsedResult.success) {
      // Validation failed
      return sendError(res, 400, parsedResult.error.format());
    }

    const parsedData = parsedResult.data;

    const user = await User.findOne({ email: parsedData.email });
    if (!user) {
      return sendError(res, 400, "Invalid credentials");
    }

    const isMatch = await user.comparePassword(parsedData.password);
    if (!isMatch) {
      return sendError(res, 400, "Invalid credentials");
    }

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return sendResponse(res, 200, { token }, "Login successful");
  } catch (err) {
    return sendError(res, 400, err);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const parsedResult = verifyEmailSchema.safeParse(req.body);

    if (!parsedResult.success) {
      return sendError(res, 400, parsedResult.error);
    }

    const { otp, token } = parsedResult.data;

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
    };
    const userId = decoded.userId;

    const storedOtp = await redisClient.get(`verify:${userId}`);
    if (!storedOtp) {
      return sendError(res, 400, "OTP expired or not found");
    }

    if (storedOtp !== otp) {
      return sendError(res, 400, "Invalid OTP");
    }

    await User.findByIdAndUpdate(userId, { isEmailVerified: true });
    await redisClient.del(`verify:${userId}`);

    return sendResponse(res, 200, null, "Email verified successfully");
  } catch (err) {
    return sendError(res, 400, err);
  }
};

export const userLogInCheck = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const { user } = req;
    return sendResponse(res, 200, user, "user is loggedIn");
  } catch (err) {
    return sendError(res, 400, err);
  }
};

export const searchUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return sendError(res, 400, "Not qualified to search");
    }

    const { q } = req.query;

    if (!q || typeof q !== "string" || q.trim() === "") {
      return sendError(res, 400, "Query parameter 'q' is required");
    }

    const regex = new RegExp(q.trim(), "i");

    const users = await User.find({
      $and: [
        {
          $or: [{ name: regex }, { email: regex }],
        },
        { _id: { $ne: userId } }, // exclude current user
      ],
    })
      .select("name email _id")
      .limit(20);

    const formatted = users.map((u) => ({
      id: (u._id as Types.ObjectId).toString(),
      name: u.name,
      email: u.email,
    }));

    return sendResponse(res, 200, formatted, "Users fetched successfully");
  } catch (err) {
    console.error("Search user error:", err);
    return sendError(res, 500, "Failed to search users");
  }
};
