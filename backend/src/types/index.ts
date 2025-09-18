import { Socket } from "socket.io";

export interface AuthenticatedSocket extends Socket {
  user?: {
    id: string;
    username: string;
  };
}
