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
 * 可选外键净化：将 0 / null / undefined / 空字符串 / NaN 统一转为 null
 *
 * @description 前端表单常传 0 表示"无关联"，但数据库 FK 约束要求 NULL 才能跳过。
 *              DTO 校验后可能残留 ""、NaN 等异常值，统一防御处理。
 *
 * @example
 *   values({ albumId: fk(dto.albumId) })
 */
export function fk(v: unknown): number | null {
  if (v == null || v === 0 || v === "" || (typeof v === "number" && isNaN(v))) return null;
  return Number(v);
}
