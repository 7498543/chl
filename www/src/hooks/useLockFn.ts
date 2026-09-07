import { useCallback, useRef } from "react";

/**
 * 函数锁 Hook（防重复提交）
 *
 * 在异步函数执行期间锁定，防止重复调用
 * 常用于提交按钮、表单保存等场景
 *
 * @param fn 需要加锁的异步函数
 * @returns [lockedFn, isLocking]
 *
 * @example
 * ```ts
 * const [submit, isSubmitting] = useLockFn(async () => {
 *   await api.submit(data);
 * });
 *
 * return (
 *   <button onClick={submit} disabled={isSubmitting}>
 *     {isSubmitting ? '提交中...' : '提交'}
 *   </button>
 * );
 * ```
 */
export function useLockFn<P extends unknown[], R = unknown>(
  fn: (...args: P) => Promise<R>,
): [(...args: P) => Promise<R | undefined>, boolean] {
  const lockRef = useRef(false);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const lockedFn = useCallback(async (...args: P): Promise<R | undefined> => {
    if (lockRef.current) return undefined;

    lockRef.current = true;
    try {
      return await fnRef.current(...args);
    } finally {
      lockRef.current = false;
    }
  }, []);

  return [lockedFn, lockRef.current];
}
