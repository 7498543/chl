import { articleController } from "@/controller/article";
import { CreateCategoryDto, IdDto, UpdateCategoryDto } from "@/dto/article.dto";
import { PaginationDto } from "@/dto/common";
import { wrapAsync } from "@/middleware/errorHandler";
import { jwtAuth } from "@/middleware/jwt";
import express from "express";

const router = express.Router();
const authRouter = express.Router();

authRouter.use(jwtAuth);

/**
 * @openapi
 * /api/admin/article/category/create:
 *   post:
 *     tags: [文章分类-后台]
 *     summary: 创建分类
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug]
 *             properties:
 *               name:    { type: string, description: "分类名称" }
 *               slug:    { type: string, description: "路由标识" }
 *               icon:    { type: string, description: "图标" }
 *               coverId: { type: number, description: "封面 ID" }
 *               enabled: { type: number, default: 1 }
 *               sort:    { type: number, default: 0 }
 *     responses:
 *       200:
 *         description: 创建成功
 */
authRouter.post(
  "/create",
  articleController.validateBody(CreateCategoryDto),
  wrapAsync(articleController.createCategory),
);

/**
 * @openapi
 * /api/admin/article/category/update:
 *   post:
 *     tags: [文章分类-后台]
 *     summary: 更新分类
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:      { type: number }
 *               name:    { type: string }
 *               slug:    { type: string }
 *               icon:    { type: string }
 *               coverId: { type: number }
 *               enabled: { type: number }
 *               sort:    { type: number }
 *     responses:
 *       200:
 *         description: 更新成功
 */
authRouter.post(
  "/update",
  articleController.validateBody(UpdateCategoryDto),
  wrapAsync(articleController.updateCategory),
);

/**
 * @openapi
 * /api/admin/article/category/delete:
 *   post:
 *     tags: [文章分类-后台]
 *     summary: 软删除分类
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
  wrapAsync(articleController.deleteCategory),
);

/**
 * @openapi
 * /api/admin/article/category/list:
 *   post:
 *     tags: [文章分类-后台]
 *     summary: 分类列表（全部状态）
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
 *         description: 分类列表
 */
authRouter.post(
  "/list",
  articleController.validateBody(PaginationDto),
  wrapAsync(articleController.getAdminCategoryList),
);

router.use(authRouter);
export default router;
