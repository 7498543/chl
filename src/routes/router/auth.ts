import { authController } from "@/controller/auth";
import { LoginDto, RegisterDto } from "@/dto/auth.dto";
import { wrapAsync } from "@/middleware/errorHandler";
import express from "express";

const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [认证管理]
 *     summary: 用户注册
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, username, nickname, password]
 *             properties:
 *               email:
 *                 type: string
 *                 description: 邮箱
 *               username:
 *                 type: string
 *                 description: 用户名
 *               nickname:
 *                 type: string
 *                 description: 昵称
 *               password:
 *                 type: string
 *                 description: 密码
 *                 format: password
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/SuccessResponse"
 */
router.post(
  "/register",
  authController.validateBody(RegisterDto),
  wrapAsync(authController.register),
);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [认证管理]
 *     summary: 用户登录
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 description: 用户名
 *               password:
 *                 type: string
 *                 description: 密码
 *                 format: password
 *     responses:
 *       "200":
 *         $ref: "#/components/responses/SuccessResponse"
 */
router.post("/login", authController.validateBody(LoginDto), wrapAsync(authController.login));

export default router;
