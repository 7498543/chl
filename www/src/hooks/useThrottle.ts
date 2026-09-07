import { useEffect, useRef, useState } from "react";

/**
 * 节流值 Hook
 * @param value 需要节流的值
 * @param delay 间隔时间（毫秒）
 * @example
 * ```ts
 * const throttledValue = useThrottle(scrollY, 200);
 * ```
 */
export function useThrottle<T>(value: T, delay = 300): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastRunRef = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastRunRef.current;

    if (elapsed >= delay) {
      lastRunRef.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastRunRef.current = Date.now();
        setThrottledValue(value);
      }, delay - elapsed);

      return () => clearTimeout(timer);
    }
  }, [value, delay]);

  return throttledValue;
}

/**
 * 节流函数 Hook
 * @param fn 需要节流的函数
 * @param delay 间隔时间（毫秒）
 * @example
 * ```ts
 * const throttledScroll = useThrottleFn(() => handleScroll(), 200);
 * ```
 */
export function useThrottleFn<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay = 300,
): (...args: Parameters<T>) => void {
  const lastRunRef = useRef(0);
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
    const now = Date.now();
    const elapsed = now - lastRunRef.current;

    if (elapsed >= delay) {
      lastRunRef.current = now;
      fnRef.current(...args);
    } else if (!timerRef.current) {
      timerRef.current = setTimeout(() => {
        lastRunRef.current = Date.now();
        timerRef.current = null;
        fnRef.current(...args);
      }, delay - elapsed);
    }
  };
}
