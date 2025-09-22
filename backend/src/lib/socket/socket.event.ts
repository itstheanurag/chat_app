import { AuthenticatedSocket } from "lib/socket/socket";
import { Chat, Message } from "models";
import { Server } from "socket.io";

export function registerChatEvents(io: Server) {
  io.on("connection", (socket: AuthenticatedSocket) => {
    if (!socket.user) return;

    console.log(`User connected: ${socket.user.name} (${socket.user.id})`);
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
        console.log(`${socket?.user?.name} joined chat ${chatId}`);
        // Send last 20 messages
        const messages = await Message.find({ chatId })
          .sort({ createdAt: -1 })
          .limit(20)
          .populate("senderId", "name email");

        // Reverse so newest at bottom
        socket.emit("chatHistory", messages.reverse());
      } catch (err) {
        console.error(err);
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
          console.log(data);
          const { chatId, text, senderId } = data;

          if (!text.trim()) return;

          const chat = await Chat.findById(chatId);
          if (!chat) return socket.emit("error", "Chat not found");

          // Only allow participants
          const isParticipant = chat.participants.some(
            (p) => p.userId.toString() === socket.user!.id
          );
          if (!isParticipant) return socket.emit("error", "Access denied");

          const newMessage = await Message.create({
            chatId,
            senderId: senderId,
            text: text,
            status: "sent",
          });

          // Broadcast to everyone in the room
          io.to(chatId).emit("receiveMessage", newMessage);
        } catch (err) {
          console.error(err);
          socket.emit("error", "Failed to send message");
        }
      }
    );

    /**
     * Leave chat
     */
    socket.on("leaveChat", (chatId: string) => {
      socket.leave(chatId);
      console.log(`${socket.user?.name} left chat ${chatId}`);
    });

    socket.on("disconnect", (reason) => {
      console.log(
        `User disconnected: ${socket.user?.name || "Unknown"} | ${reason}`
      );
    });
  });
}
