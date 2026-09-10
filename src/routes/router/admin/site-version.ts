import { siteVersionController } from "@/controller/sys";
import {
  CreateSiteVersionDto,
  SiteVersionIdDto,
  SiteVersionListDto,
  UpdateSiteVersionDto,
} from "@/dto/sys.dto";
import { wrapAsync } from "@/middleware/errorHandler";
import { jwtAuth } from "@/middleware/jwt";
import express from "express";

const router = express.Router();
const authRouter = express.Router();

authRouter.use(jwtAuth);

/**
 * @openapi
 * /api/admin/site-version/create:
 *   post:
 *     tags: [站点版本-后台]
 *     summary: 创建站点版本
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, version, content]
 *             properties:
 *               name:        { type: string, description: "版本名称" }
 *               description: { type: string, description: "版本描述" }
 *               version:     { type: string, description: "语义化版本号" }
 *               content:     { type: object, description: "版本数据快照" }
 *     responses:
 *       200:
 *         description: 创建成功
 */
authRouter.post(
  "/create",
  siteVersionController.validateBody(CreateSiteVersionDto),
  wrapAsync(siteVersionController.create),
);

/**
 * @openapi
 * /api/admin/site-version/update:
 *   post:
 *     tags: [站点版本-后台]
 *     summary: 更新站点版本
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
 *               name:        { type: string }
 *               description: { type: string }
 *               version:     { type: string }
 *               content:     { type: object }
 *               enabled:     { type: number }
 *     responses:
 *       200:
 *         description: 更新成功
 */
authRouter.post(
  "/update",
  siteVersionController.validateBody(UpdateSiteVersionDto),
  wrapAsync(siteVersionController.update),
);

/**
 * @openapi
 * /api/admin/site-version/delete:
 *   post:
 *     tags: [站点版本-后台]
 *     summary: 删除站点版本（软删除）
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
  siteVersionController.validateBody(SiteVersionIdDto),
  wrapAsync(siteVersionController.delete),
);

/**
 * @openapi
 * /api/admin/site-version/list:
 *   post:
 *     tags: [站点版本-后台]
 *     summary: 站点版本列表
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
 *               name:     { type: string, description: "按名称搜索" }
 *     responses:
 *       200:
 *         description: 版本列表
 */
authRouter.post(
  "/list",
  siteVersionController.validateBody(SiteVersionListDto),
  wrapAsync(siteVersionController.list),
);

/**
 * @openapi
 * /api/admin/site-version/detail:
 *   post:
 *     tags: [站点版本-后台]
 *     summary: 站点版本详情
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
 *         description: 版本详情
 */
authRouter.post(
  "/detail",
  siteVersionController.validateBody(SiteVersionIdDto),
  wrapAsync(siteVersionController.detail),
);

router.use(authRouter);
export default router;
