import { articleController } from "@/controller/article";
import { CreateTagDto, IdDto, UpdateTagDto } from "@/dto/article.dto";
import { PaginationDto } from "@/dto/common";
import { wrapAsync } from "@/middleware/errorHandler";
import { jwtAuth } from "@/middleware/jwt";
import express from "express";

const router = express.Router();
const authRouter = express.Router();

authRouter.use(jwtAuth);

/**
 * @openapi
 * /api/admin/article/tag/create:
 *   post:
 *     tags: [文章标签-后台]
 *     summary: 创建标签
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, description: "标签名称" }
 *     responses:
 *       200:
 *         description: 创建成功
 */
authRouter.post(
  "/create",
  articleController.validateBody(CreateTagDto),
  wrapAsync(articleController.createTag),
);

/**
 * @openapi
 * /api/admin/article/tag/update:
 *   post:
 *     tags: [文章标签-后台]
 *     summary: 更新标签
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id, name]
 *             properties:
 *               id:   { type: number }
 *               name: { type: string }
 *     responses:
 *       200:
 *         description: 更新成功
 */
authRouter.post(
  "/update",
  articleController.validateBody(UpdateTagDto),
  wrapAsync(articleController.updateTag),
);

/**
 * @openapi
 * /api/admin/article/tag/delete:
 *   post:
 *     tags: [文章标签-后台]
 *     summary: 软删除标签
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id: { type: number }
 *     responses:
 *       200:
 *         description: 删除成功
 */
authRouter.post(
  "/delete",
  articleController.validateBody(IdDto),
  wrapAsync(articleController.deleteTag),
);

/**
 * @openapi
 * /api/admin/article/tag/list:
 *   post:
 *     tags: [文章标签-后台]
 *     summary: 标签列表（全部状态）
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:     { type: string }
 *               page:     { type: number, default: 1 }
 *               pageSize: { type: number, default: 10 }
 *     responses:
 *       200:
 *         description: 标签列表
 */
authRouter.post(
  "/list",
  articleController.validateBody(PaginationDto),
  wrapAsync(articleController.getAdminTagList),
);

router.use(authRouter);
export default router;
