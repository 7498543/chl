import { articleController } from "@/controller/article";
import { ArticleCategoryListDto, ArticleListDto, ArticleTagListDto } from "@/dto/article.dto";
import { wrapAsync } from "@/middleware/errorHandler";
import express from "express";

const router = express.Router({});

/**
 * @openapi
 * /api/article/category/list:
 *   post:
 *     tags: [文章管理]
 *     summary: 获取文章分类列表
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Pagination"
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/SuccessResponse"
 */
router.post(
  "/category/list",
  articleController.validateBody(ArticleCategoryListDto),
  wrapAsync(articleController.getCategoryList),
);

/**
 * @openapi
 * /api/article/tag/list:
 *   post:
 *     tags: [文章管理]
 *     summary: 获取标签列表
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Pagination"
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/SuccessResponse"
 */
router.post(
  "/tag/list",
  articleController.validateBody(ArticleTagListDto),
  wrapAsync(articleController.getTagList),
);

/**
 * @openapi
 * /api/article/list:
 *   post:
 *     tags: [文章管理]
 *     summary: 获取文章列表
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
 *                     description: 分类 ID
 *                   title:
 *                     type: string
 *                     description: 标题模糊搜索
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/SuccessResponse"
 */
router.post(
  "/list",
  articleController.validateBody(ArticleListDto),
  wrapAsync(articleController.getList),
);

/**
 * @openapi
 * /api/article/detail:
 *   post:
 *     tags: [文章管理]
 *     summary: 获取文章详情
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/IdParam"
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/SuccessResponse"
 */

export default router;
