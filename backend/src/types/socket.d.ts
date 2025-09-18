import { JwtPayloadOptions } from "middleware/auth";
import "socket.io";

declare module "socket.io" {
  interface Socket {
    user?: JwtPayloadOptions;
  }
}
