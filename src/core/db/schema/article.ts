import { index, integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { createSchema, enabled, sort } from "../tool";
import { assetLib } from "./asset";
import { seoMeta, tag, user } from "./sys";

/* ──────────────────── 文章分类 ──────────────────── */

export const articleCategory = pgTable(
  "article_category",
  createSchema({
    id: serial("id").primaryKey(),
    /** 分类名称 */
    name: varchar("name", { length: 200 }).notNull(),
    /** 分类图标（CSS class 或 emoji） */
    icon: varchar("icon", { length: 100 }),
    /** 关联 SEO */
    seoMetaId: integer("seo_meta_id").references(() => seoMeta.id, {
      onDelete: "set null",
    }),
    /** 封面图片 */
    coverId: integer("cover_id").references(() => assetLib.id, {
      onDelete: "set null",
    }),
    /** 分类路由 */
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    /** 排序 */
    sort: sort(),
    /** 是否启用 */
    enabled: enabled(),
  }),
  (table) => [
    index("idx_category_enabled").on(table.enabled),
    index("idx_category_sort").on(table.sort),
  ],
);

/* ──────────────────── 文章 ──────────────────── */

export const article = pgTable(
  "article",
  createSchema({
    id: serial("id").primaryKey(),
    /** 文章标题 */
    title: varchar("title", { length: 500 }).notNull(),
    /** 文章摘要 */
    description: text("description"),
    /** 文章正文（支持 Markdown / HTML） */
    content: text("content"),
    /** 封面图片 */
    coverId: integer("cover_id").references(() => assetLib.id, {
      onDelete: "set null",
    }),
    /** 关联 SEO */
    seoMetaId: integer("seo_meta_id").references(() => seoMeta.id, {
      onDelete: "set null",
    }),
    /** 作者 */
    userId: integer("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    /** 所属分类 */
    categoryId: integer("category_id").references(() => articleCategory.id, {
      onDelete: "set null",
    }),
    /** 排序 */
    sort: sort(),
    /** 是否启用 */
    enabled: enabled(),
  }),
  (table) => [
    index("idx_article_user").on(table.userId),
    index("idx_article_category").on(table.categoryId),
    index("idx_article_enabled").on(table.enabled),
    index("idx_article_sort").on(table.sort),
  ],
);

/* ──────────────────── 文章-标签 多对多关联 ──────────────────── */

export const articleTag = pgTable(
  "article_tag",
  createSchema({
    id: serial("id").primaryKey(),
    articleId: integer("article_id")
      .notNull()
      .references(() => article.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
  }),
  (table) => [
    index("idx_article_tag_article").on(table.articleId),
    index("idx_article_tag_tag").on(table.tagId),
  ],
);

/* ──────────────────── 导出类型 ──────────────────── */

export type Article = typeof article.$inferSelect;
export type ArticleInsert = typeof article.$inferInsert;

export type ArticleCategory = typeof articleCategory.$inferSelect;
export type ArticleCategoryInsert = typeof articleCategory.$inferInsert;

export type ArticleTag = typeof articleTag.$inferSelect;
export type ArticleTagInsert = typeof articleTag.$inferInsert;
