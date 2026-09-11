"use client";

import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app";
import { useAuthStore } from "@/stores/auth";
import { LogOut, MenuIcon, Moon, Sun, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const { toggleSidebar, theme, toggleTheme } = useAppStore();
  const { logout, user } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/admin/auth/login");
  };

  const isDark =
    (typeof window !== "undefined" &&
      (theme === "dark" ||
        (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches))) ??
    false;

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-bg px-4 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-md p-2 transition-colors hover:bg-accent-bg"
          aria-label="切换侧边栏"
        >
          <MenuIcon size={20} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className={cn("rounded-md p-2 transition-colors hover:bg-accent-bg", "text-text")}
          aria-label="切换主题"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="flex items-center gap-2 rounded-md p-2">
          <User size={20} className="text-text" />
          <span className="text-sm text-text">{user?.nickname || user?.username || "用户"}</span>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-md p-2 transition-colors hover:bg-accent-bg text-text"
          aria-label="退出登录"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
