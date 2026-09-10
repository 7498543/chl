import AdminLayout from "@/layout/admin";
import DefaultLayout from "@/layout/default";
import Forbidden from "@/pages/403";
import NotFound from "@/pages/404";
import ServerError from "@/pages/500";
import Login from "@/pages/admin/auth/login";
import Index from "@/pages/index";
import { AuthGuard, GuestGuard } from "@/router/guard";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

const router = createBrowserRouter([
  // ==================== 前台布局 ====================
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      { index: true, element: <Index /> },
      { path: "articles", element: <div>文章列表</div> },
      { path: "articles/:id", element: <div>文章详情</div> },
      { path: "tags", element: <div>标签页</div> },
      { path: "about", element: <div>关于我们</div> },
    ],
  },

  // ==================== 后台管理布局 ====================
  {
    path: "/admin",
    element: (
      <AuthGuard>
        <AdminLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: "dashboard", element: <div>控制台</div> },
      { path: "articles", element: <div>文章管理</div> },
      { path: "categories", element: <div>分类管理</div> },
      { path: "tags", element: <div>标签管理</div> },
      { path: "users", element: <div>用户管理</div> },
      { path: "settings", element: <div>系统设置</div> },
    ],
  },

  // ==================== 认证页（独立布局） ====================
  {
    path: "/admin/auth",
    element: (
      <GuestGuard>
        <Outlet />
      </GuestGuard>
    ),
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <div>注册页</div> },
    ],
  },

  // ==================== 错误页 ====================
  { path: "/403", element: <Forbidden /> },
  { path: "/404", element: <NotFound /> },
  { path: "/500", element: <ServerError /> },
  { path: "*", element: <NotFound /> },
]);

export default router;
