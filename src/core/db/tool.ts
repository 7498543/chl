import { integer, timestamp } from "drizzle-orm/pg-core";
import type { PgColumnBuilderBase } from "drizzle-orm/pg-core";

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
