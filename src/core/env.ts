import dotenv from "dotenv";

let env = process.env.NODE_ENV;

process.argv.forEach((arg) => {
  if (arg.startsWith("--env")) {
    env = arg.split("--env=")[1] || "development";
  }
});

// 优先加载环境特定文件（如 .env.development），不存在则回退到 .env
const envPath = env ? `.env.${env}` : ".env";
const { parsed, error } = dotenv.config({ path: envPath });

// 如果指定了环境文件但没加载到内容，回退到 .env
if (!parsed && env && !error) {
  dotenv.config({ path: ".env" });
}

interface RuntimeConfig {
  /** 服务器端口 */
  PORT: string;
  /** 运行环境：development | production | staging | test */
  NODE_ENV: string;
  /** 数据库主机 */
  DB_HOST: string;
  /** 数据库端口 */
  DB_PORT: string;
  /** 数据库用户 */
  DB_USER: string;
  /** 数据库密码 */
  DB_PASSWORD: string;
  /** 数据库名称 */
  DB_NAME: string;
  /** 数据库连接 URL */
  DATABASE_URL: string;
  /** 文件上传目录 */
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

  // ──────────────────────────────────────────────
  // PM2 运行时信息（自动检测，只读）
  // ──────────────────────────────────────────────
  /** 是否运行在 PM2 进程管理器下 */
  IS_PM2: boolean;
  /** PM2 实例编号（cluster 模式下从 0 递增，fork 模式固定为 0） */
  PM2_INSTANCE_ID: number;
  /** PM2 进程 ID（pm_id） */
  PM2_PROCESS_ID: string;
  /** PM2 应用名称（name 字段） */
  PM2_NAME: string;

  // ──────────────────────────────────────────────
  // PM2 配置项（通过环境变量或 ecosystem 文件注入）
  // ──────────────────────────────────────────────
  /** PM2 启动实例数 */
  PM2_INSTANCES: string;
  /** PM2 执行模式：fork | cluster */
  PM2_EXEC_MODE: string;
  /** PM2 内存上限（超过自动重启，如 1G、512M） */
  PM2_MAX_MEMORY: string;
  /** PM2 日志输出目录 */
  PM2_LOG_DIR: string;
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

  // PM2 默认配置
  PM2_INSTANCES: "1",
  PM2_EXEC_MODE: "fork",
  PM2_MAX_MEMORY: "1G",
  PM2_LOG_DIR: "./logs/pm2",
};

export function useRuntimeConfig(): RuntimeConfig {
  const env = { ...process.env } as Record<string, string | undefined>;

  // 检测是否运行在 PM2 下
  // NODE_APP_INSTANCE 是 PM2 cluster 模式自动注入的环境变量
  // pm_id 是 PM2 进程管理内部 ID
  const isPM2 = !!(env.NODE_APP_INSTANCE !== undefined || env.pm_id !== undefined);
  const pm2InstanceId = isPM2 ? parseInt(env.NODE_APP_INSTANCE || "0", 10) : 0;

  // 合并默认值与实际环境变量
  const merged = { ...defaultEnv, ...env } as Record<string, string | undefined>;

  // 如果在 PM2 cluster 模式下，自动偏移端口避免冲突
  // 实例 0 使用 PORT，实例 1 使用 PORT+1，实例 2 使用 PORT+2 ...
  let port = merged.PORT || "3000";
  const execMode = merged.PM2_EXEC_MODE || "fork";
  if (isPM2 && execMode === "cluster" && pm2InstanceId > 0) {
    port = String(parseInt(port, 10) + pm2InstanceId);
  }

  return {
    ...merged,
    PORT: port,
    IS_PM2: isPM2,
    PM2_INSTANCE_ID: pm2InstanceId,
    PM2_PROCESS_ID: env.pm_id || "",
    PM2_NAME: env.name || "",
  } as RuntimeConfig;
}
