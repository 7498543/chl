import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app";
import { useAuthStore } from "@/stores/auth";
import { LogOut, MenuIcon, Moon, Sun, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const { toggleSidebar, theme, toggleTheme } = useAppStore();
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/auth/login");
  };

  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

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

        <div className="flex items-center gap-3 ml-2 pl-2 border-l border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-bg">
              <User size={16} className="text-accent" />
            </div>
            {user && (
              <span className="text-sm font-medium hidden sm:block">
                {user.nickname || user.username}
              </span>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="rounded-md p-2 transition-colors hover:bg-accent-bg text-text"
            aria-label="退出登录"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
