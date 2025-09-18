import { startServer, gracefulShutdown } from "./lib/server";

(async () => {
  try {
    const { server: runningServer } = await startServer();

    process.on("SIGINT", () => gracefulShutdown(runningServer!));
    process.on("SIGTERM", () => gracefulShutdown(runningServer!));

    process.on("uncaughtException", (err: Error) => {
      console.error("Uncaught exception occurred:", err);
      gracefulShutdown(runningServer!).then(() => process.exit(1));
    });

    process.on("unhandledRejection", (reason) => {
      console.error("Unhandled Rejection:", reason);
      gracefulShutdown(runningServer!).then(() => process.exit(1));
    });
  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
  }
})();
