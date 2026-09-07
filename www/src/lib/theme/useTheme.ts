import { useAppStore } from "@/stores/app";
import { themeQuartz } from "ag-grid-community";
import { useEffect, useState } from "react";
import { COLOR_VARS, CSS_PREFIX, SIZE_VARS } from "./vars";

/**
 * 解析 CSS 变量实际值
 * 调用 getComputedStyle 获取当前生效的变量值
 */
function resolveCssVars<T extends string>(names: readonly T[], prefix: string): Record<T, string> {
  if (typeof document === "undefined") return {} as Record<T, string>;
  const style = getComputedStyle(document.documentElement);
  const result = {} as Record<T, string>;
  for (const name of names) {
    const value = style.getPropertyValue(`${prefix}${name}`).trim();
    result[name] = value || "";
  }
  return result;
}

/**
 * 主题钩子
 *
 * 统一管理样式变量，提供各库适配器，方便后续集成更多第三方样式库。
 *
 * @example
 * ```tsx
 * const { mode, isDark, vars, adapter } = useTheme();
 *
 * // 直接使用颜色值
 * <div style={{ color: vars.primary }} />
 *
 * // 使用 AG Grid 适配器
 * <AgGridReact theme={adapter.agGrid} />
 *
 * // 监听主题变化
 * useEffect(() => {
 *   console.log('当前主题:', mode);
 * }, [mode]);
 * ```
 */
export function useTheme() {
  const { theme: themeMode } = useAppStore();
  const [vars, setVars] = useState(() => ({
    colors: resolveCssVars(COLOR_VARS, CSS_PREFIX.color),
    sizes: resolveCssVars(SIZE_VARS, CSS_PREFIX.size),
  }));

  // 解析当前主题模式
  let isDark: boolean;
  if (typeof window === "undefined") {
    isDark = false;
  } else if (themeMode === "system") {
    isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  } else {
    isDark = themeMode === "dark";
  }
  const mode = isDark ? "dark" : "light";

  // 重解析 CSS 变量
  const refreshVars = () => {
    setVars({
      colors: resolveCssVars(COLOR_VARS, CSS_PREFIX.color),
      sizes: resolveCssVars(SIZE_VARS, CSS_PREFIX.size),
    });
  };

  // 监听主题变化
  useEffect(() => {
    refreshVars();

    const observer = new MutationObserver(refreshVars);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    // 监听系统主题变化
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (themeMode === "system") {
        refreshVars();
      }
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [themeMode]);

  // ========== 适配器：AG Grid ==========
  const agGridTheme = themeQuartz.withParams({
    backgroundColor: `hsl(${vars.colors.background})`,
    foregroundColor: `hsl(${vars.colors.foreground})`,
    headerBackgroundColor: `hsl(${vars.colors.muted})`,
    headerForegroundColor: `hsl(${vars.colors["muted-foreground"]})`,
    cellTextColor: `hsl(${vars.colors.foreground})`,
    borderColor: `hsl(${vars.colors.border})`,
    rowBorderColor: `hsl(${vars.colors.border})`,
    selectedRowBackgroundColor: `hsl(${vars.colors.primary} / 0.1)`,
    selectedRowTextColor: `hsl(${vars.colors.foreground})`,
    rowHoverBackgroundColor: `hsl(${vars.colors["accent-hover"]})`,
    scrollbarColor: `hsl(${vars.colors.muted})`,
    scrollbarBackgroundColor: `hsl(${vars.colors["background-deep"]})`,
    menuBackgroundColor: `hsl(${vars.colors.popover})`,
    menuTextColor: `hsl(${vars.colors["popover-foreground"]})`,
    primaryColor: `hsl(${vars.colors.primary})`,
    accentColor: `hsl(${vars.colors.primary})`,
    borderRadius: `calc(${vars.sizes.radius} - 2px)`,
    wrapperBorderRadius: vars.sizes.radius,
  });

  // ========== 适配器：MUI（预留） ==========
  // const muiTheme = createTheme({
  //   palette: {
  //     primary: { main: `hsl(${vars.colors.primary})` },
  //     ...
  //   },
  // });

  return {
    /** 当前主题模式：light | dark */
    mode,
    /** 是否为深色模式 */
    isDark,
    /** 已解析的 CSS 变量值（可直接用于 JS 环境） */
    vars: {
      /** 颜色变量，如 `{ primary: "212 100% 45%", ... }` */
      ...vars.colors,
      /** 尺寸变量 */
      radius: vars.sizes.radius,
    },
    /** 适配器：生成各第三方库的主题配置 */
    adapter: {
      /** AG Grid 主题实例 */
      agGrid: agGridTheme,
      /** 自定义 AG Grid 主题参数 */
      createAgGridTheme: (overrides: Record<string, unknown>) => agGridTheme.withParams(overrides),
    },
  };
}
