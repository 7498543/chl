import type { GridOptions } from "ag-grid-community";

/** AG Grid 全局配置入口 */
let globalAgGridConfig: Partial<GridOptions> = {
  // 默认全局配置
  suppressDragLeaveHidesColumns: true,
  suppressMakeColumnVisibleAfterUnGroup: true,
};

/**
 * 获取 AG Grid 全局配置
 */
export function getGlobalAgGridConfig(): Partial<GridOptions> {
  return { ...globalAgGridConfig };
}

/**
 * 设置 AG Grid 全局配置
 * 会深度合并
 */
export function setGlobalAgGridConfig(config: Partial<GridOptions>): void {
  globalAgGridConfig = deepMerge(globalAgGridConfig, config);
}

/**
 * 重置 AG Grid 全局配置到默认
 */
export function resetGlobalAgGridConfig(): void {
  globalAgGridConfig = {
    suppressDragLeaveHidesColumns: true,
    suppressMakeColumnVisibleAfterUnGroup: true,
  };
}

/**
 * 合并配置：当前配置覆盖全局配置
 * 对象深度合并，数组直接替换
 */
export function mergeAgGridConfig(userConfig: Partial<GridOptions> = {}): Partial<GridOptions> {
  return deepMerge({ ...globalAgGridConfig }, userConfig);
}

/** 深度合并工具 */
function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key in source) {
    if (source[key] === undefined) {
      continue;
    }
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      result[key] = deepMerge(
        target[key] as object,
        source[key] as Partial<object>,
      ) as T[typeof key];
    } else {
      result[key] = source[key] as T[typeof key];
    }
  }
  return result;
}
