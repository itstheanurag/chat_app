import { Server } from "socket.io";
import { AuthenticatedSocket } from "../types";

export const chatHandler = (io: Server, socket: AuthenticatedSocket) => {
  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", message);
  });
};
