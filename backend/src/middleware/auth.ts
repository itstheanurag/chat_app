import type { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendError } from "lib/response";
import { redisClient, REDIS_KEYS } from "lib/redis";

export interface JwtPayloadOptions extends JwtPayload {
  id: string;
  email: string;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayloadOptions;
  chat?: any;
}

function isJwtPayloadOptions(obj: unknown): obj is JwtPayloadOptions {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.email === "string" &&
    typeof o.name === "string"
  );
}

export async function auth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not configured");
    return sendError(res, 500, "Server configuration error");
  }

  const authHeader = req.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return sendError(res, 401, "Authorization token missing or invalid");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return sendError(res, 401, "Authorization token missing or invalid");
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (!isJwtPayloadOptions(decoded)) {
      return sendError(res, 403, "Invalid token payload");
    }

    const userId = decoded.id;
    const redisKey = `${REDIS_KEYS.accessTokenKey}:${userId}`;

    const storedToken = await redisClient.get(redisKey);
    if (!storedToken || storedToken !== token) {
      return sendError(res, 403, "Token expired or invalid (logged out)");
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return sendError(res, 403, "Invalid or expired token");
  }
}

export async function refreshTokenGuard(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  const secret = process.env.JWT_REFRESH_SECRET;

  if (!secret) {
    return sendError(res, 500, "Server configuration error");
  }

  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return sendError(res, 401, "Refresh token missing");
  }

  try {
    const decoded = jwt.verify(refreshToken, secret);

    if (!isJwtPayloadOptions(decoded)) {
      return sendError(res, 403, "Invalid refresh token payload");
    }

    const redisKey = `${REDIS_KEYS.refreshTokenKey}:${decoded.id}`;
    const storedToken = await redisClient.get(redisKey);

    if (!storedToken || storedToken !== refreshToken) {
      return sendError(res, 403, "Refresh token expired or invalid");
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("Refresh token verification failed:", err);
    return sendError(res, 403, "Invalid or expired refresh token");
  }
}
