import { useCallback, useState } from "react";

/**
 * 开关状态 Hook
 * @param defaultValue 初始值（默认 false）
 * @example
 * ```ts
 * const [visible, toggleVisible] = useToggle();
 * const [loading, setLoading, toggleLoading] = useToggle(true);
 * ```
 */
export function useToggle(defaultValue = false): [boolean, (value?: boolean) => void] {
  const [value, setValue] = useState(defaultValue);

  const toggle = useCallback((value?: boolean) => {
    setValue((prev) => (value !== undefined ? value : !prev));
  }, []);

  return [value, toggle];
}
