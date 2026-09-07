import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * URL 查询参数状态同步 Hook
 *
 * 将组件状态与 URL 查询参数双向绑定
 * 常用于搜索条件、筛选、分页等场景
 *
 * @param key 查询参数名
 * @param defaultValue 默认值
 *
 * @example
 * ```ts
 * // 字符串参数
 * const [keyword, setKeyword] = useUrlState('keyword', '');
 *
 * // 数字参数
 * const [page, setPage] = useUrlState('page', 1);
 *
 * // 数组参数（多选筛选）
 * const [categories, setCategories] = useUrlState('categories', []);
 * ```
 */
export function useUrlState<T extends string | number | boolean | string[]>(
  key: string,
  defaultValue: T,
): [T, (value: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();

  const value = useMemo<T>(() => {
    const raw = searchParams.get(key);
    if (raw === null) return defaultValue;

    // 尝试解析类型
    if (typeof defaultValue === "number") {
      const num = Number(raw);
      return (Number.isNaN(num) ? defaultValue : num) as T;
    }

    if (typeof defaultValue === "boolean") {
      return (raw === "true" ? true : raw === "false" ? false : defaultValue) as T;
    }

    if (Array.isArray(defaultValue)) {
      return (raw.split(",").filter(Boolean) || defaultValue) as T;
    }

    return raw as T;
  }, [searchParams, key, defaultValue]);

  const setValue = useCallback(
    (newValue: T) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);

          if (
            newValue === defaultValue ||
            newValue === "" ||
            (Array.isArray(newValue) && newValue.length === 0)
          ) {
            next.delete(key);
          } else if (Array.isArray(newValue)) {
            next.set(key, newValue.join(","));
          } else {
            next.set(key, String(newValue));
          }

          return next;
        },
        { replace: true },
      );
    },
    [key, defaultValue, setSearchParams],
  );

  return [value, setValue];
}
