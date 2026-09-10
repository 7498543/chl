import { pageController } from "@/controller/sys";
import { CreatePageDto, PageIdDto, PageListDto, UpdatePageDto } from "@/dto/sys.dto";
import { wrapAsync } from "@/middleware/errorHandler";
import { jwtAuth } from "@/middleware/jwt";
import express from "express";

const router = express.Router();
const authRouter = express.Router();

authRouter.use(jwtAuth);

/**
 * @openapi
 * /api/admin/page/create:
 *   post:
 *     tags: [页面-后台]
 *     summary: 创建页面
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug, content]
 *             properties:
 *               name:
 *                 type: string
 *                 description: 页面名称
 *               slug:
 *                 type: string
 *                 description: 路由标识
 *               content:
 *                 type: object
 *                 description: 页面内容
 *               siteVersionId:
 *                 type: integer
 *                 description: 绑定版本 ID
 *               enabled:
 *                 $ref: "#/components/schemas/Enabled"
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/SuccessResponse"
 */
authRouter.post(
  "/create",
  pageController.validateBody(CreatePageDto),
  wrapAsync(pageController.create),
);

/**
 * @openapi
 * /api/admin/page/update:
 *   post:
 *     tags: [页面-后台]
 *     summary: 更新页面
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
 *               content:
 *                 type: object
 *               siteVersionId:
 *                 type: integer
 *               enabled:
 *                 $ref: "#/components/schemas/Enabled"
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/SuccessResponse"
 */
authRouter.post(
  "/update",
  pageController.validateBody(UpdatePageDto),
  wrapAsync(pageController.update),
);

/**
 * @openapi
 * /api/admin/page/delete:
 *   post:
 *     tags: [页面-后台]
 *     summary: 删除页面
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
  pageController.validateBody(PageIdDto),
  wrapAsync(pageController.delete),
);

/**
 * @openapi
 * /api/admin/page/list:
 *   post:
 *     tags: [页面-后台]
 *     summary: 页面列表
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
 *                   slug:
 *                     type: string
 *                     description: 按路由搜索
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/SuccessResponse"
 */
authRouter.post("/list", pageController.validateBody(PageListDto), wrapAsync(pageController.list));

/**
 * @openapi
 * /api/admin/page/detail:
 *   post:
 *     tags: [页面-后台]
 *     summary: 页面详情
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
  pageController.validateBody(PageIdDto),
  wrapAsync(pageController.detail),
);

router.use(authRouter);
export default router;
