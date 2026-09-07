import http from "http";
import app from "./app";
import { closeDB, initDB, logger, useRuntimeConfig } from "./core";

async function bootstrap() {
  const config = useRuntimeConfig();

  initDB();

  const server = http.createServer(app);

  server.listen(config.PORT, () => {
    const envLabel = config.NODE_ENV || "unknown";
    const pm2Label = config.IS_PM2
      ? ` [PM2] instance=${config.PM2_INSTANCE_ID} pid=${config.PM2_PROCESS_ID}`
      : "";

    logger.info(`Server is running on http://localhost:${config.PORT} [${envLabel}]${pm2Label}`);
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
