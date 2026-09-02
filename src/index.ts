import app from "./app";
import http from "http";
import { useRuntimeConfig, initDB, closeDB, logger } from "./core";

async function bootstrap() {
  const config = useRuntimeConfig();

  initDB();

  const server = http.createServer(app);

  server.listen(config.PORT, () => {
    logger.info(`Server is running on http://localhost:${config.PORT}`);
  });

  async function gracefulShutdown(signal: string) {
    logger.info(`${signal} received, starting graceful shutdown...`);

    server.close(async () => {
      logger.info("HTTP server closed");
      await closeDB();
      logger.info("Database connection closed");
      process.exit(0);
    });

    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  }

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}

bootstrap();