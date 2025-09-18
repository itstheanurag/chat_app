import type { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendError } from "lib/response";

export interface JwtPayloadOptions extends JwtPayload {
  id: string;
  email: string;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayloadOptions;
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

export function auth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is not configured");
    sendError(res, 500, "Server configuration error");
    return;
  }

  const authHeader = req.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    sendError(res, 401, "Authorization token missing or invalid");
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    sendError(res, 401, "Authorization token missing or invalid");
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (!isJwtPayloadOptions(decoded)) {
      console.error("JWT payload does not contain required fields:", decoded);
      sendError(res, 403, "Invalid token payload");
      return;
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    sendError(res, 403, "Invalid or expired token");
  }
}
