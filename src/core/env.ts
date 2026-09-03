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
};

export function useRuntimeConfig(): RuntimeConfig {
  return { ...defaultEnv, ...process.env } as unknown as RuntimeConfig;
}
