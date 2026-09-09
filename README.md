# CHL API — 后端服务

基于 **Express 5 + TypeScript 6 + Drizzle ORM + PostgreSQL** 的企业级后端 API 服务。

## 技术栈

| 类别   | 选型                       | 说明                             |
| ------ | -------------------------- | -------------------------------- |
| 运行时 | Node.js + TypeScript 6     | 类型安全，`tsx` 开发模式热重载   |
| 框架   | Express 5                  | 新一代 Express，支持异步错误处理 |
| 数据库 | PostgreSQL + Drizzle ORM   | 类型安全的 SQL ORM，自动迁移     |
| 缓存   | Redis (ioredis)            | 支持 Mock 模式，可开关           |
| 校验   | Zod 4                      | DTO 校验，运行时类型安全         |
| 日志   | Winston                    | 结构化日志，支持彩色输出         |
| 鉴权   | JWT (jsonwebtoken)         | Bearer Token，7 天有效期         |
| 文档   | Swagger (OpenAPI 3.0)      | 自动生成 API 文档                |
| 部署   | PM2                        | 进程管理，cluster 模式，优雅关闭 |
| 安全   | Helmet + Rate Limit + CORS | HTTP 安全头，限流，跨域          |

## 目录结构

```
src/
├── app.ts                    # Express 应用（中间件/路由挂载）
├── index.ts                  # 入口（HTTP 服务启动/优雅关闭）
├── core/                     # 核心基础设施
│   ├── index.ts              #   统一导出
│   ├── env.ts                #   环境变量配置（多环境 .env 加载）
│   ├── logger.ts             #   日志系统（Winston + 路由日志）
│   ├── controller.ts         #   基类控制器（统一响应/校验/业务码）
│   ├── service.ts            #   基类服务（DB/Redis 访问/软删除）
│   ├── swagger.ts            #   Swagger 文档配置（自动扫描路由）
│   ├── sys.ts                #   系统信息（IP/CPU/内存/异常捕获）
│   ├── upload.ts             #   文件上传（Multer 配置）
│   ├── db/                   #   数据库层
│   │   ├── index.ts          #     DB 连接池管理（多实例）
│   │   ├── pg.ts             #     PostgreSQL 连接（Drizzle 封装）
│   │   ├── tool.ts           #     表辅助工具（时间戳/软删除/排序）
│   │   ├── softDelete.ts     #     软删除工具函数
│   │   └── schema/           #     数据表定义
│   │       ├── index.ts      #       统一导出
│   │       ├── sys.ts        #       用户表 (user)
│   │       ├── article.ts    #       文章/分类/标签/关联表
│   │       └── asset.ts      #       资源/附件表
│   └── redis/                #   缓存层
│       ├── index.ts          #     Redis 实例管理 + CacheClient 工具
│       ├── adapter.ts        #     Redis 适配器接口
│       ├── ioredis.ts        #     ioredis 实现
│       └── mock.ts           #     Mock 实现（Redis 关闭时使用）
├── middleware/                # 中间件
│   ├── jwt.ts                #   JWT 生成/验证/鉴权中间件
│   └── errorHandler.ts       #   全局错误处理 + async 包装器
├── routes/                   # 路由层
│   ├── index.ts              #   路由入口（自动扫描 router/ 目录）
│   └── router/               #   路由定义
│       ├── index.ts          #     API 根路由
│       ├── auth.ts           #     /api/auth/*（登录/注册）
│       ├── article.ts        #     /api/article/*（文章/分类/标签）
│       └── admin/            #     后台管理路由
│           └── user.ts       #     /api/admin/user/*（用户管理）
├── controller/               # 控制器（请求处理）
│   ├── auth.ts               #   认证（登录/注册/用户信息）
│   ├── article.ts            #   文章（列表/详情/分类/标签）
│   └── user.ts               #   用户管理（创建用户）
├── service/                  # 业务逻辑层
│   ├── auth.ts               #   注册/登录/用户信息查询
│   ├── article.ts            #   文章/分类/标签 CRUD
│   └── user.ts               #   用户创建
├── dto/                      # 数据校验（Zod 模式）
│   ├── auth.dto.ts           #   登录/注册 DTO
│   ├── user.dto.ts           #   创建用户 DTO
│   ├── article.dto.ts        #   文章相关 DTO
│   └── common.ts             #   通用分页 DTO
├── types/                    # 类型定义
│   └── express.ts            #   Express Request 扩展（user 属性）
├── utils/                    # 工具
│   ├── httpError.ts          #   自定义 HTTP 错误类
│   └── request.ts            #   HTTP 客户端（重试/签名/日志/Token 管理）
├── .env                      # 环境变量（不提交）
├── .env.example              # 环境变量模板
├── drizzle.config.ts         # Drizzle Kit 配置
├── tsconfig.json             # TypeScript 配置
├── ecosystem.config.js       # PM2 部署配置
└── package.json
```

## 快速开始

```bash
# 安装依赖
yarn install

# 复制环境变量
cp .env.example .env

# 启动 PostgreSQL（Docker 可选）
docker run -d --name chl-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=chl \
  -p 5432:5432 \
  postgres:16

# 生成数据库迁移
yarn db:generate

# 执行迁移
yarn db:migrate

# 启动开发服务器（热重载）
yarn dev
```

服务启动后访问：

- API: `http://localhost:3000/api`
- Swagger 文档: `http://localhost:3000/api-docs`
- JSON 接口文档: `http://localhost:3000/api-docs.json`

## 项目架构

### 分层架构

```
┌──────────────┐  路由层  routes/    定义 URL 映射、挂载中间件
├──────────────┤  控制器  controller/ 参数校验、调用 Service、返回响应
├──────────────┤  业务层  service/    核心业务逻辑、数据库操作
├──────────────┤  数据层  core/db/    Drizzle ORM、Schema 定义
└──────────────┘  缓存层  core/redis/  Redis 缓存封装
```

### 请求生命周期

```
请求 → Helmet/CORS → Rate Limit → 路由日志 → JSON 解析 → JWT 鉴权
  → 路由匹配 → DTO 校验 → 控制器 → 服务层 → 数据库/Redis
  → 统一响应 → 返回
```

### 核心设计

| 概念             | 说明                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------- |
| **统一响应格式** | `{ code, data, message: { show, mode, message, timestamp } }`                          |
| **业务状态码**   | `Success(0)`, `Error(-1)`, `Warning(-2)`, `NotFound(-3)`, `Duplicate(-4)`, `Create(1)` |
| **软删除**       | 所有表默认包含 `deletedAt` 字段，查询自动过滤已删除记录                                |
| **自动时间戳**   | 所有表自动维护 `createdAt` / `updatedAt`                                               |
| **异步错误处理** | `wrapAsync` 包装器 + 全局 `errorHandler` 中间件                                        |

## 路由

### 公开路由

| 方法 | 路径                         | 说明             |
| ---- | ---------------------------- | ---------------- |
| GET  | `/api`                       | API 根路径       |
| POST | `/api/auth/register`         | 用户注册         |
| POST | `/api/auth/login`            | 用户登录         |
| GET  | `/api/article/list`          | 获取文章列表     |
| GET  | `/api/article/detail`        | 获取文章详情     |
| GET  | `/api/article/category/list` | 获取文章分类列表 |
| GET  | `/api/article/tag/list`      | 获取标签列表     |

### 需鉴权路由

| 方法 | 路径                     | 说明             |
| ---- | ------------------------ | ---------------- |
| GET  | `/api/admin/user/info`   | 获取当前用户信息 |
| POST | `/api/admin/user/create` | 创建用户（后台） |

### 路由自动扫描

路由文件放在 `src/routes/router/` 下，系统自动扫描加载。文件路径映射为路由路径：

```
src/routes/router/auth.ts          → /api/auth
src/routes/router/article.ts       → /api/article
src/routes/router/admin/user.ts    → /api/admin/user
```

## 数据表

### 用户表 `user`

| 字段        | 类型                 | 说明                   |
| ----------- | -------------------- | ---------------------- |
| id          | serial               | 主键                   |
| email       | text (unique)        | 邮箱                   |
| username    | text (unique)        | 用户名                 |
| nickname    | text                 | 昵称                   |
| password    | text                 | 密码（bcrypt 加密）    |
| avatar      | text                 | 头像 URL               |
| role        | text (default: user) | 角色：`user` / `admin` |
| enabled     | integer              | 是否启用：`0` / `1`    |
| lastLoginAt | timestamp            | 最后登录时间           |
| createdAt   | timestamp            | 创建时间               |
| updatedAt   | timestamp            | 更新时间               |
| deletedAt   | timestamp            | 软删除时间             |

### 文章表 `article`

| 字段        | 类型         | 说明             |
| ----------- | ------------ | ---------------- |
| id          | serial       | 主键             |
| title       | text         | 标题             |
| description | text         | 摘要             |
| content     | text         | 内容（Markdown） |
| userId      | integer (FK) | 作者 ID          |
| categoryId  | integer (FK) | 分类 ID          |
| sort        | integer      | 排序             |
| enabled     | integer      | 启用状态         |
| createdAt   | timestamp    | 创建时间         |
| updatedAt   | timestamp    | 更新时间         |
| deletedAt   | timestamp    | 软删除时间       |

### 其他表

| 表名               | 说明                    |
| ------------------ | ----------------------- |
| `article_category` | 文章分类                |
| `tag`              | 标签                    |
| `article_tag`      | 文章-标签关联（多对多） |
| `asset`            | 资源/附件               |

## 环境变量

| 变量               | 默认值                                              | 说明                                                        |
| ------------------ | --------------------------------------------------- | ----------------------------------------------------------- |
| `PORT`             | `3000`                                              | 服务器端口                                                  |
| `NODE_ENV`         | `development`                                       | 运行环境：`development` / `production` / `staging` / `test` |
| `DATABASE_URL`     | `postgresql://postgres:postgres@localhost:5432/chl` | 数据库连接 URL                                              |
| `DB_HOST`          | `localhost`                                         | 数据库主机                                                  |
| `DB_PORT`          | `5432`                                              | 数据库端口                                                  |
| `DB_USER`          | `postgres`                                          | 数据库用户                                                  |
| `DB_PASSWORD`      | `postgres`                                          | 数据库密码                                                  |
| `DB_NAME`          | `chl`                                               | 数据库名称                                                  |
| `JWT_SECRET`       | `chl-jwt-secret-dev-2026`                           | JWT 签名密钥                                                |
| `UPLOAD_DIR`       | `./uploads`                                         | 文件上传目录                                                |
| `SWAGGER_ENABLED`  | `true`                                              | 是否启用 Swagger 文档                                       |
| `REGISTER_ENABLED` | `true`                                              | 是否开放注册                                                |
| `REDIS_ENABLED`    | `false`                                             | 是否启用 Redis                                              |
| `REDIS_HOST`       | `127.0.0.1`                                         | Redis 主机                                                  |
| `REDIS_PORT`       | `6379`                                              | Redis 端口                                                  |
| `REDIS_PASSWORD`   | —                                                   | Redis 密码                                                  |
| `REDIS_DB`         | `0`                                                 | Redis 数据库编号                                            |

## 部署

### PM2 部署

```bash
# 构建
yarn build

# 开发环境启动
yarn pm2:start

# 生产环境启动（4 实例 cluster 模式）
yarn pm2:start:prod

# 查看状态
yarn pm2:status

# 查看日志
yarn pm2:logs

# 重启
yarn pm2:restart

# 停止
yarn pm2:stop
```

### 多环境配置

```bash
# 按环境加载 .env.{NODE_ENV} 文件
# 默认加载 .env
# 生产环境加载 .env.production
# 预发布环境加载 .env.staging

# 启动指定环境
pm2 start ecosystem.config.js --env production
```

### 优雅关闭

服务收到 `SIGTERM` / `SIGINT` 信号后：

1. 停止接受新请求
2. 等待已有请求完成（最多 10 秒）
3. 关闭数据库连接池
4. 进程退出

## 数据库迁移

```bash
# 修改 Schema 后生成迁移文件
yarn db:generate

# 执行迁移（应用到数据库）
yarn db:migrate

# 启动 Drizzle Studio（可视化数据管理）
yarn db:studio
```

## 开发规范

1. **分层职责**：Controller 只做参数校验和响应，Service 只做业务逻辑，不混用
2. **DTO 校验**：所有请求参数必须通过 Zod DTO 校验，禁止直接使用 `req.body` 原始值
3. **错误处理**：业务错误使用 `HttpError` 抛出，由全局 `errorHandler` 统一处理
4. **软删除**：查询数据时始终使用 `this.notDeleted()` 过滤已删除记录
5. **类型安全**：数据库查询结果使用 Schema 的 `$inferSelect` / `$inferInsert` 类型
6. **日志分级**：`logger.info` / `logger.warn` / `logger.error` 按场景使用
7. **Swagger 文档**：路由定义时同步编写 `@openapi` 注释，保证文档一致性
8. **密码安全**：密码使用 `bcryptjs` 加盐哈希（saltRounds=10），禁止明文存储
