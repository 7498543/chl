import app from "./app";
import http from "http";
import { useRuntimeConfig } from "./core";

/**
 * 启动引导
 * @description 项目启动引导函数
 */
function bootstrap() {
  const server = http.createServer(app);
  const config = useRuntimeConfig();

  server.listen(config.PORT);
}

bootstrap();
