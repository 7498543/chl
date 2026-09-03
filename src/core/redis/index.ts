import { useRuntimeConfig } from "@/core/env";
import { logger } from "@/core/logger";
import type { RedisAdapter, CacheOptions } from "./adapter";
import { IORedisAdapter } from "./ioredis";
import { MockRedisAdapter } from "./mock";

const redisInstances = new Map<string, RedisAdapter>();

/**
 * 格式化缓存键：[namespace]:[key]
 * @example formatKey("user:info", 123) → "user:info:123"
 */
export function formatKey(namespace: string, key?: string | number): string {
  if (!key) {
    return namespace;
  }
  return `${namespace}:${key}`;
}

/**
 * 初始化 Redis
 */
export function initRedis(name = "main"): RedisAdapter {
  if (redisInstances.has(name)) {
    return redisInstances.get(name)!;
  }

  const config = useRuntimeConfig();

  let adapter: RedisAdapter;

  if (config.REDIS_ENABLED !== "true") {
    logger.info("[Redis] Disabled, using MockRedisAdapter");
    adapter = new MockRedisAdapter();
    adapter.connect().catch((err) => {
      logger.error("[Redis] Mock connect error", { error: err });
    });
  } else {
    adapter = new IORedisAdapter({
      host: config.REDIS_HOST,
      port: parseInt(config.REDIS_PORT, 10) || 6379,
      password: config.REDIS_PASSWORD,
      db: parseInt(config.REDIS_DB, 10) || 0,
    });
    logger.info(
      `[Redis] Enabled, connecting to ${config.REDIS_HOST}:${config.REDIS_PORT}/${config.REDIS_DB}`,
    );
  }

  redisInstances.set(name, adapter);
  return adapter;
}

/**
 * 获取 Redis 实例
 */
export function getRedis(name = "main"): RedisAdapter {
  if (!redisInstances.has(name)) {
    throw new Error(`Redis instance "${name}" not initialized. Call initRedis() first.`);
  }
  return redisInstances.get(name)!;
}

/**
 * 关闭 Redis 连接
 */
export async function closeRedis(name?: string): Promise<void> {
  if (!name) {
    const promises: Promise<void>[] = [];
    redisInstances.forEach((instance) => promises.push(instance.disconnect()));
    await Promise.all(promises);
    redisInstances.clear();
    return;
  } else if (redisInstances.has(name)) {
    await redisInstances.get(name)!.disconnect();
    redisInstances.delete(name);
  }
}

/**
 * 通用缓存工具类
 */
export class CacheClient {
  constructor(
    private readonly redis: RedisAdapter,
    private readonly defaultNamespace: string = "cache",
  ) {}

  /**
   * 获取缓存值（自动处理命名空间）
   */
  async get<T = string>(key: string, options?: Omit<CacheOptions, "ttl">): Promise<T | null> {
    const { namespace = this.defaultNamespace } = options || {};
    const formattedKey = formatKey(namespace, key);
    const value = await this.redis.get(formattedKey);
    if (value === null) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }

  /**
   * 设置缓存（自动处理命名空间，自动 JSON 序列化）
   */
  async set(key: string, value: any, options?: CacheOptions): Promise<void> {
    const { namespace = this.defaultNamespace, ttl } = options || {};
    const formattedKey = formatKey(namespace, key);
    const data = typeof value === "string" ? value : JSON.stringify(value);
    await this.redis.set(formattedKey, data, ttl);
  }

  /**
   * 删除缓存
   */
  async delete(key: string, options?: Omit<CacheOptions, "ttl">): Promise<number> {
    const { namespace = this.defaultNamespace } = options || {};
    const formattedKey = formatKey(namespace, key);
    return this.redis.del(formattedKey);
  }

  /**
   * 缓存穿透防护：不存在的 key 也写入一个空占位符
   */
  async getOrSet<T>(
    key: string,
    getter: () => Promise<T>,
    options: CacheOptions & { nullTtl?: number },
  ): Promise<T> {
    const { namespace = this.defaultNamespace, ttl, nullTtl = 60 } = options;
    const formattedKey = formatKey(namespace, key);

    const cached = await this.redis.get(formattedKey);
    if (cached !== null) {
      if (cached === "__NULL__") {
        return null as T;
      }
      try {
        return JSON.parse(cached) as T;
      } catch {
        return cached as unknown as T;
      }
    }

    const data = await getter();

    if (data === null || data === undefined) {
      await this.redis.set(formattedKey, "__NULL__", nullTtl);
    } else {
      const dataStr = typeof data === "string" ? data : JSON.stringify(data);
      await this.redis.set(formattedKey, dataStr, ttl);
    }

    return data;
  }

  /**
   * 递增计数
   */
  async incr(key: string, options?: Omit<CacheOptions, "ttl">): Promise<number> {
    const { namespace = this.defaultNamespace } = options || {};
    const formattedKey = formatKey(namespace, key);
    return this.redis.incr(formattedKey);
  }

  /**
   * 判断 key 是否存在
   */
  async exists(key: string, options?: Omit<CacheOptions, "ttl">): Promise<boolean> {
    const { namespace = this.defaultNamespace } = options || {};
    const formattedKey = formatKey(namespace, key);
    const count = await this.redis.exists(formattedKey);
    return count > 0;
  }

  /**
   * 设置过期时间
   */
  async expire(
    key: string,
    seconds: number,
    options?: Omit<CacheOptions, "ttl">,
  ): Promise<boolean> {
    const { namespace = this.defaultNamespace } = options || {};
    const formattedKey = formatKey(namespace, key);
    const result = await this.redis.expire(formattedKey, seconds);
    return result > 0;
  }
}

export const redis = initRedis();
export const cache = new CacheClient(redis);
