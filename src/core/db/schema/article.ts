import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createSchema, enabled, sort } from "../tool";

export const articleCategory = pgTable(
  "article_category",
  createSchema({
    id: serial("id").primaryKey(),
    name: text("name"),
    icon: text("icon"),
    link: text("link"),
    sort: sort(),
    enabled: enabled(),
  }),
);

export const article = pgTable(
  "article",
  createSchema({
    id: serial("id").primaryKey(),
    title: text("title"),
    description: text("description"),
    content: text("content"),
    userID: serial("user_id"),
    sort: sort(),
    enabled: enabled(),
  }),
);

export const tag = pgTable("tag", {
  id: serial("id").primaryKey(),
  name: text("name"),
});

export const articleTag = pgTable("article_tag", {
  id: serial("id").primaryKey(),
  articleID: serial("article_id"),
  tagID: serial("tag_id"),
});

export type ArticleTag = typeof articleTag.$inferSelect;
export type Tag = typeof tag.$inferSelect;
export type Article = typeof article.$inferSelect;
export type ArticleCategory = typeof articleCategory.$inferSelect;
