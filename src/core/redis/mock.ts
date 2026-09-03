import type { RedisAdapter, PipelineCommand, PipelineResult } from "./adapter";

/**
 * Mock Redis 适配器
 * 当 Redis 不可用时，提供一个内存中的替代实现，方便开发调试
 */
export class MockRedisAdapter implements RedisAdapter {
  private store = new Map<string, string>();
  private hashStore = new Map<string, Map<string, string>>();
  private listStore = new Map<string, string[]>();
  private setStore = new Map<string, Set<string>>();
  private zsetStore = new Map<string, Map<string, number>>();
  private ttlMap = new Map<string, number>();
  private connected = false;

  async connect(): Promise<void> {
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    this.store.clear();
    this.hashStore.clear();
    this.listStore.clear();
    this.setStore.clear();
    this.zsetStore.clear();
    this.ttlMap.clear();
  }

  isConnected(): boolean {
    return this.connected;
  }

  // ========== String 操作 ==========

  async set(key: string, value: string | number | Buffer, ttl?: number): Promise<void> {
    this.store.set(key, String(value));
    if (ttl) {
      this.ttlMap.set(key, Date.now() + ttl * 1000);
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.isExpired(key)) {
      this.store.delete(key);
      return null;
    }
    return this.store.get(key) ?? null;
  }

  async del(key: string): Promise<number> {
    const deleted = this.store.has(key) ? 1 : 0;
    this.store.delete(key);
    this.hashStore.delete(key);
    this.listStore.delete(key);
    this.setStore.delete(key);
    this.zsetStore.delete(key);
    this.ttlMap.delete(key);
    return deleted;
  }

  async expire(key: string, seconds: number): Promise<number> {
    if (this.store.has(key) || this.hashStore.has(key)) {
      this.ttlMap.set(key, Date.now() + seconds * 1000);
      return 1;
    }
    return 0;
  }

  async ttl(key: string): Promise<number> {
    const expireTime = this.ttlMap.get(key);
    if (!expireTime) return -1;
    const remaining = Math.ceil((expireTime - Date.now()) / 1000);
    return remaining > 0 ? remaining : -2;
  }

  async exists(key: string): Promise<number> {
    if (this.isExpired(key)) return 0;
    return this.store.has(key) ? 1 : 0;
  }

  async incr(key: string): Promise<number> {
    const current = parseInt(this.store.get(key) ?? "0", 10) + 1;
    this.store.set(key, String(current));
    return current;
  }

  // ========== Hash 操作 ==========

  async hset(key: string, field: string, value: string | number): Promise<number> {
    if (!this.hashStore.has(key)) {
      this.hashStore.set(key, new Map());
    }
    const map = this.hashStore.get(key)!;
    const isNew = !map.has(field);
    map.set(field, String(value));
    return isNew ? 1 : 0;
  }

  async hget(key: string, field: string): Promise<string | null> {
    return this.hashStore.get(key)?.get(field) ?? null;
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    const map = this.hashStore.get(key);
    if (!map) return {};
    const result: Record<string, string> = {};
    map.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    const map = this.hashStore.get(key);
    if (!map) return 0;
    let count = 0;
    for (const field of fields) {
      if (map.delete(field)) count++;
    }
    return count;
  }

  async hkeys(key: string): Promise<string[]> {
    const map = this.hashStore.get(key);
    return map ? Array.from(map.keys()) : [];
  }

  async hincrby(key: string, field: string, increment: number): Promise<number> {
    const map = this.hashStore.get(key) ?? new Map();
    if (!this.hashStore.has(key)) this.hashStore.set(key, map);
    const current = parseInt(map.get(field) ?? "0", 10) + increment;
    map.set(field, String(current));
    return current;
  }

  // ========== List 操作 ==========

  private ensureList(key: string): string[] {
    if (!this.listStore.has(key)) {
      this.listStore.set(key, []);
    }
    return this.listStore.get(key)!;
  }

  async lpush(key: string, ...values: (string | number)[]): Promise<number> {
    const list = this.ensureList(key);
    list.unshift(...values.map(String));
    return list.length;
  }

  async rpush(key: string, ...values: (string | number)[]): Promise<number> {
    const list = this.ensureList(key);
    list.push(...values.map(String));
    return list.length;
  }

  async lpop(key: string): Promise<string | null> {
    const list = this.listStore.get(key);
    if (!list || list.length === 0) return null;
    return list.shift() ?? null;
  }

  async rpop(key: string): Promise<string | null> {
    const list = this.listStore.get(key);
    if (!list || list.length === 0) return null;
    return list.pop() ?? null;
  }

  async llen(key: string): Promise<number> {
    return this.listStore.get(key)?.length ?? 0;
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    const list = this.listStore.get(key) ?? [];
    const actualStop = stop < 0 ? list.length + stop : stop;
    return list.slice(start, actualStop + 1);
  }

  // ========== Set 操作 ==========

  private ensureSet(key: string): Set<string> {
    if (!this.setStore.has(key)) {
      this.setStore.set(key, new Set());
    }
    return this.setStore.get(key)!;
  }

  async sadd(key: string, ...members: (string | number)[]): Promise<number> {
    const set = this.ensureSet(key);
    let count = 0;
    for (const member of members.map(String)) {
      if (!set.has(member)) {
        set.add(member);
        count++;
      }
    }
    return count;
  }

  async smembers(key: string): Promise<string[]> {
    return Array.from(this.setStore.get(key) ?? []);
  }

  async srem(key: string, ...members: (string | number)[]): Promise<number> {
    const set = this.setStore.get(key);
    if (!set) return 0;
    let count = 0;
    for (const member of members.map(String)) {
      if (set.delete(member)) count++;
    }
    return count;
  }

  async sismember(key: string, member: string | number): Promise<number> {
    return this.setStore.get(key)?.has(String(member)) ? 1 : 0;
  }

  async scard(key: string): Promise<number> {
    return this.setStore.get(key)?.size ?? 0;
  }

  // ========== Sorted Set 操作 ==========

  private ensureZSet(key: string): Map<string, number> {
    if (!this.zsetStore.has(key)) {
      this.zsetStore.set(key, new Map());
    }
    return this.zsetStore.get(key)!;
  }

  async zadd(key: string, score: number, member: string | number): Promise<number> {
    const zset = this.ensureZSet(key);
    const memberStr = String(member);
    const isNew = !zset.has(memberStr);
    zset.set(memberStr, score);
    return isNew ? 1 : 0;
  }

  async zrange(key: string, start: number, stop: number, withScores?: boolean): Promise<string[]> {
    const zset = this.zsetStore.get(key);
    if (!zset) return [];

    const sorted = Array.from(zset.entries()).sort(([, a], [, b]) => a - b);
    const actualStop = stop < 0 ? sorted.length + stop : stop;
    const sliced = sorted.slice(start, actualStop + 1);

    if (withScores) {
      return sliced.flatMap(([member, score]) => [member, String(score)]);
    }
    return sliced.map(([member]) => member);
  }

  async zrevrange(key: string, start: number, stop: number, withScores?: boolean): Promise<string[]> {
    const zset = this.zsetStore.get(key);
    if (!zset) return [];

    const sorted = Array.from(zset.entries()).sort(([, a], [, b]) => b - a);
    const actualStop = stop < 0 ? sorted.length + stop : stop;
    const sliced = sorted.slice(start, actualStop + 1);

    if (withScores) {
      return sliced.flatMap(([member, score]) => [member, String(score)]);
    }
    return sliced.map(([member]) => member);
  }

  async zrem(key: string, ...members: (string | number)[]): Promise<number> {
    const zset = this.zsetStore.get(key);
    if (!zset) return 0;
    let count = 0;
    for (const member of members.map(String)) {
      if (zset.delete(member)) count++;
    }
    return count;
  }

  async zcard(key: string): Promise<number> {
    return this.zsetStore.get(key)?.size ?? 0;
  }

  // ========== 批量操作 ==========

  async mset(pairs: Record<string, string | number | Buffer>): Promise<void> {
    Object.entries(pairs).forEach(([key, value]) => {
      this.store.set(key, String(value));
    });
  }

  async mget(...keys: string[]): Promise<(string | null)[]> {
    return keys.map((key) => this.store.get(key) ?? null);
  }

  async pipeline(commands: PipelineCommand[]): Promise<PipelineResult[]> {
    const results: PipelineResult[] = [];
    for (const cmd of commands) {
      try {
        const method = cmd.command as keyof MockRedisAdapter;
        if (typeof (this as any)[method] === "function") {
          const result = await (this as any)[method](...cmd.args);
          results.push({ error: null, result });
        } else {
          results.push({ error: new Error(`Unknown command: ${cmd.command}`), result: null });
        }
      } catch (error) {
        results.push({ error: error as Error, result: null });
      }
    }
    return results;
  }

  private isExpired(key: string): boolean {
    const expireTime = this.ttlMap.get(key);
    if (!expireTime) return false;
    if (Date.now() >= expireTime) {
      return true;
    }
    return false;
  }
}
