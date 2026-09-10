import { assetController } from "@/controller/asset";
import { upload } from "@/core/upload";
import {
  AlbumIdDto,
  AlbumListDto,
  AssetIdDto,
  AssetListDto,
  CreateAlbumDto,
  UpdateAlbumDto,
  UpdateAssetDto,
  UploadAssetDto,
} from "@/dto/asset.dto";
import { wrapAsync } from "@/middleware/errorHandler";
import { jwtAuth } from "@/middleware/jwt";
import express from "express";

const router = express.Router();
const authRouter = express.Router();

authRouter.use(jwtAuth);

/* ═══════ 资产 ═══════ */

/**
 * @openapi
 * /api/admin/asset/upload:
 *   post:
 *     tags: [资产-后台]
 *     summary: 上传文件
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:    { type: string, format: binary, description: "文件" }
 *               title:   { type: string, description: "标题" }
 *               alt:     { type: string, description: "替代文本" }
 *               albumId: { type: number, description: "相册 ID" }
 *               sort:    { type: number, default: 0 }
 *     responses:
 *       200:
 *         description: 上传成功
 */
authRouter.post(
  "/upload",
  upload.single("file"),
  assetController.validateBody(UploadAssetDto),
  wrapAsync(assetController.upload),
);

/**
 * @openapi
 * /api/admin/asset/list:
 *   post:
 *     tags: [资产-后台]
 *     summary: 资产列表
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
 *               type:     { type: string, description: "按类型过滤" }
 *               albumId:  { type: number, description: "按相册过滤" }
 *               title:    { type: string, description: "按标题模糊搜索" }
 *     responses:
 *       200:
 *         description: 资产列表
 */
authRouter.post(
  "/list",
  assetController.validateBody(AssetListDto),
  wrapAsync(assetController.list),
);

/**
 * @openapi
 * /api/admin/asset/detail:
 *   post:
 *     tags: [资产-后台]
 *     summary: 资产详情
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
 *         description: 资产详情
 */
authRouter.post(
  "/detail",
  assetController.validateBody(AssetIdDto),
  wrapAsync(assetController.detail),
);

/**
 * @openapi
 * /api/admin/asset/update:
 *   post:
 *     tags: [资产-后台]
 *     summary: 更新资产元数据
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
 *               title:   { type: string }
 *               alt:     { type: string }
 *               albumId: { type: number }
 *               sort:    { type: number }
 *     responses:
 *       200:
 *         description: 更新成功
 */
authRouter.post(
  "/update",
  assetController.validateBody(UpdateAssetDto),
  wrapAsync(assetController.update),
);

/**
 * @openapi
 * /api/admin/asset/delete:
 *   post:
 *     tags: [资产-后台]
 *     summary: 删除资产（软删除）
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
  assetController.validateBody(AssetIdDto),
  wrapAsync(assetController.delete),
);

/* ═══════ 相册 ═══════ */

/**
 * @openapi
 * /api/admin/asset/album/create:
 *   post:
 *     tags: [相册-后台]
 *     summary: 创建相册
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:     { type: string }
 *               parentId: { type: number, description: "父相册 ID" }
 *               sort:     { type: number, default: 0 }
 *     responses:
 *       200:
 *         description: 创建成功
 */
authRouter.post(
  "/album/create",
  assetController.validateBody(CreateAlbumDto),
  wrapAsync(assetController.createAlbum),
);

/**
 * @openapi
 * /api/admin/asset/album/update:
 *   post:
 *     tags: [相册-后台]
 *     summary: 更新相册
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:       { type: number }
 *               name:     { type: string }
 *               parentId: { type: number }
 *               sort:     { type: number }
 *     responses:
 *       200:
 *         description: 更新成功
 */
authRouter.post(
  "/album/update",
  assetController.validateBody(UpdateAlbumDto),
  wrapAsync(assetController.updateAlbum),
);

/**
 * @openapi
 * /api/admin/asset/album/delete:
 *   post:
 *     tags: [相册-后台]
 *     summary: 删除相册
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
  "/album/delete",
  assetController.validateBody(AlbumIdDto),
  wrapAsync(assetController.deleteAlbum),
);

/**
 * @openapi
 * /api/admin/asset/album/list:
 *   post:
 *     tags: [相册-后台]
 *     summary: 相册列表（分页）
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
 *         description: 相册列表
 */
authRouter.post(
  "/album/list",
  assetController.validateBody(AlbumListDto),
  wrapAsync(assetController.listAlbums),
);

/**
 * @openapi
 * /api/admin/asset/album/all:
 *   post:
 *     tags: [相册-后台]
 *     summary: 全部相册（下拉选择用）
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: 全部相册
 */
authRouter.post("/album/all", wrapAsync(assetController.allAlbums));

router.use(authRouter);
export default router;
