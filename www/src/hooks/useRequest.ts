import { useCallback, useRef, useState } from "react";

/** 请求状态 */
interface RequestState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/** useRequest 返回值 */
interface UseRequestReturn<T> extends RequestState<T> {
  /** 执行请求 */
  run: (...args: unknown[]) => Promise<T | undefined>;
  /** 重置状态 */
  reset: () => void;
  /** 手动设置数据 */
  setData: (data: T | null) => void;
  /** 刷新（重新执行上一次请求） */
  refresh: () => Promise<T | undefined>;
}

/**
 * 带状态管理的异步请求 Hook
 * @param service 异步请求函数
 * @param defaultData 默认数据
 * @example
 * ```ts
 * const { data, loading, error, run } = useRequest(
 *   (id: number) => api.getUser(id)
 * );
 * ```
 */
export function useRequest<T = unknown>(
  service: (...args: unknown[]) => Promise<T>,
  defaultData: T | null = null,
): UseRequestReturn<T> {
  const [state, setState] = useState<RequestState<T>>({
    data: defaultData,
    loading: false,
    error: null,
  });

  const serviceRef = useRef(service);
  const lastArgsRef = useRef<unknown[]>([]);
  const mountedRef = useRef(true);

  serviceRef.current = service;

  const run = useCallback(async (...args: unknown[]): Promise<T | undefined> => {
    lastArgsRef.current = args;
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await serviceRef.current(...args);
      if (mountedRef.current) {
        setState({ data, loading: false, error: null });
      }
      return data;
    } catch (error) {
      if (mountedRef.current) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error : new Error(String(error)),
        }));
      }
      return undefined;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: defaultData, loading: false, error: null });
  }, [defaultData]);

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  const refresh = useCallback(async (): Promise<T | undefined> => {
    if (lastArgsRef.current.length > 0) {
      return run(...lastArgsRef.current);
    }
    return undefined;
  }, [run]);

  return {
    ...state,
    run,
    reset,
    setData,
    refresh,
  };
}
