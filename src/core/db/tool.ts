import type { PgColumnBuilderBase } from "drizzle-orm/pg-core";
import { integer, timestamp } from "drizzle-orm/pg-core";

type SchemaColumns = Record<string, PgColumnBuilderBase>;

export function createSchema<T extends SchemaColumns>(schema: T) {
  return {
    ...schema,
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
    deletedAt: timestamp("deleted_at"),
  } as const;
}

export function sort(name: string = "sort", value: number = 0) {
  return integer(name).default(value).notNull();
}

export function enabled(name: string = "enabled", value: number = 1) {
  return integer(name).default(value).notNull();
}

/**
 * 可选外键净化：将 0 / null / undefined 统一转为 null
 *
 * @description 前端表单常传 0 表示"无关联"，但数据库 FK 约束要求 NULL 才能跳过。
 *              在 Service 写入 DB 前对可选外键字段调用此函数即可安全入库。
 *
 * @example
 *   values({ albumId: fk(dto.albumId) })
 */
export function fk(v: number | null | undefined): number | null {
  if (v === undefined || v === null || v === 0) return null;
  return v;
}
