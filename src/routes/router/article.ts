import express from "express";
import { articleController } from "@/controller/article";
import z from "zod";

const router = express.Router({});

/**
 * @openapi
 * /api/article/category/list:
 *   get:
 *     tags: [文章管理]
 *     summary: 获取文章分类列表
 *     responses:
 *       200:
 *         description: 分类列表
 */
router.get("/category/list", articleController.getCategoryList);

/**
 * @openapi
 * /api/article/tag/list:
 *   get:
 *     tags: [文章管理]
 *     summary: 获取标签列表
 *     responses:
 *       200:
 *         description: 标签列表
 */
router.get("/tag/list", articleController.getTagList);

/**
 * @openapi
 * /api/article/list:
 *   post:
 *     tags: [文章管理]
 *     summary: 获取文章列表（分页）
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId: { type: number, description: "分类ID" }
 *               title: { type: string, description: "标题模糊搜索" }
 *               page: { type: number, description: "页码，默认1" }
 *               pageSize: { type: number, description: "每页条数，默认10" }
 *     responses:
 *       200:
 *         description: 文章列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 list:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *                 total: { type: number }
 */
router.post(
  "/list",
  articleController.validateBody(
    z.object({
      categoryId: z.string().optional(),
      title: z.string().optional(),
      page: z.string().optional(),
      pageSize: z.string().optional(),
    }),
  ),
  articleController.getList,
);

/**
 * @openapi
 * /api/article/detail:
 *   post:
 *     tags: [文章管理]
 *     summary: 获取文章详情
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id: { type: number, description: "文章ID" }
 *     responses:
 *       200:
 *         description: 文章详情
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Article'
 */
router.post(
  "/detail",
  articleController.validateBody(
    z.object({
      id: z.string(),
    }),
  ),
  articleController.getDetail,
);

export default router;
