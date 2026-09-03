import express from "express";

const router = express.Router();

/**
 * @openapi
 * /api:
 *   get:
 *     tags: [基础]
 *     summary: API 根路由
 *     responses:
 *       200:
 *         description: API 服务正常运行
 */
router.get("/", (_, res) => {
  res.json({ message: "API service is running" });
});

export default router;
