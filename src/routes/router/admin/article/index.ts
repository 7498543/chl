import { articleController } from "@/controller/article";
import { CreateArticleDto, IdDto, UpdateArticleDto } from "@/dto/article.dto";
import { PaginationDto } from "@/dto/common";
import { wrapAsync } from "@/middleware/errorHandler";
import { jwtAuth } from "@/middleware/jwt";
import express from "express";

const router = express.Router();
const authRouter = express.Router();

authRouter.use(jwtAuth);

/**
 * @openapi
 * /api/admin/article/create:
 *   post:
 *     tags: [文章管理-后台]
 *     summary: 创建文章
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 description: 标题
 *               description:
 *                 type: string
 *                 description: 摘要
 *               content:
 *                 type: string
 *                 description: 正文
 *               coverId:
 *                 type: integer
 *                 description: 封面图 ID
 *               categoryId:
 *                 type: integer
 *                 description: 分类 ID
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: 标签 ID 列表
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
  articleController.validateBody(CreateArticleDto),
  wrapAsync(articleController.createArticle),
);

/**
 * @openapi
 * /api/admin/article/update:
 *   post:
 *     tags: [文章管理-后台]
 *     summary: 更新文章
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
 *                 description: 文章 ID
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               content:
 *                 type: string
 *               coverId:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: integer
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
  articleController.validateBody(UpdateArticleDto),
  wrapAsync(articleController.updateArticle),
);

/**
 * @openapi
 * /api/admin/article/delete:
 *   post:
 *     tags: [文章管理-后台]
 *     summary: 软删除文章
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
  wrapAsync(articleController.deleteArticle),
);

/**
 * @openapi
 * /api/admin/article/list:
 *   post:
 *     tags: [文章管理-后台]
 *     summary: 文章列表（含草稿/禁用）
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: "#/components/schemas/Pagination"
 *               - type: object
 *                 properties:
 *                   categoryId:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   enabled:
 *                     $ref: "#/components/schemas/Enabled"
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/SuccessResponse"
 */
authRouter.post(
  "/list",
  articleController.validateBody(PaginationDto),
  wrapAsync(articleController.getAdminList),
);

/**
 * @openapi
 * /api/admin/article/detail:
 *   post:
 *     tags: [文章管理-后台]
 *     summary: 文章详情（不限状态）
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
  "/detail",
  articleController.validateBody(IdDto),
  wrapAsync(articleController.getAdminDetail),
);

router.use(authRouter);
export default router;
