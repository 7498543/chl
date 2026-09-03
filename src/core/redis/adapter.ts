/**
 * Redis 适配器接口
 * 支持多种 Redis 客户端实现，业务层无感切换
 */
export interface RedisAdapter {
  /**
   * 连接 Redis
   */
  connect(): Promise<void>;

  /**
   * 断开连接
   */
  disconnect(): Promise<void>;

  /**
   * 是否已连接
   */
  isConnected(): boolean;

  // ========== String 操作 ==========

  /** 设置键值 */
  set(key: string, value: string | number | Buffer, ttl?: number): Promise<void>;

  /** 获取值 */
  get(key: string): Promise<string | null>;

  /** 删除键 */
  del(key: string): Promise<number>;

  /** 设置过期时间（秒） */
  expire(key: string, seconds: number): Promise<number>;

  /** 获取键的剩余过期时间（秒） */
  ttl(key: string): Promise<number>;

  /** 键是否存在 */
  exists(key: string): Promise<number>;

  /** 原子递增 */
  incr(key: string): Promise<number>;

  // ========== Hash 操作 ==========

  /** 设置哈希字段 */
  hset(key: string, field: string, value: string | number): Promise<number>;

  /** 获取哈希字段 */
  hget(key: string, field: string): Promise<string | null>;

  /** 获取整个哈希 */
  hgetall(key: string): Promise<Record<string, string>>;

  /** 删除哈希字段 */
  hdel(key: string, ...fields: string[]): Promise<number>;

  /** 获取哈希所有字段 */
  hkeys(key: string): Promise<string[]>;

  /** 递增哈希字段 */
  hincrby(key: string, field: string, increment: number): Promise<number>;

  // ========== List 操作 ==========

  /** 从左侧推入 */
  lpush(key: string, ...values: (string | number)[]): Promise<number>;

  /** 从右侧推入 */
  rpush(key: string, ...values: (string | number)[]): Promise<number>;

  /** 从左侧弹出 */
  lpop(key: string): Promise<string | null>;

  /** 从右侧弹出 */
  rpop(key: string): Promise<string | null>;

  /** 获取列表长度 */
  llen(key: string): Promise<number>;

  /** 获取列表范围 */
  lrange(key: string, start: number, stop: number): Promise<string[]>;

  // ========== Set 操作 ==========

  /** 添加集合成员 */
  sadd(key: string, ...members: (string | number)[]): Promise<number>;

  /** 获取集合所有成员 */
  smembers(key: string): Promise<string[]>;

  /** 移除集合成员 */
  srem(key: string, ...members: (string | number)[]): Promise<number>;

  /** 判断是否为集合成员 */
  sismember(key: string, member: string | number): Promise<number>;

  /** 获取集合大小 */
  scard(key: string): Promise<number>;

  // ========== Sorted Set 操作 ==========

  /** 添加有序集合成员 */
  zadd(key: string, score: number, member: string | number): Promise<number>;

  /** 获取有序集合范围（按分数升序） */
  zrange(key: string, start: number, stop: number, withScores?: boolean): Promise<string[]>;

  /** 获取有序集合范围（按分数降序） */
  zrevrange(key: string, start: number, stop: number, withScores?: boolean): Promise<string[]>;

  /** 移除有序集合成员 */
  zrem(key: string, ...members: (string | number)[]): Promise<number>;

  /** 获取有序集合大小 */
  zcard(key: string): Promise<number>;

  // ========== 批量操作 ==========

  /** 批量设置 */
  mset(pairs: Record<string, string | number | Buffer>): Promise<void>;

  /** 批量获取 */
  mget(...keys: string[]): Promise<(string | null)[]>;

  /** 管道（批量执行命令） */
  pipeline(commands: PipelineCommand[]): Promise<PipelineResult[]>;
}

/** 管道命令 */
export interface PipelineCommand {
  command: string;
  args: (string | number | Buffer)[];
}

/** 管道结果 */
export interface PipelineResult {
  error: Error | null;
  result: unknown;
}

/** 键值对缓存选项 */
export interface CacheOptions {
  /** 过期时间（秒） */
  ttl?: number;
  /** 缓存键前缀的命名空间 */
  namespace?: string;
}
