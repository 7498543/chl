import { useEffect, useRef, useState } from "react";

/**
 * 防抖值 Hook
 * @param value 需要防抖的值
 * @param delay 延迟时间（毫秒）
 * @example
 * ```ts
 * const debouncedValue = useDebounce(searchText, 300);
 * ```
 */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * 防抖函数 Hook
 * @param fn 需要防抖的函数
 * @param delay 延迟时间（毫秒）
 * @example
 * ```ts
 * const debouncedSearch = useDebounceFn((text: string) => search(text), 500);
 * ```
 */
export function useDebounceFn<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay = 300,
): (...args: Parameters<T>) => void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (...args: Parameters<T>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      fnRef.current(...args);
    }, delay);
  };
}
