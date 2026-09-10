import express from "express";

const router = express.Router();

/**
 * @openapi
 * components:
 *   # ─── 通用枚举 ─────────────────────────────────────
 *   schemas:
 *     BusinessCode:
 *       type: integer
 *       description: "业务状态码"
 *       enum: [1, 0, -1, -2, -3, -4, -5]
 *       x-enum-varnames: [Create, Success, Error, Warning, NotFound, Duplicate, INTERNAL_ERROR]
 *
 *     MessageMode:
 *       type: string
 *       enum: [success, error, warning]
 *       description: "消息模式"
 *
 *     Message:
 *       type: object
 *       description: "消息体（对应 BaseController.response 的 message 字段）"
 *       required: [show, mode, message, timestamp]
 *       properties:
 *         show:
 *           type: boolean
 *           description: "是否展示消息"
 *           example: true
 *         mode:
 *           $ref: "#/components/schemas/MessageMode"
 *         message:
 *           type: string
 *           description: "提示文本"
 *           example: "操作成功"
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: "响应时间戳"
 *           example: "2026-09-10T15:45:36.000Z"
 *
 *     # ─── 标准响应包装 ────────────────────────────────
 *     ApiResponse:
 *       type: object
 *       description: "标准 API 响应体（对应 BaseController.standardResponse 返回值）"
 *       required: [code, data, message]
 *       properties:
 *         code:
 *           $ref: "#/components/schemas/BusinessCode"
 *         data:
 *           type: object
 *           nullable: true
 *           description: "业务数据（具体结构由各接口定义）"
 *         message:
 *           $ref: "#/components/schemas/Message"
 *
 *     # ─── 通用业务字段 ────────────────────────────────
 *     Enabled:
 *       type: integer
 *       description: "是否启用：0 禁用 / 1 启用"
 *       enum: [0, 1]
 *       example: 1
 *
 *     Pagination:
 *       type: object
 *       description: "分页参数（所有字段可选，默认第 1 页每页 10 条）"
 *       properties:
 *         page:
 *           type: integer
 *           description: "页码"
 *           minimum: 1
 *           example: 1
 *           default: 1
 *         pageSize:
 *           type: integer
 *           description: "每页条数"
 *           minimum: 1
 *           maximum: 100
 *           example: 10
 *           default: 10
 *
 *     IdParam:
 *       type: object
 *       required: [id]
 *       properties:
 *         id:
 *           type: integer
 *           description: "ID"
 *           minimum: 1
 *           example: 1
 *
 *     # ─── 分页响应 ────────────────────────────────────
 *     PaginatedData:
 *       type: object
 *       description: "分页响应数据"
 *       properties:
 *         list:
 *           type: array
 *           items:
 *             type: object
 *           description: "数据列表"
 *         total:
 *           type: integer
 *           description: "总记录数"
 *           example: 100
 *         page:
 *           type: integer
 *           description: "当前页码"
 *           example: 1
 *         pageSize:
 *           type: integer
 *           description: "每页条数"
 *           example: 10
 *
 *   # ─── 标准响应引用 ──────────────────────────────────
 *   responses:
 *     SuccessResponse:
 *       description: "操作成功"
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ApiResponse"
 *
 *     ErrorResponse:
 *       description: "操作失败"
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: "#/components/schemas/ApiResponse"
 *               - type: object
 *                 properties:
 *                   code:
 *                     enum: [-1, -2, -3, -4, -5]
 *                   data:
 *                     nullable: true
 *                     example: null
 *
 *     ValidationError:
 *       description: "参数校验失败"
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: "#/components/schemas/ApiResponse"
 *               - type: object
 *                 properties:
 *                   code:
 *                     example: -1
 *                   data:
 *                     nullable: true
 *                     example: null
 *                   message:
 *                     properties:
 *                       mode:
 *                         example: error
 *                       message:
 *                         type: string
 *                         example: "参数校验失败"
 */

/**
 * @openapi
 * /api:
 *   get:
 *     tags: [基础]
 *     summary: API 根路由
 *     responses:
 *       200:
 *         description: API 服务正常运行
 */
router.get("/", (_, res) => {
  res.json({ message: "API service is running" });
});

export default router;
