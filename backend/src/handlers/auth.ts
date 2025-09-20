import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { randomInt } from "crypto";
import { User } from "models";
import { REDIS_KEYS, redisClient } from "lib/redis";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  tokenSchema,
} from "schemas";
import { AuthenticatedRequest } from "middleware/auth";
import { sendResponse, sendError } from "lib/response";
import { Types } from "mongoose";
import { generateAccessToken, generateToken } from "lib/jwt";

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const parsedResult = registerSchema.safeParse(req.body);

    if (!parsedResult.success) {
      // Validation failed
      return sendError(res, 400, parsedResult.error);
    }

    const parsedData = parsedResult.data;

    const existingUser = await User.findOne({ email: parsedData.email });
    if (existingUser) {
      return sendError(res, 400, "Email already in use");
    }

    const user = new User(parsedData);
    await user.save();

    const otp = randomInt(100000, 999999).toString();

    const emailSecret: jwt.Secret = process.env.JWT_EMAIL_SECRET!;
    const emailExpiresIn = process.env.JWT_EMAIL_EXPIRES_IN! as unknown as any;

    const verificationToken = jwt.sign(
      { userId: user._id, email: user.email },
      emailSecret,
      {
        expiresIn: emailExpiresIn,
      }
    );

    await redisClient.setEx(
      `${REDIS_KEYS.emailVerificationKey}:${user._id}`,
      15 * 60,
      otp
    );

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
      return sendError(res, 400, parsedResult.error);
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

    const tokens = await generateToken({
      id: (user._id as Types.ObjectId).toString(),
      email: user.email,
      name: user.name,
    });

    const userDetails = {
      id: (user._id as Types.ObjectId).toString(),
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    };

    return sendResponse(
      res,
      200,
      {
        ...userDetails,
        tokens,
      },
      "Login successful"
    );
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
        { _id: { $ne: userId } },
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

export const refreshToken = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const user = req.user;

    if (!user) {
      return sendError(res, 400, "User not found");
    }

    const tokens = generateAccessToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return sendResponse(res, 200, tokens, "Tokens refreshed successfully");
  } catch (err) {
    console.error("Refresh token error:", err);
    return sendError(res, 500, "Failed to refresh token");
  }
};

export const logout = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const user = req.user;

    if (!user) {
      return sendError(res, 400, "User not found");
    }

    await redisClient.del(`${REDIS_KEYS.accessTokenKey}:${user.id}`);
    await redisClient.del(`${REDIS_KEYS.refreshTokenKey}:${user.id}`);

    return sendResponse(res, 200, null, "Logged out successfully");
  } catch (err) {
    console.error("Logout error:", err);
    return sendError(res, 500, "Failed to log out");
  }
};

/**
 *  OTP RELATED AND EMAIL VERIFICATION RELATED CODE
 */

export const resendEmailVerificationToken = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const parsedResult = tokenSchema.safeParse(req.body);
    if (!parsedResult.success) {
      return sendError(res, 400, parsedResult.error);
    }
    const { token } = req.body;
    const decoded = jwt.verify(
      token,
      process.env.JWT_EMAIL_SECRET! as string
    ) as { userId: string; email: string };

    const { userId, email } = decoded;
    await redisClient.del(`${REDIS_KEYS.emailVerificationKey}:${userId}`);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await redisClient.setEx(
      `${REDIS_KEYS.emailVerificationKey}:${userId}`,
      15 * 60,
      otp
    );
    // sendEmail(user.email, `Your verification code is ${otp}`);
    console.log(email, `Your verification code is ${otp}`);
    return sendResponse(res, 200, { token, otp }, "Verification OTP resent");
  } catch (err) {
    return sendError(res, 500, err);
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

    const decoded = jwt.verify(
      token,
      process.env.JWT_EMAIL_SECRET! as string
    ) as {
      userId: string;
    };

    const userId = decoded.userId;

    const storedOtp = await redisClient.get(
      `${REDIS_KEYS.emailVerificationKey}:${userId}`
    );

    if (!storedOtp) {
      return sendError(res, 400, "OTP expired or not found");
    }

    if (storedOtp !== otp) {
      return sendError(res, 400, "Invalid OTP");
    }

    await User.findByIdAndUpdate(userId, { isEmailVerified: true });
    await redisClient.del(`${REDIS_KEYS.emailVerificationKey}:${userId}`);

    return sendResponse(res, 200, null, "Email verified successfully");
  } catch (err) {
    return sendError(res, 400, err);
  }
};
