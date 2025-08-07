import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.APP_PORT || 3001;

app.get('/', (req, res) => {
  res.send('Mail microservice is running!');
});

const server = app.listen(PORT, () => {
  console.log(`🚀 Mail service is running on Port: ${PORT}`);
});

const gracefulShutdown = async () => {
  console.log("\n🛑 Shutting down gracefully...");
  server.close(() => {
    console.log("🚪 HTTP server closed.");
    process.exit(0);
  });
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