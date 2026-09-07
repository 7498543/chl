import { useEffect, useRef, useState } from "react";

/** IntersectionObserver 选项 */
interface IntersectionObserverOptions {
  /** 阈值（0-1） */
  threshold?: number | number[];
  /** 根元素 */
  root?: Element | Document | null;
  /** 根边距 */
  rootMargin?: string;
  /** 是否只触发一次 */
  once?: boolean;
}

/** useIntersectionObserver 返回值 */
interface UseIntersectionObserverReturn {
  /** 是否可见 */
  isIntersecting: boolean;
  /** 相交比例 */
  intersectionRatio: number;
  /** 目标元素 ref */
  ref: React.RefObject<HTMLElement | null>;
  /** 手动断开连接 */
  disconnect: () => void;
  /** 重新观察 */
  observe: () => void;
}

/**
 * 交叉观察器 Hook
 *
 * 用于懒加载、无限滚动、曝光统计等场景
 *
 * @param options 配置选项
 *
 * @example
 * ```ts
 * // 懒加载
 * const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
 *
 * // 无限滚动（只触发一次）
 * const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.5, once: true });
 * useEffect(() => { if (isIntersecting) loadMore(); }, [isIntersecting]);
 * ```
 */
export function useIntersectionObserver(
  options: IntersectionObserverOptions = {},
): UseIntersectionObserverReturn {
  const { threshold = 0, root = null, rootMargin = "0px", once = false } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [intersectionRatio, setIntersectionRatio] = useState(0);
  const targetRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const hasTriggeredRef = useRef(false);

  const disconnect = () => {
    observerRef.current?.disconnect();
    observerRef.current = null;
  };

  const observe = () => {
    disconnect();

    if (!targetRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        setIsIntersecting(entry.isIntersecting);
        setIntersectionRatio(entry.intersectionRatio);

        if (once && entry.isIntersecting && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          disconnect();
        }
      },
      { threshold, root, rootMargin },
    );

    observerRef.current.observe(targetRef.current);
  };

  useEffect(() => {
    observe();
    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold, root, rootMargin, once]);

  return {
    isIntersecting,
    intersectionRatio,
    ref: targetRef,
    disconnect,
    observe,
  };
}
