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
 *               name:
 *                 type: string
 *                 description: 标签名称
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/SuccessResponse"
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
 *               id:
 *                 type: integer
 *               name:
 *                 type: string
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/SuccessResponse"
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
  wrapAsync(articleController.getAdminTagList),
);

router.use(authRouter);
export default router;
