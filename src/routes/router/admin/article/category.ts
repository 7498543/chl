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
 *               name:
 *                 type: string
 *                 description: 分类名称
 *               slug:
 *                 type: string
 *                 description: 路由标识
 *               icon:
 *                 type: string
 *                 description: 图标
 *               coverId:
 *                 type: integer
 *                 description: 封面 ID
 *               enabled:
 *                 $ref: "#/components/schemas/Enabled"
 *               sort:
 *                 type: integer
 *                 default: 0
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/SuccessResponse"
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
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *               icon:
 *                 type: string
 *               coverId:
 *                 type: integer
 *               enabled:
 *                 $ref: "#/components/schemas/Enabled"
 *               sort:
 *                 type: integer
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/SuccessResponse"
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
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/IdParam"
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/SuccessResponse"
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
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: "#/components/schemas/Pagination"
 *               - type: object
 *                 properties:
 *                   name:
 *                     type: string
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/SuccessResponse"
 */
authRouter.post(
  "/list",
  articleController.validateBody(PaginationDto),
  wrapAsync(articleController.getAdminCategoryList),
);

router.use(authRouter);
export default router;
