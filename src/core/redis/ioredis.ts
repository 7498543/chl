import Redis from "ioredis";
import type { RedisAdapter, PipelineCommand, PipelineResult } from "./adapter";

interface RedisConfig {
  host: string;
  port: number;
  password: string;
  db: number;
}

/**
 * ioredis 客户端实现 RedisAdapter
 */
export class IORedisAdapter implements RedisAdapter {
  private client: Redis | null = null;
  private connected = false;
  private config: RedisConfig;

  constructor(config: RedisConfig) {
    this.config = config;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const client = new Redis({
        host: this.config.host,
        port: this.config.port,
        password: this.config.password || undefined,
        db: this.config.db,
        lazyConnect: true,
      });

      client.on("ready", () => {
        this.connected = true;
        this.client = client;
        resolve();
      });

      client.on("error", (err) => {
        reject(err);
      });

      client.connect().catch(reject);
    });
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.disconnect();
      this.connected = false;
      this.client = null;
    }
  }

  isConnected(): boolean {
    return this.connected && this.client !== null;
  }

  async set(key: string, value: string | number | Buffer, ttl?: number): Promise<void> {
    if (!this.client) throw new Error("Redis not connected");
    if (ttl) {
      await this.client.set(key, value, "EX", ttl);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.get(key);
  }

  async del(key: string): Promise<number> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.del(key);
  }

  async expire(key: string, seconds: number): Promise<number> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.ttl(key);
  }

  async exists(key: string): Promise<number> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.exists(key);
  }

  async incr(key: string): Promise<number> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.incr(key);
  }

  async hset(key: string, field: string, value: string | number): Promise<number> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.hset(key, field, String(value));
  }

  async hget(key: string, field: string): Promise<string | null> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.hget(key, field);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.hgetall(key);
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.hdel(key, ...fields);
  }

  async hkeys(key: string): Promise<string[]> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.hkeys(key);
  }

  async hincrby(key: string, field: string, increment: number): Promise<number> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.hincrby(key, field, increment);
  }

  async lpush(key: string, ...values: (string | number)[]): Promise<number> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.lpush(key, ...values.map(String));
  }

  async rpush(key: string, ...values: (string | number)[]): Promise<number> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.rpush(key, ...values.map(String));
  }

  async lpop(key: string): Promise<string | null> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.lpop(key);
  }

  async rpop(key: string): Promise<string | null> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.rpop(key);
  }

  async llen(key: string): Promise<number> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.llen(key);
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.lrange(key, start, stop);
  }

  async sadd(key: string, ...members: (string | number)[]): Promise<number> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.sadd(key, ...members.map(String));
  }

  async smembers(key: string): Promise<string[]> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.smembers(key);
  }

  async srem(key: string, ...members: (string | number)[]): Promise<number> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.srem(key, ...members.map(String));
  }

  async sismember(key: string, member: string | number): Promise<number> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.sismember(key, String(member));
  }

  async scard(key: string): Promise<number> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.scard(key);
  }

  async zadd(key: string, score: number, member: string | number): Promise<number> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.zadd(key, score, String(member));
  }

  async zrange(key: string, start: number, stop: number, withScores?: boolean): Promise<string[]> {
    if (!this.client) throw new Error("Redis not connected");
    if (withScores) {
      const result = await this.client.zrange(key, start, stop, "WITHSCORES");
      return result;
    }
    return this.client.zrange(key, start, stop);
  }

  async zrevrange(
    key: string,
    start: number,
    stop: number,
    withScores?: boolean,
  ): Promise<string[]> {
    if (!this.client) throw new Error("Redis not connected");
    if (withScores) {
      const result = await this.client.zrevrange(key, start, stop, "WITHSCORES");
      return result;
    }
    return this.client.zrevrange(key, start, stop);
  }

  async zrem(key: string, ...members: (string | number)[]): Promise<number> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.zrem(key, ...members.map(String));
  }

  async zcard(key: string): Promise<number> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.zcard(key);
  }

  async mset(pairs: Record<string, string | number | Buffer>): Promise<void> {
    if (!this.client) throw new Error("Redis not connected");
    const args: (string | number | Buffer)[] = [];
    Object.entries(pairs).forEach(([k, v]) => {
      args.push(k);
      args.push(v);
    });
    await this.client.mset(args as any);
  }

  async mget(...keys: string[]): Promise<(string | null)[]> {
    if (!this.client) throw new Error("Redis not connected");
    return this.client.mget(keys);
  }

  async pipeline(commands: PipelineCommand[]): Promise<PipelineResult[]> {
    if (!this.client) throw new Error("Redis not connected");
    const pipeline = this.client.pipeline();

    for (const cmd of commands) {
      (pipeline as any)[cmd.command](...cmd.args);
    }

    const results = await pipeline.exec();
    return results.map(([error, result]) => ({
      error,
      result,
    }));
  }
}
