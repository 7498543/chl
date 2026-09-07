/**
 * 事件总线（发布订阅模式）
 *
 * 用于跨组件通信，例如：
 * - 页面 A 操作后通知页面 B 刷新数据
 * - 全局消息通知
 * - 非父子组件通信
 *
 * @example
 * ```ts
 * import { eventBus } from "@/lib/event";
 *
 * // 订阅事件
 * const unsub = eventBus.on("user:updated", (user) => {
 *   console.log("用户更新:", user);
 * });
 *
 * // 发布事件
 * eventBus.emit("user:updated", { id: 1, name: "Alice" });
 *
 * // 取消订阅
 * unsub();
 * ```
 */

type EventHandler = (...args: unknown[]) => void;

class EventBus {
  private events = new Map<string, Set<EventHandler>>();

  /** 订阅事件 */
  on(event: string, handler: EventHandler): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(handler);

    // 返回取消订阅函数
    return () => {
      this.off(event, handler);
    };
  }

  /** 取消订阅 */
  off(event: string, handler: EventHandler): void {
    this.events.get(event)?.delete(handler);
    if (this.events.get(event)?.size === 0) {
      this.events.delete(event);
    }
  }

  /** 发布事件 */
  emit(event: string, ...args: unknown[]): void {
    this.events.get(event)?.forEach((handler) => {
      try {
        handler(...args);
      } catch (error) {
        console.error(`[EventBus] 事件 "${event}" 处理出错:`, error);
      }
    });
  }

  /** 单次订阅（触发后自动取消） */
  once(event: string, handler: EventHandler): void {
    const wrapper: EventHandler = (...args: unknown[]) => {
      handler(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }

  /** 清空所有事件 */
  clear(): void {
    this.events.clear();
  }

  /** 清空指定事件的所有处理器 */
  clearEvent(event: string): void {
    this.events.delete(event);
  }

  /** 获取指定事件的处理器数量 */
  listenerCount(event: string): number {
    return this.events.get(event)?.size ?? 0;
  }
}

export const eventBus = new EventBus();
