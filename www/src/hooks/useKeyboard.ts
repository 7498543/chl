import { useEffect } from "react";

/** 键盘快捷键配置 */
interface KeyboardShortcut {
  /** 按键 */
  key: string;
  /** 是否同时按 Ctrl/Cmd */
  ctrl?: boolean;
  /** 是否同时按 Shift */
  shift?: boolean;
  /** 是否同时按 Alt */
  alt?: boolean;
  /** 是否仅在特定元素内生效 */
  target?: HTMLElement | null;
}

/**
 * 键盘快捷键 Hook
 *
 * @param shortcut 快捷键配置或按键字符串
 * @param handler 回调函数
 * @param enabled 是否启用（默认 true）
 *
 * @example
 * ```ts
 * // 按 Escape 键
 * useKeyboard('Escape', () => setOpen(false));
 *
 * // Ctrl+S 保存
 * useKeyboard({ key: 's', ctrl: true }, () => save());
 *
 * // Ctrl+Shift+F 搜索
 * useKeyboard({ key: 'f', ctrl: true, shift: true }, () => openSearch());
 *
 * // 条件启用
 * useKeyboard('Escape', () => close(), isOpen);
 * ```
 */
export function useKeyboard(
  shortcut: string | KeyboardShortcut,
  handler: (event: KeyboardEvent) => void,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: KeyboardEvent) => {
      const config: KeyboardShortcut = typeof shortcut === "string" ? { key: shortcut } : shortcut;

      // 检查修饰键
      const ctrlOrMeta = event.ctrlKey || event.metaKey;
      const matchCtrl = config.ctrl ? ctrlOrMeta : !ctrlOrMeta;
      const matchShift = config.shift ? event.shiftKey : !event.shiftKey;
      const matchAlt = config.alt ? event.altKey : !event.altKey;

      if (!matchCtrl || !matchShift || !matchAlt) return;

      // 检查按键
      if (event.key.toLowerCase() !== config.key.toLowerCase()) return;

      // 检查目标元素
      if (config.target && config.target !== event.target) return;

      // 禁止在输入框内触发非 Escape 快捷键
      const target = event.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if (isInput && config.key !== "Escape") return;

      event.preventDefault();
      handler(event);
    };

    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [shortcut, handler, enabled]);
}
