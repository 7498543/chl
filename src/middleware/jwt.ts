import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { HttpError } from "@/utils/httpError";
import { JWTPayload } from "@/types/express";



const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

/**
 * 生成 JWT Token
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

/**
 * 验证 JWT Token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * JWT 鉴权中间件
 */
export function jwtAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new HttpError("未授权，请先登录", 401);
  }

  const token = authHeader.slice(7);
  const payload = verifyToken(token);

  if (!payload) {
    throw new HttpError("Token 无效或已过期", 401);
  }

  req.user = payload;
  next();
}
