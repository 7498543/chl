import { seoMetaController } from "@/controller/sys";
import {
  CreateSeoMetaDto,
  SeoMetaByTargetDto,
  SeoMetaIdDto,
  SeoMetaListDto,
  UpdateSeoMetaDto,
} from "@/dto/sys.dto";
import { wrapAsync } from "@/middleware/errorHandler";
import { jwtAuth } from "@/middleware/jwt";
import express from "express";

const router = express.Router();
const authRouter = express.Router();

authRouter.use(jwtAuth);

/**
 * @openapi
 * /api/admin/seo/create:
 *   post:
 *     tags: [SEO-后台]
 *     summary: 创建/更新 SEO 元数据（同一 type+targetId 会覆盖）
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, targetId]
 *             properties:
 *               type:        { type: string, enum: [page, article] }
 *               targetId:    { type: number }
 *               title:       { type: string, description: "SEO 标题" }
 *               keywords:    { type: string, description: "SEO 关键词" }
 *               description: { type: string, description: "SEO 描述" }
 *               ogImage:     { type: string, description: "OG 分享图" }
 *               canonical:   { type: string, description: "权威链接" }
 *     responses:
 *       200:
 *         description: 操作成功
 */
authRouter.post(
  "/create",
  seoMetaController.validateBody(CreateSeoMetaDto),
  wrapAsync(seoMetaController.create),
);

/**
 * @openapi
 * /api/admin/seo/update:
 *   post:
 *     tags: [SEO-后台]
 *     summary: 更新 SEO 元数据
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:          { type: number }
 *               title:       { type: string }
 *               keywords:    { type: string }
 *               description: { type: string }
 *               ogImage:     { type: string }
 *               canonical:   { type: string }
 *     responses:
 *       200:
 *         description: 更新成功
 */
authRouter.post(
  "/update",
  seoMetaController.validateBody(UpdateSeoMetaDto),
  wrapAsync(seoMetaController.update),
);

/**
 * @openapi
 * /api/admin/seo/delete:
 *   post:
 *     tags: [SEO-后台]
 *     summary: 删除 SEO 元数据
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
  seoMetaController.validateBody(SeoMetaIdDto),
  wrapAsync(seoMetaController.delete),
);

/**
 * @openapi
 * /api/admin/seo/list:
 *   post:
 *     tags: [SEO-后台]
 *     summary: SEO 元数据列表
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               page:     { type: number, default: 1 }
 *               pageSize: { type: number, default: 20 }
 *               type:     { type: string, enum: [page, article] }
 *               targetId: { type: number }
 *     responses:
 *       200:
 *         description: SEO 列表
 */
authRouter.post(
  "/list",
  seoMetaController.validateBody(SeoMetaListDto),
  wrapAsync(seoMetaController.list),
);

/**
 * @openapi
 * /api/admin/seo/detail:
 *   post:
 *     tags: [SEO-后台]
 *     summary: 按目标查询 SEO 元数据
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, targetId]
 *             properties:
 *               type:     { type: string, enum: [page, article] }
 *               targetId: { type: number }
 *     responses:
 *       200:
 *         description: SEO 详情
 */
authRouter.post(
  "/detail",
  seoMetaController.validateBody(SeoMetaByTargetDto),
  wrapAsync(seoMetaController.detail),
);

router.use(authRouter);
export default router;
