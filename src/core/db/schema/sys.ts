import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createSchema, enabled } from "../tool";

export const user = pgTable(
  "user",
  createSchema({
    id: serial("id").primaryKey(),
    email: text("email").unique().notNull(),
    username: text("username").unique().notNull(),
    nickname: text("nickname").notNull(),
    password: text("password").notNull(),
    avatar: text("avatar"),
    role: text("role").default("user").notNull(),
    lastLoginAt: timestamp("last_login_at"),
    enabled: enabled(),
  }),
);

export type User = typeof user.$inferSelect;
export type UserInsert = typeof user.$inferInsert;

