import { Request, Response, NextFunction } from "express";
import { HttpError } from "@/utils/httpError";
import { logger, baseController, businessCode } from "@/core";

// 包装 async controller，自动捕获异常
export const wrapAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error(err);
  if (err instanceof HttpError) {
    return baseController.standardResponse(
      res,
      err.code,
      businessCode.Error,
      {},
      { message: err.message },
    );
  }
  return baseController.standardResponse(
    res,
    500,
    businessCode.INTERNAL_ERROR,
    {},
    { message: "服务器内部错误" },
  );
}
