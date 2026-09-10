import { BaseController, businessCode, logger } from "@/core";
import { HttpError } from "@/utils/httpError";
import { NextFunction, Request, Response } from "express";

const baseController = new BaseController();

// 包装 async controller，自动捕获异常
export const wrapAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  logger.error(`[Error] ${err.message || err.name || "未知错误"}`, {
    stack: err.stack,
    name: err.name,
    code: (err as any).code,
    cause: (err as any).cause,
  });

  if (err instanceof HttpError) {
    return baseController.standardResponse(res, err.code, businessCode.Error, null, {
      message: err.message,
      mode: "error",
    });
  }

  return baseController.response(res, businessCode.Error, null, {
    message: process.env.NODE_ENV === "production" ? "服务器内部错误" : err.message || "未知错误",
    mode: "error",
  });
}
