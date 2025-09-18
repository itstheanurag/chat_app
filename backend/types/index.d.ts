import { JwtPayloadOptions } from "../src/middleware/auth";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadOptions;
      chat?: any;
    }
  }
}
