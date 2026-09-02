import { isNull, eq, type SQL } from "drizzle-orm";

/**
 * 软删除条件：过滤 deletedAt IS NULL 的记录
 * @description 所有表通过 createSchema() 创建，运行时均有 deletedAt 列，
 *              但 drizzle 的 PgTable 类型系统无法表达此约束，故用 any 接收
 */
 
export function notDeleted(table: any): SQL {
  return isNull(table.deletedAt);
}

/**
 * 软删除更新值：设置 deletedAt 为当前时间
 */
export function softDeleteSet() {
  return { deletedAt: new Date() } as const;
}

/**
 * 恢复更新值：设置 deletedAt 为 null
 */
export function restoreSet() {
  return { deletedAt: null } as const;
}

/**
 * 执行软删除
 */
 
export async function softDelete(db: any, table: any, id: number) {
  return db.update(table).set(softDeleteSet()).where(eq(table.id, id));
}

/**
 * 恢复软删除
 */
 
export async function restore(db: any, table: any, id: number) {
  return db.update(table).set(restoreSet()).where(eq(table.id, id));
}
