# www — 前后台一体化 Web 应用

基于 **React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4** 的企业级前后台一体化项目。

## 技术栈

| 类别     | 技术选型                       | 说明                               |
| -------- | ------------------------------ | ---------------------------------- |
| 框架     | React 19 + TypeScript 6        | 类型安全，最新 React 特性          |
| 构建     | Vite 8                         | 极速 HMR，ESBuild 编译             |
| 路由     | React Router v7                | 嵌套路由，加载器/操作              |
| 状态管理 | Zustand 5                      | 轻量、无模板、TS 友好              |
| 样式     | Tailwind CSS 4 + CSS Variables | 原子化 CSS + 主题变量              |
| 组件库   | MUI 9 + AG Grid 36             | 后台表格/表单/数据展示             |
| 网络请求 | Axios + 封装                   | JWT 拦截器、自动刷新、统一错误处理 |
| 3D 渲染  | React Three Fiber + Drei       | 3D 场景可视化                      |
| 表单校验 | Zod 4 + HookForm Resolver      | 类型安全的运行时校验               |
| 工具库   | Lodash + Dayjs + 内置封装      | 常用工具函数                       |

## 目录结构

```
www/
├── public/                    # 静态资源
├── src/
│   ├── assets/                # 样式变量
│   │   └── variable.scss      #   CSS 变量定义（HSL 格式）
│   ├── components/            # 通用组件
│   │   └── ui/
│   │       └── Seo.tsx        #   SEO 组件（<title>/<meta>）
│   ├── hooks/                 # 自定义 Hooks（15 个）
│   │   ├── useAuth.ts         #   认证状态 Hook
│   │   ├── useMediaQuery.ts   #   响应式媒体查询 + 断点
│   │   ├── useRequest.ts      #   异步请求（loading/data/error）
│   │   ├── usePagination.ts   #   分页状态管理
│   │   ├── useDebounce.ts     #   防抖（值/函数）
│   │   ├── useThrottle.ts     #   节流（值/函数）
│   │   ├── useToggle.ts       #   布尔开关
│   │   ├── useCountdown.ts    #   倒计时
│   │   ├── useUrlState.ts     #   URL 查询参数同步状态
│   │   ├── useTitle.ts        #   页面标题
│   │   ├── useEventListener.ts#   事件监听（自动清理）
│   │   ├── useClickOutside.ts #   点击外部检测
│   │   ├── useIntersectionObserver.ts # 可见性观察
│   │   ├── useKeyboard.ts     #   键盘快捷键
│   │   └── useLockFn.ts       #   函数锁（防重复点击）
│   ├── layout/                # 布局
│   │   ├── default.tsx        #   前台布局（Header + Main + Footer）
│   │   ├── admin.tsx          #   后台布局（Sidebar + Header + Main）
│   │   ├── admin/             #   后台布局组件
│   │   │   ├── Sidebar.tsx    #     侧边栏导航
│   │   │   ├── Header.tsx     #     顶部栏
│   │   │   └── Main.tsx       #     内容区
│   │   └── components/        #   前台布局组件
│   │       ├── Header.tsx     #     顶部导航
│   │       ├── Main.tsx       #     内容区
│   │       └── Footer.tsx     #     页脚
│   ├── lib/                   # 核心工具库
│   │   ├── api.ts             #   Axios 封装（JWT / 401 自动刷新 / 取消）
│   │   ├── constants.ts       #   常量配置（API_BASE_URL / TOKEN_KEY）
│   │   ├── utils.ts           #   工具函数（cn / formatDate）
│   │   ├── event.ts           #   事件总线（发布订阅）
│   │   ├── sugar.ts           #   语法糖封装（见下方详情）
│   │   ├── ag-grid/           #   AG Grid 适配器
│   │   │   ├── AgGrid.tsx     #     React 封装组件
│   │   │   ├── config.ts      #     全局配置 + 合并工具
│   │   │   ├── theme.ts       #     主题集成（Tailwind 变量）
│   │   │   └── index.ts       #     导出入口
│   │   └── theme/             #   主题管理
│   │       ├── useTheme.ts    #     useTheme 钩子
│   │       ├── vars.ts        #     CSS 变量定义
│   │       └── index.ts       #     导出入口
│   ├── pages/                 # 页面
│   │   ├── index.tsx          #   首页
│   │   ├── 403.tsx            #   无权限
│   │   ├── 404.tsx            #   页面不存在
│   │   ├── 500.tsx            #   服务器错误
│   │   └── admin/             #   后台页面
│   │       └── auth/
│   │           ├── login.tsx  #     登录
│   │           └── register.tsx #   注册
│   ├── router/                # 路由
│   │   ├── index.tsx          #   路由定义（createBrowserRouter）
│   │   └── guard.tsx          #   路由守卫（AuthGuard / GuestGuard）
│   ├── stores/                # 状态管理（Zustand）
│   │   ├── index.ts           #   导出入口
│   │   ├── auth.ts            #   认证状态（login/logout/initialize）
│   │   └── app.ts             #   全局状态（主题/侧边栏/加载）
│   ├── types/                 # 类型定义
│   │   └── index.ts           #   User / Article / ApiResponse / LoginRequest
│   ├── App.tsx                # 根组件
│   ├── main.tsx               # 入口文件
│   └── index.css              # Tailwind + 主题变量
├── index.html
├── package.json
└── vite.config.ts
```

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

## 路由体系

路由分为三个层级：

### 前台路由 `/`

公开页面，游客可直接访问。

```ts
/              → 首页
/articles      → 文章列表
/articles/:id  → 文章详情
/tags          → 标签页
/about         → 关于我们
```

### 后台路由 `/admin`

需登录访问，由 `AuthGuard` 保护。未登录自动跳转登录页。

```ts
/admin/dashboard    → 控制台
/admin/articles     → 文章管理
/admin/categories   → 分类管理
/admin/tags         → 标签管理
/admin/users        → 用户管理
/admin/settings     → 系统设置
```

### 认证路由 `/admin/auth`

已登录用户不可访问，由 `GuestGuard` 保护。

```ts
/admin/auth/login    → 登录
/admin/auth/register → 注册
```

### 错误页

```ts
/403  → 无权限
/404  → 页面不存在
/500  → 服务器错误
```

## 核心模块

### 1. 网络请求封装 `lib/api.ts`

基于 Axios 的完整封装，核心能力：

| 特性              | 说明                                                 |
| ----------------- | ---------------------------------------------------- |
| **JWT 自动注入**  | 请求拦截器自动携带 `Authorization: Bearer <token>`   |
| **401 自动刷新**  | Token 过期后自动调用 `/auth/refresh`，失败则跳转登录 |
| **请求取消**      | 基于 `AbortController`，支持取消重复或失效请求       |
| **统一响应处理**  | 业务码（code）非 0/200 时自动 reject                 |
| **文件上传/下载** | `upload()` / `download()` 方法内置封装               |

```ts
import { http } from "@/lib";

// GET
const { data } = await http.get<User>("/users", { page: 1 });

// POST
const { data } = await http.post<Article>("/articles", { title: "Hello" });

// 上传
const { data } = await http.upload("/files", file, "avatar");
```

### 2. 语法糖封装 `lib/sugar.ts`

| 模块                  | 功能                                                                |
| --------------------- | ------------------------------------------------------------------- |
| `storage` / `session` | 带过期时间的本地/会话存储                                           |
| `is`                  | 类型判断：`is.string()` / `is.empty()` / `is.url()` 等              |
| `str`                 | 字符串工具：`truncate()` / `maskPhone()` / `stripHtml()` 等         |
| `num`                 | 数字工具：`format()` / `formatSize()` / `abbreviate()` 等           |
| `obj`                 | 对象工具：`clone()` / `get()` / `pick()` / `omit()`                 |
| `tree`                | 树结构工具：`toTree()` / `toList()` / `findNode()` / `filterTree()` |
| `time`                | 时间工具：`timeAgo()` / `countdown()` / `todayRange()`              |
| `browser`             | 浏览器工具：`copy()` / `getQueryParam()` / `downloadBlob()` 等      |

```ts
import { storage, str, num, tree, time, browser } from "@/lib";

// 存储（带过期时间）
storage.set("token", "xxx", { expire: 3600_000 });
const token = storage.get("token");

// 字符串
str.maskPhone("13812345678"); // "138****5678"

// 数字
num.formatSize(1024 * 1024); // "1.00 MB"

// 树结构
const treeData = tree.toTree(flatList);
tree.getLeaves(treeData);

// 时间
time.timeAgo("2026-09-01"); // "6天前"
```

### 3. Hooks 集合 `src/hooks/`

```ts
import {
  useRequest, // 异步请求（loading / data / error / refresh）
  usePagination, // 分页（page / pageSize / total / onChange）
  useDebounce, // 防抖
  useThrottle, // 节流
  useToggle, // 开关
  useCountdown, // 倒计时
  useUrlState, // URL 状态同步
  useMediaQuery, // 媒体查询
  useBreakpoint, // 断点（xs/sm/md/lg/xl/2xl）
  useClickOutside, // 点击外部
  useEventListener, // 事件监听
  useIntersectionObserver, // 可见性观察
  useKeyboard, // 键盘快捷键
  useLockFn, // 函数锁
  useTitle, // 页面标题
} from "@/hooks";
```

### 4. 主题管理 `lib/theme/`

统一管理项目样式变量，支持第三方库主题适配。

```ts
import { useTheme } from "@/lib";

function MyComponent() {
  const { mode, isDark, vars, adapter } = useTheme();

  // 当前主题模式
  console.log(mode); // "light" | "dark"

  // 使用 CSS 变量值
  return (
    <div style={{ background: `hsl(${vars.primary})` }}>
      {/* AG Grid 主题已自动适配 */}
      <AgGrid columnDefs={cols} rowData={data} />
    </div>
  );
}
```

### 5. AG Grid 适配器 `lib/ag-grid/`

```ts
import { AgGrid, setGlobalAgGridConfig } from "@/lib";

// 全局配置（入口处设置一次）
setGlobalAgGridConfig({ pagination: true, paginationPageSize: 20 });

// 页面中使用（自动合并全局配置）
<AgGrid columnDefs={cols} rowData={data} paginationPageSize={50} />
```

| API                             | 说明                                       |
| ------------------------------- | ------------------------------------------ |
| `setGlobalAgGridConfig(config)` | 设置全局配置                               |
| `getGlobalAgGridConfig()`       | 获取全局配置                               |
| `resetGlobalAgGridConfig()`     | 重置为默认值                               |
| `mergeAgGridConfig(userConfig)` | 合并全局 + 当前配置（优先级：当前 > 全局） |

### 6. 事件总线 `lib/event.ts`

跨组件通信，适用于非父子组件间的消息传递。

```ts
import { eventBus } from "@/lib";

// 订阅
const unsub = eventBus.on("user:updated", (user) => { ... });

// 单次订阅
eventBus.once("notification", (msg) => { ... });

// 发布
eventBus.emit("user:updated", { id: 1, name: "Alice" });

// 取消订阅
unsub();
```

### 7. 状态管理 `stores/`

使用 Zustand 5，比 Redux 更轻量。

```ts
import { useAppStore, useAuthStore } from "@/stores";

// 主题切换
const { theme, toggleTheme, setTheme } = useAppStore();

// 认证
const { isAuthenticated, user, login, logout } = useAuthStore();
```

## 样式系统

### Tailwind CSS 4 + CSS Variables

项目使用 Tailwind CSS 4 的 `@theme` 指令定义设计 Token，配合 CSS 变量实现主题切换。

**可用颜色类名：**

| 类别 | 类名示例                                 | 说明      |
| ---- | ---------------------------------------- | --------- |
| 主色 | `text-primary` / `bg-primary`            | 品牌主色  |
| 次要 | `text-secondary` / `bg-secondary`        | 次要色彩  |
| 强调 | `text-accent` / `bg-accent`              | 悬停/高亮 |
| 成功 | `text-success` / `bg-success`            | 成功状态  |
| 警告 | `text-warning` / `bg-warning`            | 警告状态  |
| 错误 | `text-destructive` / `bg-destructive`    | 错误/危险 |
| 背景 | `bg-background` / `bg-card` / `bg-muted` | 背景层级  |
| 边框 | `border-border` / `border-input`         | 边框颜色  |
| 圆角 | `rounded-radius`                         | 统一圆角  |
| 模糊 | `backdrop-overlay`                       | 遮罩层    |

**深色模式：** 自动跟随系统 `prefers-color-scheme: dark`，所有颜色变量在深色模式下有对应值。

## 环境变量

```env
VITE_API_BASE_URL=/api    # API 接口地址，默认相对路径
```

## 开发规范

1. **类型优先**：所有接口请求/响应都必须定义 TypeScript 类型
2. **Hooks 复用**：通用逻辑优先抽取为 Hooks 而非直接写在组件中
3. **状态管理**：全局状态使用 Zustand，局部状态使用 React 的 `useState` / `useReducer`
4. **样式**：优先使用 Tailwind 原子类，复杂样式在 `@theme` 中定义
5. **组件命名**：PascalCase，文件与导出名一致
6. **国际化**：中文项目，无需 i18n 支持
