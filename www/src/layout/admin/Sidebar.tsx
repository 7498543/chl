import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app";
import { FileText, Layout, Settings, Tag, Users } from "lucide-react";
import { NavLink } from "react-router-dom";

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { title: "控制台", icon: <Layout size={20} />, path: "/admin/dashboard" },
  {
    title: "内容管理",
    icon: <FileText size={20} />,
    children: [
      { title: "文章列表", icon: <FileText size={16} />, path: "/admin/articles" },
      { title: "分类管理", icon: <Tag size={16} />, path: "/admin/categories" },
      { title: "标签管理", icon: <Tag size={16} />, path: "/admin/tags" },
    ],
  },
  { title: "用户管理", icon: <Users size={20} />, path: "/admin/users" },
  { title: "系统设置", icon: <Settings size={20} />, path: "/admin/settings" },
];

export default function Sidebar() {
  const { sidebar } = useAppStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-bg transition-all duration-300",
        sidebar.collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-center border-b border-border">
        {sidebar.collapsed ? (
          <div className="font-bold text-accent">C</div>
        ) : (
          <div className="text-xl font-bold tracking-tight">管理后台</div>
        )}
      </div>
      <nav className="mt-4 px-2">
        {menuItems.map((item, index) => (
          <MenuItem key={index} item={item} collapsed={sidebar.collapsed} depth={0} />
        ))}
      </nav>
    </aside>
  );
}

interface MenuItemProps {
  item: MenuItem;
  collapsed: boolean;
  depth: number;
}

function MenuItem({ item, collapsed, depth }: MenuItemProps) {
  if (item.children) {
    return (
      <div className="mb-1">
        <button
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent-bg",
            depth > 0 && "pl-4",
          )}
        >
          <div className="flex-shrink-0">{item.icon}</div>
          {!collapsed && <span className="flex-1 text-left">{item.title}</span>}
        </button>
        {!collapsed && (
          <div className="ml-3 mt-1">
            {item.children.map((child, idx) => (
              <MenuItem key={idx} item={child} collapsed={collapsed} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!item.path) return null;

  return (
    <NavLink
      to={item.path}
      end
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors mb-1",
          isActive ? "bg-accent-bg text-accent" : "hover:bg-accent-bg text-text",
          depth > 0 && "pl-4",
        )
      }
    >
      <div className="flex-shrink-0">{item.icon}</div>
      {!collapsed && <span>{item.title}</span>}
    </NavLink>
  );
}
