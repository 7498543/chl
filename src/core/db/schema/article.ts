import { pgTable, serial, text, integer, index } from "drizzle-orm/pg-core";
import { createSchema, enabled, sort } from "../tool";
import { user } from "./sys";

export const articleCategory = pgTable(
  "article_category",
  createSchema({
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    icon: text("icon"),
    link: text("link"),
    sort: sort(),
    enabled: enabled(),
  }),
  (table) => [
    index("idx_category_enabled").on(table.enabled),
    index("idx_category_sort").on(table.sort),
  ],
);

export const article = pgTable(
  "article",
  createSchema({
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    content: text("content"),
    userId: integer("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    categoryId: integer("category_id").references(
      () => articleCategory.id,
      { onDelete: "set null" },
    ),
    sort: sort(),
    enabled: enabled(),
  }),
  (table) => [
    index("idx_article_user").on(table.userId),
    index("idx_article_category").on(table.categoryId),
    index("idx_article_enabled").on(table.enabled),
    index("idx_article_sort").on(table.sort),
  ],
);

export const tag = pgTable(
  "tag",
  createSchema({
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
    sort: sort(),
    enabled: enabled(),
  }),
);

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

export type Article = typeof article.$inferSelect;
export type ArticleInsert = typeof article.$inferInsert;

export type ArticleCategory = typeof articleCategory.$inferSelect;
export type ArticleCategoryInsert = typeof articleCategory.$inferInsert;

export type Tag = typeof tag.$inferSelect;
export type TagInsert = typeof tag.$inferInsert;

export type ArticleTag = typeof articleTag.$inferSelect;
export type ArticleTagInsert = typeof articleTag.$inferInsert;
