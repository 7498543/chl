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
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 文件
 *               title:
 *                 type: string
 *                 description: 标题
 *               alt:
 *                 type: string
 *                 description: 替代文本
 *               albumId:
 *                 type: integer
 *                 description: 资产册 ID
 *               sort:
 *                 type: integer
 *                 default: 0
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/SuccessResponse"
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
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: "#/components/schemas/Pagination"
 *               - type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     description: 按类型过滤
 *                   albumId:
 *                     type: integer
 *                     description: 按资产册过滤
 *                   title:
 *                     type: string
 *                     description: 按标题模糊搜索
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/SuccessResponse"
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
 *               id:
 *                 type: integer
 *               title:
 *                 type: string
 *               alt:
 *                 type: string
 *               albumId:
 *                 type: integer
 *               sort:
 *                 type: integer
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/SuccessResponse"
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
 *     summary: 删除资产
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
  assetController.validateBody(AssetIdDto),
  wrapAsync(assetController.delete),
);

/* ═══════ 资产册 ═══════ */

/**
 * @openapi
 * /api/admin/asset/album/create:
 *   post:
 *     tags: [资产册-后台]
 *     summary: 创建资产册
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 description: 资产册名称
 *               parentId:
 *                 type: integer
 *                 description: 父资产册 ID
 *               sort:
 *                 type: integer
 *                 default: 0
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/SuccessResponse"
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
 *     tags: [资产册-后台]
 *     summary: 更新资产册
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
 *               parentId:
 *                 type: integer
 *               sort:
 *                 type: integer
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/SuccessResponse"
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
 *     tags: [资产册-后台]
 *     summary: 删除资产册
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
  "/album/delete",
  assetController.validateBody(AlbumIdDto),
  wrapAsync(assetController.deleteAlbum),
);

/**
 * @openapi
 * /api/admin/asset/album/list:
 *   post:
 *     tags: [资产册-后台]
 *     summary: 资产册列表
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
 *                     description: 按名称搜索
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/SuccessResponse"
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
 *     tags: [资产册-后台]
 *     summary: 全部资产册（下拉选择用）
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/SuccessResponse"
 */
authRouter.post("/album/all", wrapAsync(assetController.allAlbums));

router.use(authRouter);
export default router;
