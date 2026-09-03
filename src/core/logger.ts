import { createLogger, format, transports } from "winston";
import type { Request, Response, NextFunction } from "express";

const { combine, timestamp, printf, colorize, json } = format;

const consoleFormat = printf(({ level, message, timestamp, ...meta }) => {
  const ctx = meta[Symbol.for("splat")] as unknown[] | undefined;
  const extra = ctx && ctx.length ? ` ${JSON.stringify(ctx[0])}` : "";
  return `${timestamp} [${level}]: ${message}${extra}`;
});

export const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), json()),
  transports: [
    new transports.Console({
      format: combine(colorize(), consoleFormat),
    }),
  ],
});

export const dbLogger = {
  logQuery(query: string, params: unknown[]): void {
    logger.info(`[DB] ${query}`, { params, type: "database" });
  },
};

export function routeLogger(req: Request, _res: Response, next: NextFunction): void {
  const start = Date.now();
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const userAgent = req.headers["user-agent"] || "unknown";
  const method = req.method;
  const path = req.originalUrl;

  _res.on("finish", () => {
    const duration = Date.now() - start;
    const status = _res.statusCode;
    logger.info(`[ROUTE] ${method} ${path} → ${status} (${duration}ms)`, {
      ip,
      userAgent,
      type: "route",
    });
  });

  next();
}

export default logger;
