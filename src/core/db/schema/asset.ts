import { pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";
import { createSchema, sort } from "../tool";

// 资产类型
export const AssetType = pgEnum("asset_type", ["image", "video", "audio", "file", "unknown"]);

export type AssetTypeEnum = (typeof AssetType.enumValues)[number];

/**
 * 资产库
 */
export const assetLib = pgTable(
  "asset_lib",
  createSchema({
    id: serial().primaryKey(),
    type: AssetType("type").default("unknown").notNull(),
    originalName: text("original_name").notNull(),
    url: text("url").notNull(),
    metadata: text("metadata"),
    albumId: serial("album_id"),
    title: text("title"),
    alt: text("alt"),
    sort: sort(),
  }),
);

/**
 * 资产册
 */
export const assetAlbum = pgTable(
  "asset_album",
  createSchema({
    id: serial().primaryKey(),
    name: text("name"),
    parentId: serial("parent_id"),
  }),
);

export type AssetLib = typeof assetLib.$inferSelect;
export type AssetAlbum = typeof assetAlbum.$inferSelect;
