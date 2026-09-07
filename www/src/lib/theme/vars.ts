/**
 * 项目 CSS 变量定义
 * 与 src/index.css @theme 和 src/assets/variable.scss 保持一致
 */

/** 标准颜色变量名（不含 --color- 前缀） */
export const COLOR_VARS = [
  "primary",
  "primary-foreground",
  "background",
  "background-deep",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-hover",
  "accent-foreground",
  "secondary",
  "secondary-foreground",
  "destructive",
  "destructive-foreground",
  "success",
  "success-foreground",
  "warning",
  "warning-foreground",
  "border",
  "input",
  "input-placeholder",
  "input-background",
  "ring",
  "overlay",
  "heavy",
  "heavy-foreground",
  "sidebar",
  "sidebar-deep",
  "header",
] as const;

/** 标准尺寸变量名 */
export const SIZE_VARS = ["radius"] as const;

/** 全部变量名 */
export const ALL_VARS = [...COLOR_VARS, ...SIZE_VARS] as const;

/** 变量前缀 */
export const CSS_PREFIX = {
  color: "--color-",
  size: "--",
} as const;

/** 变量类型 */
export type ColorVarName = (typeof COLOR_VARS)[number];
export type SizeVarName = (typeof SIZE_VARS)[number];
export type VarName = (typeof ALL_VARS)[number];
