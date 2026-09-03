import { BaseController, businessCode } from "@/core";
import { authService } from "@/service/auth";
import { generateToken } from "@/middleware/jwt";
import { useRuntimeConfig } from "@/core";
import { Request, Response } from "express";

export class AuthController extends BaseController {
  /**
   * 用户注册
   */
  register = async (req: Request, res: Response) => {
    const config = useRuntimeConfig();

    if (config.NODE_ENV === "production" && config.REGISTER_ENABLED !== "true") {
      this.response(res, businessCode.Error, null, {
        message: "当前环境不允许注册",
        mode: "error",
      });
      return;
    }

    const result = await authService.register(req.body);

    if (!result.success) {
      this.response(res, businessCode.Duplicate, null, {
        message: result.message,
        mode: "error",
      });
      return;
    }

    this.response(res, businessCode.Create, result, {
      message: "注册成功",
    });
  };

  /**
   * 用户登录
   */
  login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const result = await authService.login(username, password);

    if (!result.success || !result.data) {
      this.response(res, businessCode.Error, null, {
        message: result.message,
        mode: "error",
      });
      return;
    }

    const token = generateToken({
      userId: result.data.id,
      username: result.data.username,
      role: result.data.role,
    });

    this.response(
      res,
      businessCode.Success,
      {
        user: result.data,
        token,
      },
      {
        message: "登录成功",
      },
    );
  };

  /**
   * 获取当前用户信息
   */
  userInfo = async (req: Request, res: Response) => {
    const user = await authService.getUserInfo(req.user!.userId);

    if (!user) {
      this.response(res, businessCode.NotFound, null, {
        message: "用户不存在",
        mode: "error",
      });
      return;
    }

    this.response(res, businessCode.Success, user, {
      message: "获取用户信息成功",
    });
  };
}

export const authController = new AuthController();
