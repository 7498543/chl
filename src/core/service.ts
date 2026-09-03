import { getDB } from "./db";
import { getRedis } from "./redis";
import { softDelete, restore, notDeleted } from "./db/softDelete";
import type { RedisAdapter } from "./redis/adapter";

export class BaseService {
  /**
   * 获取数据库实例
   */
  protected db(name?: string) {
    return getDB(name)!.db;
  }

  /**
   * 获取 Redis 实例
   */
  protected redis(name?: string): RedisAdapter {
    return getRedis(name);
  }

  /**
   * 软删除过滤条件
   * @description 用于 SELECT 查询的 WHERE 子句，过滤掉已软删除的记录
   * @example db.select().from(table).where(this.notDeleted(table))
   */
  protected notDeleted(table: any) {
    return notDeleted(table);
  }

  /**
   * 软删除
   * @description 将记录的 deletedAt 设为当前时间，标记为已删除
   */
  protected async softDelete(table: any, id: number, name?: string) {
    return softDelete(this.db(name), table, id);
  }

  /**
   * 恢复软删除
   * @description 将记录的 deletedAt 设为 null，恢复已删除的记录
   */
  protected async restore(table: any, id: number, name?: string) {
    return restore(this.db(name), table, id);
  }
}
