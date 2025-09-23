import { AuthenticatedSocket } from "lib/socket/socket";
import { Chat, Message } from "models";
import { Server } from "socket.io";

export function registerChatEvents(io: Server) {
  io.on("connection", (socket: AuthenticatedSocket) => {
    if (!socket.user) return;

    // console.log(`User connected: ${socket.user.name} (${socket.user.id})`);
    /**
     * Join a chat room
     */
    socket.on("joinChat", async (chatId: string) => {
      try {
        const chat = await Chat.findById(chatId);
        if (!chat) return socket.emit("error", "Chat not found");

        const isParticipant = chat.participants.some(
          (p) => p.userId.toString() === socket.user!.id
        );

        if (!isParticipant) return socket.emit("error", "Access denied");
        socket.join(chatId);
        // console.log(`${socket?.user?.name} joined chat ${chatId}`);
        const messages = await Message.find({ chatId })
          .sort({ createdAt: -1 })
          .limit(20)
          .populate("senderId", "name email");

        socket.emit("chatHistory", messages.reverse());
      } catch (err) {
        // console.error(err);
        socket.emit("error", "Failed to join chat");
      }
    });

    /**
     * Handle sending a message
     */
    socket.on(
      "sendMessage",
      async (data: { chatId: string; text: string; senderId: string }) => {
        try {
          const { chatId, text, senderId } = data;
          if (!text.trim()) return;

          // console.log(data);

          const chat = await Chat.findById(chatId);
          if (!chat) return socket.emit("error", "Chat not found");

          // Validate participant
          const isParticipant = chat.participants.some(
            (p) => p.userId.toString() === socket.user!.id
          );
          if (!isParticipant) return socket.emit("error", "Access denied");

          // Create and save the new message
          const newMessage = await Message.create({
            chatId,
            senderId,
            text,
            status: "sent",
          });

          chat.lastMessage = {
            text: data.text,
            senderId: newMessage.senderId,
            createdAt: new Date(),
          };

          await chat.save();
          io.to(chatId).emit("receiveMessage", newMessage);
        } catch (err) {
          // console.error(err);
          socket.emit("error", "Failed to send message");
        }
      }
    );

    socket.on("typing", async (data: { chatId: string; username: string }) => {
      try {
        const { chatId, username } = data;
        io.to(chatId).emit("userTyping", { username });
      } catch (err) {
        // console.error(err);
        socket.emit("error", "Failed to send message");
      }
    });

    socket.on(
      "stopTyping",
      async (data: { chatId: string; username: string }) => {
        try {
          const { chatId, username } = data;
          io.to(chatId).emit("stopTyping", { username });
        } catch (err) {
          // console.error(err);
          socket.emit("error", "Failed to send message");
        }
      }
    );

    /**
     * Leave chat
     */
    socket.on("leaveChat", (chatId: string) => {
      socket.leave(chatId);
      // console.log(`${socket.user?.name} left chat ${chatId}`);
    });

    socket.on("disconnect", (reason) => {
      console.log(
        `User disconnected: ${socket.user?.name || "Unknown"} | ${reason}`
      );
    });
  });
}
