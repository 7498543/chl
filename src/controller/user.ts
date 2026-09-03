import { BaseController, businessCode } from "@/core";
import { userService } from "@/service/user";
import { Request, Response } from "express";

export class UserController extends BaseController {
  /**
   * 创建用户（后台）
   */
  createUser = async (req: Request, res: Response) => {
    const result = await userService.createUser(req.body);

    if (!result.success) {
      this.response(res, businessCode.Duplicate, null, {
        message: result.message,
        mode: "error",
      });
      return;
    }

    this.response(res, businessCode.Create, result.data, {
      message: "创建用户成功",
    });
  };
}

export const userController = new UserController();
