"use client";

import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app";
import { FileText, Layout, Settings, Tag, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { title: "控制台", icon: <Layout size={20} />, href: "/admin" },
  {
    title: "内容管理",
    icon: <FileText size={20} />,
    children: [
      { title: "文章列表", icon: <FileText size={16} />, href: "/admin/articles" },
      { title: "分类管理", icon: <Tag size={16} />, href: "/admin/categories" },
      { title: "标签管理", icon: <Tag size={16} />, href: "/admin/tags" },
    ],
  },
  { title: "用户管理", icon: <Users size={20} />, href: "/admin/users" },
  { title: "系统设置", icon: <Settings size={20} />, href: "/admin/settings" },
];

export default function Sidebar() {
  const { sidebar } = useAppStore();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-bg transition-all duration-300",
        sidebar.collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-center border-b border-border">
        {sidebar.collapsed ? (
          <div className="font-bold text-accent-purple">C</div>
        ) : (
          <Link href="/admin" className="text-lg font-bold">
            CHL <span className="font-normal text-text">Admin</span>
          </Link>
        )}
      </div>

      <nav className="overflow-y-auto p-3" style={{ height: "calc(100vh - 4rem)" }}>
        {menuItems.map((item) => {
          const isActive = item.href && pathname === item.href;

          if (item.children) {
            return (
              <div key={item.title} className="mb-2">
                {!sidebar.collapsed && (
                  <p className="mb-1 px-3 text-xs font-medium uppercase text-text opacity-50">
                    {item.title}
                  </p>
                )}
                <div className="space-y-1">
                  {item.children.map((child) => {
                    const isChildActive = child.href && pathname.startsWith(child.href);
                    return (
                      <Link
                        key={child.href}
                        href={child.href!}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          isChildActive
                            ? "bg-accent-bg text-accent-purple font-medium"
                            : "text-text hover:bg-accent-bg hover:text-text-h",
                        )}
                        title={sidebar.collapsed ? child.title : undefined}
                      >
                        {child.icon}
                        {!sidebar.collapsed && <span>{child.title}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                "mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-accent-bg text-accent-purple font-medium"
                  : "text-text hover:bg-accent-bg hover:text-text-h",
              )}
              title={sidebar.collapsed ? item.title : undefined}
            >
              {item.icon}
              {!sidebar.collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
