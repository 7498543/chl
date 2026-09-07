import { useEffect, useRef, useState } from "react";

/** 倒计时返回值 */
interface CountdownReturn {
  /** 剩余天数 */
  days: number;
  /** 剩余小时 */
  hours: number;
  /** 剩余分钟 */
  minutes: number;
  /** 剩余秒数 */
  seconds: number;
  /** 是否结束 */
  isEnd: boolean;
  /** 总剩余毫秒数 */
  total: number;
}

/**
 * 倒计时 Hook
 * @param target 目标时间
 * @param onEnd 倒计时结束回调
 * @example
 * ```ts
 * const { days, hours, minutes, seconds, isEnd } = useCountdown('2025-12-31');
 * ```
 */
export function useCountdown(target: string | Date | number, onEnd?: () => void): CountdownReturn {
  const calcRemaining = (): number => {
    const targetTime = new Date(target).getTime();
    return Math.max(0, targetTime - Date.now());
  };

  const [total, setTotal] = useState(calcRemaining);
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;
  const hasEndedRef = useRef(false);

  useEffect(() => {
    hasEndedRef.current = false;
    setTotal(calcRemaining());

    const timer = setInterval(() => {
      const remaining = calcRemaining();
      setTotal(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        if (!hasEndedRef.current) {
          hasEndedRef.current = true;
          onEndRef.current?.();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total % 86_400_000) / 3_600_000),
    minutes: Math.floor((total % 3_600_000) / 60_000),
    seconds: Math.floor((total % 60_000) / 1000),
    isEnd: total <= 0,
    total,
  };
}
