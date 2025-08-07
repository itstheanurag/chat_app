import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 3001;

let server: ReturnType<typeof app.listen>;
const startServer = async () => {
  try {

    server = app.listen(PORT, () => {
      console.log(`🚀 Chat service is running on Port: ${PORT}`);
    });

  } catch (error: any) {
    console.error("❌ Failed to connect to the database:", error.message);
    process.exit(1);
  }
};

startServer();

const gracefulShutdown = async () => {
  console.log("\n🛑 Shutting down gracefully...");
  if (server) server.close(() => console.log("🚪 HTTP server closed."));
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

process.on("uncaughtException", err => {
  console.error("💥 Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", err => {
  console.error("💥 Unhandled Rejection:", err);
  process.exit(1);
});