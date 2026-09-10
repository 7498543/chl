import { isSwaggerEnabled, logger, swaggerSpec } from "@/core";
import express from "express";
import { globSync } from "glob";
import path from "node:path";
import { pathToFileURL } from "node:url";
import swaggerUi from "swagger-ui-express";

const router = express.Router();
const apiRouter = express.Router({});

// 静态文件服务
router.use(express.static(path.resolve("public")));

// 自动加载 router 目录下的所有路由文件
// 按路径深度降序排列（更长路径优先），确保 /article/category 在 /article 之前注册
(async () => {
  const routerDir = path.resolve(__dirname, "router");
  const files = globSync("**/*.{ts,js}", { cwd: routerDir });

  // 将文件路径映射为路由路径，按路径段数降序排列（最具体路径优先注册）
  const routes = files
    .map((file) => {
      // Windows 下 glob 返回反斜杠，统一转为正斜杠
      let routePath = file.replace(/\\/g, "/");
      const ext = path.extname(routePath);
      routePath = routePath.slice(0, -ext.length);
      if (routePath.endsWith("/index")) {
        routePath = routePath.slice(0, -6);
      }
      const segments = routePath.split("/").filter(Boolean);
      return { file, routePath: `/${routePath}`, depth: segments.length };
    })
    .sort((a, b) => b.depth - a.depth || a.routePath.localeCompare(b.routePath));

  for (const { file, routePath } of routes) {
    try {
      const routeModule = await import(pathToFileURL(path.join(routerDir, file)).href);
      const routeRouter = routeModule.default;
      if (routeRouter) {
        apiRouter.use(routePath, routeRouter);
        logger.info(`[Route] ${routePath}`);
      }
    } catch (err) {
      logger.error(`[Route] 加载失败 ${file}: ${(err as Error).message}`);
    }
  }
})().catch((err) => logger.error(`[Route] 路由加载异常: ${(err as Error).message}`));

router.use("/api", apiRouter);

// Swagger API 文档（仅非生产环境或显式启用时可用）
if (isSwaggerEnabled()) {
  router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  router.get("/api-docs.json", (_, res) => {
    res.json(swaggerSpec);
  });
}

export default router;
