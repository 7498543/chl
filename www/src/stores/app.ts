import { create } from "zustand";

/** 主题模式 */
type ThemeMode = "light" | "dark" | "system";

/** 侧边栏状态 */
interface SidebarState {
  collapsed: boolean;
  openKeys: string[];
}

/** 应用全局状态 */
interface AppState {
  /** 主题模式 */
  theme: ThemeMode;
  /** 是否移动端 */
  isMobile: boolean;
  /** 侧边栏状态 */
  sidebar: SidebarState;
  /** 全局加载状态 */
  globalLoading: boolean;

  /** 设置主题 */
  setTheme: (theme: ThemeMode) => void;
  /** 切换主题 */
  toggleTheme: () => void;
  /** 切换侧边栏 */
  toggleSidebar: () => void;
  /** 设置侧边栏折叠 */
  setSidebarCollapsed: (collapsed: boolean) => void;
  /** 设置侧边栏展开项 */
  setOpenKeys: (keys: string[]) => void;
  /** 设置移动端 */
  setIsMobile: (isMobile: boolean) => void;
  /** 设置全局加载 */
  setGlobalLoading: (loading: boolean) => void;
}

/** 获取系统主题偏好 */
const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

/** 获取初始主题 */
const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "system";
  const saved = localStorage.getItem("theme") as ThemeMode | null;
  return saved ?? "system";
};

/** 应用主题 */
const applyTheme = (theme: ThemeMode) => {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  const isDark = theme === "dark" || (theme === "system" && getSystemTheme() === "dark");

  root.classList.toggle("dark", isDark);
  root.style.colorScheme = isDark ? "dark" : "light";
};

export const useAppStore = create<AppState>((set, get) => ({
  theme: getInitialTheme(),
  isMobile: false,
  sidebar: {
    collapsed: false,
    openKeys: [],
  },
  globalLoading: false,

  setTheme: (theme: ThemeMode) => {
    localStorage.setItem("theme", theme);
    applyTheme(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const { theme } = get();
    const order: ThemeMode[] = ["light", "dark", "system"];
    const nextIndex = (order.indexOf(theme) + 1) % order.length;
    get().setTheme(order[nextIndex]);
  },

  toggleSidebar: () => {
    set((state) => ({
      sidebar: { ...state.sidebar, collapsed: !state.sidebar.collapsed },
    }));
  },

  setSidebarCollapsed: (collapsed: boolean) => {
    set((state) => ({
      sidebar: { ...state.sidebar, collapsed },
    }));
  },

  setOpenKeys: (keys: string[]) => {
    set((state) => ({
      sidebar: { ...state.sidebar, openKeys: keys },
    }));
  },

  setIsMobile: (isMobile: boolean) => {
    set({ isMobile });
  },

  setGlobalLoading: (loading: boolean) => {
    set({ globalLoading: loading });
  },
}));

// 客户端初始化主题 & 监听系统主题变化
if (typeof window !== "undefined") {
  applyTheme(getInitialTheme());

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    const { theme } = useAppStore.getState();
    if (theme === "system") {
      applyTheme("system");
    }
  });
}
