import { JwtPayloadOptions } from "../src/middleware/auth";

declare module "socket.io" {
  interface Socket {
    user?: JwtPayloadOptions;
  }
}
