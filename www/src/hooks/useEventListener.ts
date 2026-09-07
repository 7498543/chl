import { useEffect, useRef } from "react";

/**
 * 事件监听 Hook
 * @param event 事件名称
 * @param handler 事件处理函数
 * @param target 目标元素（默认 window）
 * @param options 监听选项
 * @example
 * ```ts
 * useEventListener('scroll', (e) => console.log(e));
 * useEventListener('click', (e) => handleClick(e), buttonRef.current);
 * ```
 */
export function useEventListener<K extends keyof WindowEventMap>(
  event: K,
  handler: (event: WindowEventMap[K]) => void,
  target?: EventTarget | null,
  options?: AddEventListenerOptions | boolean,
): void;

export function useEventListener<K extends keyof DocumentEventMap>(
  event: K,
  handler: (event: DocumentEventMap[K]) => void,
  target: Document,
  options?: AddEventListenerOptions | boolean,
): void;

export function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLElement,
>(
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  target: T | null,
  options?: AddEventListenerOptions | boolean,
): void;

export function useEventListener(
  event: string,
  handler: (...args: unknown[]) => void,
  target: EventTarget | null = window,
  options?: AddEventListenerOptions | boolean,
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!target?.addEventListener) return;

    const eventHandler = (event: Event) => {
      handlerRef.current(event);
    };

    target.addEventListener(event, eventHandler, options);
    return () => {
      target.removeEventListener(event, eventHandler, options);
    };
  }, [event, target, options]);
}
