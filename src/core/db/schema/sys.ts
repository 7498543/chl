import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createSchema, enabled, sort } from "../tool";

/* ──────────────────── 用户角色枚举 ──────────────────── */

/** 用户角色 */
export const UserRole = pgEnum("user_role", ["admin", "editor", "user"]);

export type UserRoleEnum = (typeof UserRole.enumValues)[number];

/* ──────────────────── 用户表 ──────────────────── */

export const user = pgTable(
  "user",
  createSchema({
    id: serial("id").primaryKey(),
    /** 登录邮箱 */
    email: varchar("email", { length: 255 }).unique().notNull(),
    /** 登录名 */
    username: varchar("username", { length: 100 }).unique().notNull(),
    /** 显示昵称 */
    nickname: varchar("nickname", { length: 100 }).notNull(),
    /** 密码（bcrypt 哈希） */
    password: varchar("password", { length: 255 }).notNull(),
    /** 头像 URL */
    avatar: varchar("avatar", { length: 500 }),
    /** 角色 */
    role: UserRole("role").default("user").notNull(),
    /** 最后登录时间 */
    lastLoginAt: timestamp("last_login_at"),
    /** 是否启用 */
    enabled: enabled(),
  }),
);

/* ──────────────────── SEO 元数据（文章/页面共用） ──────────────────── */

/** Polypeptide：通过 type + targetId 关联不同业务实体 */
export const seoMeta = pgTable(
  "seo_meta",
  createSchema({
    id: serial("id").primaryKey(),
    /** 归属类型：page | article */
    type: varchar("type", { length: 30 }).notNull(),
    /** 归属实体 ID */
    targetId: integer("target_id").notNull(),
    /** SEO 标题 */
    title: varchar("title", { length: 200 }),
    /** SEO 关键词 */
    keywords: text("keywords"),
    /** SEO 描述 */
    description: text("description"),
    /** Open Graph 分享图 */
    ogImage: varchar("og_image", { length: 500 }),
    /** 权威链接 */
    canonical: varchar("canonical", { length: 500 }),
  }),
);

/* ──────────────────── 站点版本 ──────────────────── */

export const siteVersion = pgTable(
  "site_version",
  createSchema({
    id: serial("id").primaryKey(),
    /** 版本名称 */
    name: varchar("name", { length: 200 }).notNull(),
    /** 版本描述 */
    description: text("description"),
    /** 语义化版本号 */
    version: varchar("version", { length: 50 }).notNull(),
    /** 版本数据快照 */
    content: jsonb("content").notNull(),
    /** 是否启用 */
    enabled: enabled(),
  }),
);

/* ──────────────────── 页面 ──────────────────── */

export const page = pgTable(
  "page",
  createSchema({
    id: serial("id").primaryKey(),
    /** 页面名称 */
    name: varchar("name", { length: 200 }).notNull(),
    /** 页面路由 /slug */
    slug: varchar("slug", { length: 200 }).notNull(),
    /** 绑定的站点版本 */
    siteVersionId: integer("site_version_id").references(() => siteVersion.id),
    /** 页面内容（JSON 结构） */
    content: jsonb("content").notNull(),
    /** 是否启用 */
    enabled: enabled(),
  }),
);

/* ──────────────────── 标签 ──────────────────── */

export const tag = pgTable(
  "tag",
  createSchema({
    id: serial("id").primaryKey(),
    /** 标签名称 */
    name: varchar("name", { length: 100 }).notNull().unique(),
    /** 排序 */
    sort: sort(),
    /** 是否启用 */
    enabled: enabled(),
  }),
);

export type User = typeof user.$inferSelect;
export type UserInsert = typeof user.$inferInsert;

export type Tag = typeof tag.$inferSelect;
export type TagInsert = typeof tag.$inferInsert;

export type Page = typeof page.$inferSelect;
export type PageInsert = typeof page.$inferInsert;

export type SiteVersion = typeof siteVersion.$inferSelect;
export type SiteVersionInsert = typeof siteVersion.$inferInsert;

export type SeoMeta = typeof seoMeta.$inferSelect;
export type SeoMetaInsert = typeof seoMeta.$inferInsert;
