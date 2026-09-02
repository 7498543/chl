import env from "dotenv";

env.config();

interface RuntimeConfig extends NodeJS.ProcessEnv {
  PORT: string;
}

const defaultEnv: RuntimeConfig = {
  PORT: "3000",
};


/**
 * 获取运行时配置
 * @returns 运行时配置
*/ 
export function useRuntimeConfig(): RuntimeConfig {
  return { ...defaultEnv, ...process.env } as RuntimeConfig;
}
