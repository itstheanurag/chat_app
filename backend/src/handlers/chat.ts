import { Server, Socket } from "socket.io";

export const chatHandler = (io: Server, socket: Socket) => {
  socket.on("sendMessage", (message: string) => {
    console.log(`📨 Message from ${socket.user?.name || "Unknown"}:`, message);
    io.emit("receiveMessage", {
      user: socket.user?.name || "Anonymous",
      message,
    });
  });
};
