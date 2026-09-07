import { useAuthStore } from "@/stores/auth";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

/** 路由权限白名单（无需登录） */
const WHITE_LIST = ["/", "/403", "/404", "/500", "/admin/auth/login", "/admin/auth/register"];

interface AuthGuardProps {
  children: ReactNode;
  /** 所需角色 */
  roles?: string[];
}

/**
 * 路由守卫组件
 * - 未登录且不在白名单 → 跳转登录页
 * - 已登录但角色不匹配 → 跳转 403
 * @example
 * ```tsx
 * <AuthGuard roles={['admin']}>
 *   <Dashboard />
 * </AuthGuard>
 * ```
 */
export function AuthGuard({ children, roles }: AuthGuardProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // 白名单页面直接放行
  if (WHITE_LIST.includes(location.pathname)) {
    return <>{children}</>;
  }

  // 未登录 → 跳转登录页
  if (!isAuthenticated) {
    return <Navigate to="/admin/auth/login" state={{ from: location }} replace />;
  }

  // 角色验证
  if (roles && roles.length > 0 && user && !roles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}

/** 已登录用户访问登录页时，重定向到首页 */
export function GuestGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
