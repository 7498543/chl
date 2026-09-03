import type { ZodObject, ZodSafeParseResult, ZodType } from "zod";
import type { NextFunction, Response, Request } from "express";

interface Message {
  message: string;
  mode: "success" | "error" | "warning";
  show: boolean;
  timestamp: string;
}

export enum businessCode {
  Create = 1,
  Success = 0,
  Error = -1,
  Warning = -2,
  NotFound = -3,
  Duplicate = -4,
}

export class BaseController {
  /**
   * 校验数据
   * @description 校验数据是否符合校验规则
   * @param schema 校验规则
   * @param data 数据
   * @returns 校验结果
   */
  validate(schema: ZodType, data: any): ZodSafeParseResult<any> {
    return schema.safeParse(data);
  }

  /**
   * 校验请求体
   * @description 校验请求体是否符合校验规则
   * @param schema 校验规则
   * @returns 校验结果
   */
  validateBody(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction) => {
      const result = this.validate(schema, req.body);
      if (!result.success) {
        this.errorResult(res, {
          message: result.error.issues.map((issue) => issue.message).join("\n"),
        });
        return;
      }
      (req as any).body = result.data;
      next();
    };
  }

  /**
   * 标准响应
   * @description 接口标准响应返回格式
   * @param res 响应对象
   * @param businessCode 业务码
   * @param data 数据
   * @param message 消息
   */
  response(res: Response, businessCode: businessCode, data: any, message: Partial<Message>) {
    res.status(200).json({
      businessCode,
      data,
      message: {
        show: message.show ?? true,
        mode: message.mode ?? "success",
        message: message.message ?? "",
        timestamp: new Date().toISOString(),
      } as Message,
    });
  }

  /**
   * 错误响应
   * @description 接口错误响应返回格式
   * @param res 响应对象
   * @param message 消息
   */
  errorResult(res: Response, message: Partial<Message>) {
    this.response(res, businessCode.Error, null, {
      ...message,
      mode: "error",
    });
  }

  /**
   * 成功响应
   * @description 接口成功响应返回格式
   * @param res 响应对象
   * @param message 消息
   */
  successResult(res: Response, message: Partial<Message>) {
    this.response(res, businessCode.Success, null, {
      ...message,
      mode: "success",
    });
  }
}
