import dotenv from "dotenv";

dotenv.config();

interface RuntimeConfig {
  PORT: string;
  NODE_ENV: string;
  DB_HOST: string;
  DB_PORT: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DATABASE_URL: string;
  UPLOAD_DIR: string;
  /** 是否启用 Swagger API 文档（生产环境建议关闭） */
  SWAGGER_ENABLED: string;
  /** JWT 密钥 */
  JWT_SECRET: string;
  /** 是否开放注册（生产环境建议关闭） */
  REGISTER_ENABLED: string;
  /** Redis 连接地址 */
  REDIS_HOST: string;
  /** Redis 端口 */
  REDIS_PORT: string;
  /** Redis 密码 */
  REDIS_PASSWORD: string;
  /** Redis 数据库编号 */
  REDIS_DB: string;
  /** Redis 是否启用 */
  REDIS_ENABLED: string;
}

const defaultEnv: Partial<RuntimeConfig> = {
  PORT: "3000",
  NODE_ENV: "development",
  DB_HOST: "localhost",
  DB_PORT: "5432",
  DB_USER: "postgres",
  DB_PASSWORD: "postgres",
  DB_NAME: "chl",
  DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/chl",
  UPLOAD_DIR: "./uploads",
  SWAGGER_ENABLED: "true",
  JWT_SECRET: "chl-jwt-secret-dev-2026",
  REGISTER_ENABLED: "true",
  REDIS_HOST: "127.0.0.1",
  REDIS_PORT: "6379",
  REDIS_PASSWORD: "",
  REDIS_DB: "0",
  REDIS_ENABLED: "false",
};

export function useRuntimeConfig(): RuntimeConfig {
  return { ...defaultEnv, ...process.env } as unknown as RuntimeConfig;
}
