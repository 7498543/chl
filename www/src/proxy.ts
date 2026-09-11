import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/** 无需登录的白名单路径 */
const WHITE_LIST = [
  "/",
  "/403",
  "/404",
  "/500",
  "/admin/auth/login",
  "/admin/auth/register",
  "/api",
];

/** 静态资源前缀 */
const STATIC_PREFIXES = ["/_next", "/favicon", "/images", "/fonts"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 静态资源直接放行
  if (STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // 白名单页面直接放行
  if (WHITE_LIST.some((path) => pathname === path || pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 仅保护 /admin 路由
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      const loginUrl = new URL("/admin/auth/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // 匹配所有路由，排除 _next/static, _next/image, favicon
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
