import { useEffect, useRef, type RefObject } from "react";

/**
 * 点击外部检测 Hook
 *
 * 用于下拉菜单、弹窗、模态框等组件的关闭交互
 *
 * @param ref 目标元素的 ref
 * @param handler 点击外部时的回调
 * @param enabled 是否启用（默认 true）
 *
 * @example
 * ```ts
 * const ref = useRef<HTMLDivElement>(null);
 * useClickOutside(ref, () => setOpen(false));
 *
 * // 条件启用
 * useClickOutside(ref, () => setOpen(false), isOpen);
 * ```
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled = true,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!enabled) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains(event.target as Node)) return;
      handlerRef.current(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, enabled]);
}
