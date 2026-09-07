import { themeQuartz } from "ag-grid-community";

/**
 * AG Grid 集成项目 Tailwind CSS 主题
 * 颜色变量与 src/index.css 保持一致
 */

const primaryColor = "hsl(var(--color-primary))";

export const agGridTheme = themeQuartz.withParams({
  // 核心颜色
  backgroundColor: "hsl(var(--color-background))",
  foregroundColor: "hsl(var(--color-foreground))",
  headerBackgroundColor: "hsl(var(--color-muted))",
  headerForegroundColor: "hsl(var(--color-muted-foreground))",
  cellTextColor: "hsl(var(--color-foreground))",

  // 边框
  borderColor: "hsl(var(--color-border))",
  rowBorderColor: "hsl(var(--color-border))",

  // 选中行
  selectedRowBackgroundColor: "hsl(var(--color-primary) / 0.1)",
  selectedRowTextColor: "hsl(var(--color-foreground))",

  // 悬停
  rowHoverBackgroundColor: "hsl(var(--color-accent-hover))",

  // 滚动条
  scrollbarColor: "hsl(var(--color-muted))",
  scrollbarBackgroundColor: "hsl(var(--color-background-deep))",

  // 菜单/弹窗
  menuBackgroundColor: "hsl(var(--color-popover))",
  menuTextColor: "hsl(var(--color-popover-foreground))",
  popupShadow: "var(--shadow-custom)",

  // 按钮
  primaryColor,
  accentColor: primaryColor,

  // 间距
  borderRadius: "calc(var(--radius) - 2px)",
  wrapperBorderRadius: "var(--radius)",
});

/**
 * 创建自定义 AG Grid 主题
 * @param overrides 覆盖参数
 * @example
 * ```ts
 * const myTheme = createAgGridTheme({
 *   rowHeight: 48,
 *   headerHeight: 56,
 * });
 * ```
 */
export function createAgGridTheme(overrides: Record<string, unknown>) {
  return agGridTheme.withParams(overrides);
}
