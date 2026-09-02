import app from "./app";
import http from "http";
import { useRuntimeConfig, initDB } from "./core";

function bootstrap() {
  const config = useRuntimeConfig();

  initDB();

  const server = http.createServer(app);

  server.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close(() => {
      console.log("HTTP server closed");
      process.exit(0);
    });
  });
}

bootstrap();
