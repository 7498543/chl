# 项目开发指南

> **核心原则**
>
> 1. **禁止臆想**：所有代码示例、方法名、字段名必须从实际文件中读取确认后方可书写或引用。严禁凭空构造不存在的 API、方法或参数。
> 2. **先问后做**：开发前先确认——是否刚需？是否过度设计？是否有更优的现代解决方案？确认后再编码。
> 3. **开发核心思想**：封装 复用 复合。高频功能封装为工具函数，避免重复实现。

## 技术栈

| 层          | 技术                                                           |
| ----------- | -------------------------------------------------------------- |
| 语言        | TypeScript                                                     |
| 运行时      | Node.js + Express                                              |
| 数据库      | PostgreSQL + [Drizzle ORM](https://orm.drizzle.team)           |
| 缓存        | Redis（适配器模式，支持 ioredis / Mock 切换）                  |
| 校验        | [Zod](https://zod.dev)                                         |
| 文档        | Swagger (OpenAPI 3) via `swagger-jsdoc` + `swagger-ui-express` |
| 文件上传    | Multer + Sharp（图片取尺寸）                                   |
| 日志        | Winston                                                        |
| HTTP 客户端 | Axios（封装重试、签名、日志）                                  |

---

## 目录结构（实际代码）

```
src/
├── core/                    # 核心基础设施
│   ├── db/                  #   ﹣数据库层
│   │   ├── schema/          #   ﹣   ﹣表定义（按模块拆分）
│   │   │   ├── index.ts     #   ﹣   ﹣   ﹣统一导出所有 schema
│   │   │   ├── article.ts   #   ﹣   ﹣   ﹣文章模块表
│   │   │   ├── asset.ts     #   ﹣   ﹣   ﹣资产模块表
│   │   │   └── sys.ts       #   ﹣   ﹣   ﹣系统模块表
│   │   ├── index.ts         #   ﹣   ﹣initDB / getDB / closeDB + schema 导出
│   │   ├── pg.ts            #   ﹣   ﹣initPg() PostgreSQL 连接池 + Drizzle 实例
│   │   ├── tool.ts          #   ﹣   ﹣createSchema / sort / enabled / fk
│   │   └── softDelete.ts    #   ﹣   ﹣notDeleted / softDelete / restore
│   ├── redis/               #   ﹣Redis 适配器架构（策略模式）
│   │   ├── adapter.ts       #   ﹣   ﹣RedisAdapter 接口定义
│   │   ├── ioredis.ts       #   ﹣   ﹣IORedisAdapter（生产实现）
│   │   ├── mock.ts          #   ﹣   ﹣MockRedisAdapter（内存实现，开发调试用）
│   │   └── index.ts         #   ﹣   ﹣initRedis / getRedis / closeRedis / CacheClient / cache
│   ├── controller.ts        #   ﹣BaseController（标准响应方法集）
│   ├── service.ts           #   ﹣BaseService（db / redis / notDeleted / softDelete / restore）
│   ├── env.ts               #   ﹣useRuntimeConfig() 环境配置管理（含 PM2 自动检测）
│   ├── logger.ts            #   ﹣Winston 日志（logger / dbLogger / routeLogger）
│   ├── swagger.ts           #   ﹣Swagger JSDoc 配置（自动扫描路由 + controller）
│   ├── sys.ts               #   ﹣系统工具（getIPV4 / getSysInfo / 进程异常处理）
│   ├── upload.ts            #   ﹣Multer 上传配置（危险文件过滤 + 100MB 上限）
│   └── index.ts             #   ﹣统一导出入口
├── dto/                     # Zod 校验 schema + 类型推导
│   ├── common.ts            #   ﹣公共 DTO（分页 PaginationDto）
│   ├── article.dto.ts       #   ﹣文章模块 DTO
│   ├── asset.dto.ts         #   ﹣资产模块 DTO
│   ├── auth.dto.ts          #   ﹣认证模块 DTO
│   ├── sys.dto.ts           #   ﹣系统模块 DTO
│   └── user.dto.ts          #   ﹣用户模块 DTO
├── controller/              # Express 路由处理函数（继承 BaseController）
│   ├── article.ts
│   ├── asset.ts
│   ├── auth.ts
│   ├── sys.ts
│   └── user.ts
├── service/                 # 业务逻辑层（类 + 单例导出）
│   ├── article.ts
│   ├── asset.ts
│   ├── auth.ts
│   ├── sys.ts
│   └── user.ts
├── routes/                  # 路由定义
│   ├── index.ts             #   ﹣自动扫描 router/ 下所有路由文件并注册 + Swagger UI
│   └── router/              #   ﹣路由文件
│       ├── admin/           #   ﹣管理端接口（需 jwtAuth）
│       │   ├── article/
│       │   │   ├── index.ts      # 文章管理
│       │   │   ├── category.ts   # 分类管理
│       │   │   └── tag.ts        # 标签管理
│       │   ├── asset.ts          # 资产管理
│       │   ├── page.ts           # 页面管理
│       │   ├── seo.ts            # SEO 管理
│       │   ├── site-version.ts   # 站点版本管理
│       │   └── user.ts           # 用户管理
│       ├── article.ts       #   ﹣前端公开接口
│       ├── auth.ts          #   ﹣认证接口（登录/注册）
│       └── index.ts         #   ﹣前端公开接口（首页等）
├── middleware/              # Express 中间件
│   ├── errorHandler.ts     # 全局错误处理 + wrapAsync
│   └── jwt.ts              # JWT 鉴权（generateToken / verifyToken / jwtAuth）
├── types/                   # TypeScript 类型定义
│   └── express.ts           #   ﹣JWTPayload + Express Request 扩展
├── utils/                   # 工具函数
│   ├── file.ts              #   ﹣文件处理（saveFile / 类型检测 / 危险文件过滤 / 分片上传）
│   ├── httpError.ts         #   ﹣HttpError 类（带 HTTP 状态码）
│   └── request.ts           #   ﹣HttpClient（基于 Axios，支持重试/签名/日志/Token 刷新）
├── app.ts                   # Express 应用配置（helmet / cors / rateLimit / 路由 / 错误处理）
└── index.ts                 # 启动入口（bootstrap：初始化 DB → 启动 HTTP → 优雅关闭）
```

---

## 各层规范（代码源自实际文件）

### 1. 环境配置 `src/core/env.ts`

```typescript
import { useRuntimeConfig } from "@/core";

const config = useRuntimeConfig();
// config.PORT / config.NODE_ENV / config.DATABASE_URL / config.JWT_SECRET / ...
```

- 支持 `--env=production` 参数加载 `.env.production` 文件
- PM2 cluster 模式下自动偏移端口（实例 0 用 PORT，实例 1 用 PORT+1...）
- 所有环境变量均有默认值（开发友好）

### 2. 日志 `src/core/logger.ts`

```typescript
import { logger, dbLogger, routeLogger } from "@/core";

logger.info("message"); // 普通日志
logger.error("message", err); // 错误日志
dbLogger.logQuery(sql, params); // Drizzle SQL 日志
routeLogger; // Express 请求日志中间件（自动记录方法/路径/状态/耗时）
```

### 3. 数据库连接 `src/core/db/pg.ts` + `src/core/db/index.ts`

```typescript
import { initDB, getDB, closeDB } from "@/core";

// 启动时初始化
initDB(); // 默认连接名 "main"

// 获取实例
const { db, close } = getDB();

// Drizzle query
const rows = await db.select().from(schema.article);

// 关闭
await closeDB(); // 关闭所有连接
```

### 4. Schema 工具 `src/core/db/tool.ts`

```typescript
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createSchema, sort, enabled, fk } from "@/core";

export const article = pgTable(
  "article",
  createSchema({
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 200 }).notNull(),
    sort: sort(), // integer NOT NULL DEFAULT 0
    enabled: enabled(), // integer NOT NULL DEFAULT 1
    // createdAt / updatedAt / deletedAt 由 createSchema 自动补充
  }),
);

// 可选外键净化（前端传 0 表示"无关联"）
fk(0); // → null
fk(5); // → 5
```

### 5. 软删除 `src/core/db/softDelete.ts`

```typescript
import { notDeleted, softDeleteSet, restoreSet, softDelete, restore } from "@/core";

// WHERE deletedAt IS NULL
db.select().from(table).where(notDeleted(table));

// 标记删除
await softDelete(db, table, id);

// 恢复
await restore(db, table, id);
```

### 6. Service 层

**继承 BaseService**（asset、article 已遵循，sys 暂为独立函数）：

```typescript
import { BaseService, fk, schema } from "@/core";

export class AssetService extends BaseService {
  async uploadAsset(buffer: Buffer, originalName: string, meta: UploadAssetDtoType) {
    const db = this.db();                // 获取 DB 实例
    const redis = this.redis();          // 获取 Redis 实例
    const fileMeta = await saveFile(/*...*/);
    const [row] = await db.insert(schema.assetLib).values({
      type: fileMeta.type,
      url: fileMeta.url,
      albumId: fk(meta.albumId),        // 可选外键 0→null
      title: meta.title ?? null,
    }).returning();
    return row;
  }

  async list(params: { page; pageSize; type?; albumId?; title? }) {
    const db = this.db();
    const where = and(
      this.notDeleted(schema.assetLib),  // 软删除过滤
      params.type ? eq(...) : undefined,
      params.albumId ? eq(...) : undefined,
    );
    const [total, rows] = await Promise.all([
      db.select({ total: count() }).from(schema.assetLib).where(where),
      db.select().from(schema.assetLib).where(where)
        .orderBy(desc(schema.assetLib.updatedAt))
        .offset((params.page - 1) * params.pageSize).limit(params.pageSize),
    ]);
    return { list: rows, total: total[0].total };
  }

  async deleteAsset(id: number) {
    return this.softDelete(schema.assetLib, id);  // 软删除
  }
}

// 单例导出
export const assetService = new AssetService();
```

**BaseService 提供方法**（来自 [service.ts](file:///d:/Code/chl/src/core/service.ts)）：

| 方法                     | 用途                   |
| ------------------------ | ---------------------- |
| `this.db(name?)`         | 获取 Drizzle DB 实例   |
| `this.redis(name?)`      | 获取 RedisAdapter 实例 |
| `this.notDeleted(table)` | 软删除 WHERE 条件      |
| `this.softDelete(t, id)` | 执行软删除             |
| `this.restore(t, id)`    | 恢复软删除             |

**独立函数模式**（sys 模块暂未继承 BaseService）：

```typescript
import { fk, getDB, schema } from "@/core";

export async function createSiteVersion(data: CreateSiteVersionDtoType) {
  const db = getDB();
  const [row] = await db.insert(schema.siteVersion).values(data).returning();
  return row;
}
```

### 7. Controller 层

**必须继承 BaseController**：

```typescript
import { BaseController } from "@/core";
import { assetService } from "@/service/asset";

export class AssetController extends BaseController {
  upload = async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      this.errorResult(res, { message: "未选择文件" });
      return;
    }
    const asset = await assetService.uploadAsset(/*...*/);
    this.createResult(res, asset, { message: "上传成功" });
  };

  detail = async (req: Request, res: Response) => {
    const asset = await assetService.getAsset(req.body.id);
    if (!asset) {
      this.notFoundResult(res, { message: "资产不存在" });
      return;
    }
    this.successResult(res, asset, { message: "获取成功" });
  };
}
```

**BaseController 可用方法**（来自 [controller.ts](file:///d:/Code/chl/src/core/controller.ts)）：

| 方法                                     | code   | 用途                                   |
| ---------------------------------------- | ------ | -------------------------------------- |
| `validate(schema, data)`                 | -      | Zod 校验，返回 `safeParse` 结果        |
| `validateBody(schema)`                   | -      | Express 中间件，校验 `req.body` 并覆盖 |
| `successResult(res, data, msg)`          | 0      | 通用成功                               |
| `createResult(res, data, msg)`           | 1      | 创建成功                               |
| `errorResult(res, msg)`                  | -1     | 请求错误                               |
| `notFoundResult(res, msg)`               | -3     | 资源不存在                             |
| `response(res, bizCode, data, msg)`      | 自定义 | 底层响应方法                           |
| `standardResponse(res, http, biz, d, m)` | 自定义 | 完全自定义响应                         |

### 8. DTO 层

所有校验规则定义在 `src/dto/` 下，使用 Zod 推导类型：

- **可选外键字段**：`.min(0).optional().nullable()` 允许传 `0` 表示"无关联"
- **只限制 DB `notNull()` 字段为必填**
- **类型后缀**：`DtoType`（如 `CreateAlbumDtoType = z.infer<typeof CreateAlbumDto>`）
- **数字字符串自动转换**：使用 `z.coerce.number()`

```typescript
export const CreateAlbumDto = z.object({
  name: z.string().min(1, "相册名称不能为空").max(50, "相册名称最多 50 字"),
  parentId: z.coerce.number().int().min(0).optional().nullable(),
  sort: z.coerce.number().int().optional().default(0),
});
export type CreateAlbumDtoType = z.infer<typeof CreateAlbumDto>;

// 公共分页 DTO（common.ts）
export const PaginationDto = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(10),
});
```

### 9. 路由层

- 路由文件放入 `src/routes/router/`，自动扫描注册（见 [routes/index.ts](file:///d:/Code/chl/src/routes/index.ts)）
- **自动扫描规则**：`globSync("**/*.{ts,js}")` 按路径深度降序注册（优先注册 `/article/category` 再注册 `/article`，避免路由拦截）
- **管理端**：`/admin/*`，需 `jwtAuth` 中间件
- **前端公开**：`/api/*`，无需鉴权
- **Swagger**：`/api-docs`（仅非生产环境或 `SWAGGER_ENABLED=true`），`/api-docs.json` 返回原始 JSON

```typescript
const router = express.Router();
const authRouter = express.Router();
authRouter.use(jwtAuth);

// @openapi 注释用于 Swagger 文档
authRouter.post(
  "/album/create",
  assetController.validateBody(CreateAlbumDto),
  wrapAsync(assetController.createAlbum),
);
```

### 10. 数据库 Schema 定义

```typescript
export const assetAlbum = pgTable(
  "asset_album",
  createSchema({
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    parentId: integer("parent_id"),
    sort: sort(),
  }),
);
```

### 11. 文件上传

使用 Multer 中间件（配置见 [upload.ts](file:///d:/Code/chl/src/core/upload.ts)）：

```typescript
import { upload } from "@/core/upload";

// 路由中使用
router.post("/upload", upload.single("file"), wrapAsync(controller.upload));
```

- 文件保存逻辑在 `utils/file.ts` 的 `saveFile()` 中
- 自动按类型/日期分组存储：`uploads/image/2026/09/10/1712345678-a1b2c3d4.jpg`
- 支持图片尺寸提取（sharp）
- 危险文件扩展名拦截（exe, php, sh, py, etc.）
- 文件大小上限：100MB

### 12. Redis 适配器架构

采用**适配器模式**（策略模式），业务层通过 `RedisAdapter` 接口操作，无需关心底层实现：

```
业务层 → CacheClient / getRedis()
        ↓
    RedisAdapter (接口)
        ↓
    ┌────┴────┐
 IORedis    MockRedis
（生产）    （开发/测试）
```

```typescript
import { getRedis, cache } from "@/core";

// 直接操作 Redis
const redis = getRedis();
await redis.set("key", "value", 3600); // TTL 3600s
const val = await redis.get("key");

// 通过缓存工具类（自动 JSON 序列化 + 命名空间）
await cache.set("user:1", { name: "Alice" }, { ttl: 300 });
const user = await cache.get<{ name: string }>("user:1");

// 缓存穿透防护
const data = await cache.getOrSet(
  "expensive:key",
  () => fetchFromDB(),
  { ttl: 600, nullTtl: 60 }, // 空值也缓存 60s
);
```

当 `REDIS_ENABLED !== "true"` 时自动使用 MockRedisAdapter（内存 Map），开发调试零依赖。

### 13. 响应格式

```json
{
  "code": 0,
  "data": {},
  "message": {
    "show": true,
    "mode": "success",
    "message": "操作成功",
    "timestamp": "2026-09-10T06:17:05.905Z"
  }
}
```

| code | 含义           |
| ---- | -------------- |
| 0    | Success        |
| 1    | Create         |
| -1   | Error          |
| -2   | Warning        |
| -3   | NotFound       |
| -4   | Duplicate      |
| -5   | Internal Error |

### 14. 错误处理

全局错误处理中间件 [errorHandler.ts](file:///d:/Code/chl/src/middleware/errorHandler.ts)：

- 异步 handler 用 `wrapAsync` 包裹，自动捕获异常
- `HttpError`（来自 [httpError.ts](file:///d:/Code/chl/src/utils/httpError.ts)）携带 HTTP 状态码，被 errorHandler 识别并返回对应状态码
- 生产环境隐藏详细错误信息

```typescript
// Controller 中使用
export class XxxController extends BaseController {
  action = async (req: Request, res: Response) => {
    // 无需 try-catch，wrapAsync 会自动捕获
    throw new HttpError("自定义错误", 400);
  };
}

// 路由中包裹
router.post("/action", wrapAsync(controller.action));
```

### 15. HTTP 客户端（Axios 封装）

[request.ts](file:///d:/Code/chl/src/utils/request.ts) 提供 `HttpClient` 类：

- 自动重试（指数退避，可配置）
- 请求签名
- 请求/响应日志
- Token 自动刷新
- 统一响应格式 `ApiResponse<T>`

### 16. JWT 鉴权

```typescript
import { generateToken, verifyToken, jwtAuth } from "@/middleware/jwt";
import type { JWTPayload } from "@/types/express";

// 生成 token
const token = generateToken({ userId: 1, username: "admin", role: "admin" });

// 验证 token
const payload = verifyToken(token); // JWTPayload | null

// 路由中间件
authRouter.use(jwtAuth);

// Controller 中获取用户信息
const user = req.user; // { userId, username, role }
```

### 17. 应用入口

**app.ts**（Express 配置）：

```typescript
// 中间件顺序：helmet → cors → rateLimit → routeLogger → json/urlencoded → router → errorHandler
```

**index.ts**（启动入口）：

```typescript
// bootstrap 流程：读取配置 → initDB() → 创建 HTTP Server → 监听端口 → 注册 SIGTERM/SIGINT 优雅关闭
```

---

## 开发流程

### 新增功能

1. **先确认刚需**：这个功能现在就必须有吗？还是"以后可能用到"？只做刚需。
2. **检查复用**：是否已有现成的工具函数（`fk`、`sort`、`enabled`、`createSchema`）？是否能用 BaseService 的方法？
3. **检查冗余**：代码是否与现有逻辑重复？能否抽象到 `core/` 统一导出？
4. **检查最佳实践**：是否有更现代的写法（如 Drizzle 的 `returning()` 而非手动 `SELECT`）？
5. **读取确认**：写代码前先读取相关文件，确认方法名、参数名、字段名与实际一致。
6. **编译验证**：`npx tsc --noEmit --pretty` 确保无类型错误。

### 修改现有功能

1. **先读后改**：修改前必须读取目标文件，理解现有逻辑。
2. **影响范围**：检查涉及的表、DTO、Service、Controller、路由是否全部同步更新。
3. **编译验证**：修改后必须编译检查。

---

## 约定速查

| 约定         | 规则                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------ |
| Service 继承 | 优先用 `class XxxService extends BaseService { }` + `export const xxxService = new XxxService()` |
| 可选外键     | DTO: `.min(0).optional().nullable()` → Service: `fk(value)` → DB: `NULL`                         |
| 软删除       | Schema 用 `createSchema()` → 查询加 `this.notDeleted(t)` → 删除用 `this.softDelete(t, id)`       |
| 分页查询     | `const [total, rows] = await Promise.all([count, select + offset + limit])`                      |
| 路由注册     | 自动扫描 `routes/router/`，无需手动 import；按路径深度降序优先                                   |
| DTO 校验     | Controller 中用 `this.validateBody(Schema)` 中间件，校验后 `req.body` 为类型安全数据             |
| 错误处理     | Controller 中用 `wrapAsync` 包裹异步 handler，无需手动 try-catch                                 |
| 文件上传     | Multer `upload.single("file")` + `saveFile()` 保存（自动分类/防危险文件）                        |
| Swagger 注释 | 路由文件中用 `@openapi` JSDoc 注释自动生成文档                                                   |
| Redis 缓存   | `cache.getOrSet(key, getter, { ttl })` 带缓存穿透防护                                            |
| 命名         | 文件/变量/函数：驼峰；Schema 表/字段：蛇形；DTO 类型后缀：`DtoType`                              |
| 模块导入     | 使用 `@/` 别名（如 `import { fk } from "@/core"`），避免相对路径深层嵌套                         |
| 环境变量     | 通过 `useRuntimeConfig()` 获取，不可直接 `process.env`                                           |
| 日志记录     | 使用 `logger.info/error/warn`，不可直接 `console.log`                                            |
