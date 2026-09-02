```
www/src/
├── components/          # 可复用组件
│   └── ui/
│       └── Seo.tsx      # SEO 组件 (React 19 原生 <title>/<meta>)
├── hooks/               # 自定义 Hooks
│   └── useAuth.ts       # 认证状态 Hook
├── layout/              # 布局组件
│   ├── MainLayout.tsx   # 主布局 (Header + Outlet + Footer)
│   ├── Header.tsx       # 顶部导航 (sticky, NavLink 高亮)
│   └── Footer.tsx       # 页脚
├── lib/                 # 工具库
│   ├── api.ts           # Axios 实例 (JWT 拦截器, 401 自动跳转登录)
│   ├── constants.ts     # 常量 (API_BASE_URL, TOKEN_KEY, SITE_NAME 等)
│   └── utils.ts         # 工具函数 (cn() 类名合并, formatDate 日期格式化)
├── pages/               # 页面组件
│   ├── Home.tsx         # 首页
│   └── NotFound.tsx     # 404 页面
├── router/              # 路由
│   └── index.tsx        # React Router v7 createBrowserRouter
├── stores/              # Zustand 状态管理
│   └── auth.ts          # 认证状态 (login/logout/initialize)
├── types/               # TypeScript 类型
│   └── index.ts         # User, Article, ApiResponse, LoginRequest 等
├── App.tsx              # 根组件 (RouterProvider)
├── main.tsx             # 入口
└── index.css            # Tailwind CSS
```
