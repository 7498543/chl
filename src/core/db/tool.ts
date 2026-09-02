import { integer, timestamp } from "drizzle-orm/pg-core";

export function createSchema(schema: any) {
  return {
    ...schema,
    createdAt: timestamp("created_at", {}).defaultNow(),
    updatedAt: timestamp("updated_at", {}).defaultNow(),
    deletedAt: timestamp("deleted_at", {}),
  };
}

export function sort(name: string = "sort", value: number = 0) {
  return integer(name).default(value);
}

export function enabled(name: string = "enabled", value: number = 1) {
  return integer(name).default(value);
}
