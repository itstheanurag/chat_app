import { createClient, type RedisClientType } from "redis";

export const REDIS_KEYS = {
  accessTokenKey: "access_token_key",
  refreshTokenKey: "refresh_token_key",
  emailVerificationKey: "email_verification_key",
};

export const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URI || "redis://localhost:6379",
});

