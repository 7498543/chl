import express from "express";

const router = express.Router();

/**
 * @openapi
 * /api/auth:
 *   get:
 *     tags: [认证管理]
 *     summary: 认证接口（待实现）
 *     responses:
 *       200:
 *         description: 成功
 */
router.get("/", (_, res) => {
  res.send("auth route");
});

export default router;
