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
};

export function useRuntimeConfig(): RuntimeConfig {
  return { ...defaultEnv, ...process.env } as unknown as RuntimeConfig;
}
