import { startServer, gracefulShutdown } from "./lib/server";

(async () => {
  try {
    const { server: runningServer } = await startServer();
    server = runningServer;

    process.on("SIGINT", () => gracefulShutdown(server!));
    process.on("SIGTERM", () => gracefulShutdown(server!));

    process.on("uncaughtException", (err: Error) => {
      console.error("Uncaught exception occurred:", err);
      gracefulShutdown(server!).then(() => process.exit(1));
    });

    process.on("unhandledRejection", (reason) => {
      console.error("Unhandled Rejection:", reason);
      gracefulShutdown(server!).then(() => process.exit(1));
    });
  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
  }
})();
