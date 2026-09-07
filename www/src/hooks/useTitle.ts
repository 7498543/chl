import { useEffect, useRef } from "react";

/**
 * 页面标题管理 Hook
 *
 * @param title 页面标题（会附加网站名称）
 * @param siteName 网站名称（默认从 constants 读取）
 *
 * @example
 * ```ts
 * // 设置页面标题
 * useTitle('首页');
 * // 结果: document.title = '首页 | CHL'
 *
 * // 单独设置完整标题
 * useTitle('自定义页面标题', false);
 * // 结果: document.title = '自定义页面标题'
 * ```
 */
export function useTitle(title: string, siteName?: string | false): void {
  const defaultSiteName = ""; // 可从 constants 中读取 SITE_NAME
  const resolvedName = siteName === false ? "" : siteName || defaultSiteName;
  const prevTitleRef = useRef(document.title);

  useEffect(() => {
    prevTitleRef.current = document.title;
    document.title = resolvedName ? `${title} | ${resolvedName}` : title;

    return () => {
      document.title = prevTitleRef.current;
    };
  }, [title, resolvedName]);
}
