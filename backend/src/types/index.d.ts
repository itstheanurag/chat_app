import { JwtPayloadOptions } from "../middleware/auth";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadOptions;
    }
  }
}
