import express from "express";
import { userController } from "@/controller/user";
import { wrapAsync } from "@/middleware/errorHandler";
import { jwtAuth } from "@/middleware/jwt";
import { CreateUserDto } from "@/dto/user.dto";
import { authController } from "@/controller/auth";

const router = express.Router();

const authRouter = express.Router();

// 权限路由
authRouter.use(jwtAuth);

/**
 * @openapi
 * /api/admin/user/create:
 *   post:
 *     tags: [用户管理]
 *     summary: 创建用户
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, username, nickname, password]
 *             properties:
 *               email: { type: string, description: "邮箱" }
 *               username: { type: string, description: "用户名" }
 *               nickname: { type: string, description: "昵称" }
 *               password: { type: string, description: "密码" }
 *               role: { type: string, enum: [user, admin], default: user, description: "角色" }
 *               enabled: { type: number, default: 1, description: "是否启用 0/1" }
 *     responses:
 *       200:
 *         description: 创建成功
 */
authRouter.post(
  "/create",
  userController.validateBody(CreateUserDto),
  wrapAsync(userController.createUser),
);

/**
 * @openapi
 * /api/admin/user/info:
 *   get:
 *     tags: [用户管理]
 *     summary: 获取当前登录用户信息
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 获取成功
 */
authRouter.get("/info", wrapAsync(authController.userInfo));

router.use(authRouter);
export default router;
