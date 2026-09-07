import { useEffect, useState } from "react";

/**
 * 响应式媒体查询 Hook
 *
 * @param query CSS 媒体查询字符串
 * @returns 是否匹配该媒体查询
 *
 * @example
 * ```ts
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isDark = useMediaQuery('(prefers-color-scheme: dark)');
 * const isDesktop = useMediaQuery('(min-width: 1024px)');
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/**
 * 预置断点 Hook
 *
 * @example
 * ```ts
 * const breakpoint = useBreakpoint();
 * if (breakpoint === 'sm') { // 移动端 }
 * if (breakpoint === 'lg') { // 桌面端 }
 * ```
 */
export function useBreakpoint(): "xs" | "sm" | "md" | "lg" | "xl" | "2xl" {
  const xs = useMediaQuery("(max-width: 639px)");
  const sm = useMediaQuery("(min-width: 640px) and (max-width: 767px)");
  const md = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const lg = useMediaQuery("(min-width: 1024px) and (max-width: 1279px)");
  const xl = useMediaQuery("(min-width: 1280px) and (max-width: 1535px)");
  const xxl = useMediaQuery("(min-width: 1536px)");

  if (xxl) return "2xl";
  if (xl) return "xl";
  if (lg) return "lg";
  if (md) return "md";
  if (sm) return "sm";
  return "xs";
}
