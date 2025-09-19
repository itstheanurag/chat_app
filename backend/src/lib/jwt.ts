import jwt, { JwtPayload } from "jsonwebtoken";
import { JwtPayloadOptions } from "middleware/auth";
import { redisClient } from "./redis";

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export async function generateToken(
  payload: JwtPayloadOptions
): Promise<Tokens> {
  const accessSecret: jwt.Secret = process.env.JWT_ACCESS_SECRET ?? "";
  const refreshSecret: jwt.Secret = process.env.JWT_REFRESH_SECRET ?? "";

  const accessExpiresIn =
    process.env.JWT_ACCESS_EXPIRES_IN ?? ("15m" as unknown as any);
  const refreshExpiresIn =
    process.env.JWT_REFRESH_EXPIRES_IN ?? ("7d" as unknown as any);

  const accessToken = jwt.sign({ ...payload }, accessSecret, {
    expiresIn: accessExpiresIn,
    algorithm: "HS256",
  });

  const refreshToken = jwt.sign({ ...payload }, refreshSecret, {
    expiresIn: refreshExpiresIn,
    algorithm: "HS256",
  });

  const accessTtlSeconds = 15 * 60;
  const refreshTtlSeconds = 7 * 24 * 60 * 60;

  await redisClient.set(`login_access_token:${payload.id}`, accessToken, {
    EX: accessTtlSeconds,
  });

  await redisClient.set(`login_refresh_token:${payload.id}`, refreshToken, {
    EX: refreshTtlSeconds,
  });

  return { accessToken, refreshToken };
}

export async function generateAccessToken(
  payload: JwtPayloadOptions
): Promise<string> {
  const accessSecret: jwt.Secret = process.env.JWT_ACCESS_SECRET ?? "";

  const accessExpiresIn =
    process.env.JWT_ACCESS_EXPIRES_IN ?? ("15m" as unknown as any);
  const accessToken = jwt.sign({ ...payload }, accessSecret, {
    expiresIn: accessExpiresIn,
    algorithm: "HS256",
  });

  const accessTtlSeconds = 15 * 60;

  await redisClient.set(`login_access_token:${payload.id}`, accessToken, {
    EX: accessTtlSeconds,
  });

  return accessToken;
}

export function validateAccessToken(
  token: string
): JwtPayload & JwtPayloadOptions {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET ?? "") as JwtPayload &
    JwtPayloadOptions;
}

export function validateRefreshToken(
  token: string
): JwtPayload & JwtPayloadOptions {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET ?? "") as JwtPayload &
    JwtPayloadOptions;
}
