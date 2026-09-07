/**
 * PM2 生态系统配置文件
 *
 * 启动方式：
 *   pm2 start ecosystem.config.js              # 使用默认环境（development）
 *   pm2 start ecosystem.config.js --env production  # 生产环境
 *   pm2 start ecosystem.config.js --env staging     # 预发布环境
 *
 * 其他命令：
 *   pm2 status               # 查看进程状态
 *   pm2 logs chl-api         # 查看日志
 *   pm2 restart chl-api      # 重启
 *   pm2 stop chl-api         # 停止
 *   pm2 delete chl-api       # 删除
 *   pm2 monit                # 监控面板
 */
module.exports = {
  apps: [
    {
      // 应用名称
      name: "chl-api",

      // 入口文件（编译后的 JS）
      script: "./dist/index.js",

      // 使用 tsx 直接运行 TypeScript（开发环境）
      // script: "./src/index.ts",
      // interpreter: "tsx",

      // 实例数与执行模式
      instances: 1,
      exec_mode: "fork",

      // 环境变量
      env: {
        NODE_ENV: "development",
        PORT: "3000",
      },

      // 开发环境（pm2 start ecosystem.config.js）
      env_development: {
        NODE_ENV: "development",
        PORT: "3000",
      },

      // 生产环境（pm2 start ecosystem.config.js --env production）
      env_production: {
        NODE_ENV: "production",
        PORT: "3000",
        instances: 4,
        exec_mode: "cluster",
        PM2_MAX_MEMORY: "1G",
      },

      // 预发布环境
      env_staging: {
        NODE_ENV: "staging",
        PORT: "3000",
        instances: 2,
        exec_mode: "cluster",
        PM2_MAX_MEMORY: "1G",
      },

      // ─── 日志配置 ────────────────────────────────────
      error_file: "./logs/pm2/err.log",
      out_file: "./logs/pm2/out.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",

      // ─── 优雅关闭 ────────────────────────────────────
      kill_timeout: 10000,
      listen_timeout: 5000,

      // ─── 自动重启 ────────────────────────────────────
      max_memory_restart: "1G",
      max_restarts: 10,
      restart_delay: 1000,

      // ─── 开发模式下监听文件变化自动重启 ────────────────
      watch: false,
      ignore_watch: ["node_modules", "logs", "dist", ".git", "drizzle"],

      // ─── 其他 ────────────────────────────────────────
      max_env_size: 10, // 环境变量大小限制（KB）
      instance_var: "NODE_APP_INSTANCE", // 实例变量名，用于 cluster 模式区分实例
    },
  ],
};
