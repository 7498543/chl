import express from "express";
import path from "node:path";
import swaggerUi from "swagger-ui-express";
import { pathToFileURL } from "node:url";
import { globSync } from "glob";
import { swaggerSpec, isSwaggerEnabled } from "@/core";

const router = express.Router();
const apiRouter = express.Router({});

// 静态文件服务
router.use(express.static(path.resolve("public")));

// 自动导入 router 目录下的所有路由文件
(async () => {
  const routerDir = path.resolve(__dirname, "router");
  const files = globSync("**/*.{ts,js}", { cwd: routerDir });

  for (const file of files) {
    const ext = path.extname(file);
    // 取文件相对路径去除扩展名作为路由路径，index 文件映射到父目录
    let routePath = file.slice(0, -ext.length);
    if (routePath.endsWith("/index")) {
      routePath = routePath.slice(0, -6);
    }
    routePath = `/${routePath}`;

    const routeModule = await import(pathToFileURL(path.join(routerDir, file)).href);
    const routeRouter = routeModule.default;
    if (routeRouter) {
      apiRouter.use(routePath, routeRouter);
    }
  }
})();

router.use("/api", apiRouter);

// Swagger API 文档（仅非生产环境或显式启用时可用）
if (isSwaggerEnabled()) {
  router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  router.get("/api-docs.json", (_, res) => {
    res.json(swaggerSpec);
  });
}

export default router;
