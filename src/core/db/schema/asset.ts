import { index, integer, jsonb, pgEnum, pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { createSchema, sort } from "../tool";
import { tag } from "./sys";

/* ──────────────────── 资产类型枚举 ──────────────────── */

/**
 * 上传文件类型分类
 * 危险文件（exe、php 等）在上传层拦截，不入库
 */
export const AssetType = pgEnum("asset_type", [
  "image", // 图片：jpg、png、gif、webp、svg、bmp、ico、avif
  "video", // 视频：mp4、avi、mov、wmv、flv、mkv、webm
  "audio", // 音频：mp3、wav、ogg、flac、aac、wma、m4a
  "document", // 文档：pdf、doc、docx、txt、md
  "spreadsheet", // 表格：xls、xlsx、csv
  "presentation", // 演示：ppt、pptx
  "archive", // 压缩包：zip、rar、7z、tar、gz
  "font", // 字体：ttf、otf、woff、woff2、eot
  "code", // 代码/配置：json、xml、yaml、toml、js、ts、html、css
  "ebook", // 电子书：epub、mobi
  "file", // 其他安全文件
  "unknown", // 无法识别
]);

export type AssetTypeEnum = (typeof AssetType.enumValues)[number];

/* ──────────────────── 资产库（文件存储记录） ──────────────────── */

export const assetLib = pgTable(
  "asset_lib",
  createSchema({
    id: serial("id").primaryKey(),
    /** 文件类型分类 */
    type: AssetType("type").default("unknown").notNull(),
    /** 原始文件名 */
    originalName: varchar("original_name", { length: 500 }).notNull(),
    /** 存储相对路径 */
    url: varchar("url", { length: 1000 }).notNull(),
    /** 文件大小（字节） */
    fileSize: integer("file_size"),
    /** MIME 类型 */
    mime: varchar("mime", { length: 100 }),
    /** 扩展元数据（图片宽高等 JSON） */
    metadata: jsonb("metadata"),
    /** 所属相册 ID */
    albumId: integer("album_id"),
    /** 展示标题 */
    title: varchar("title", { length: 500 }),
    /** 替代文本 */
    alt: varchar("alt", { length: 500 }),
    /** 排序 */
    sort: sort(),
  }),
);

/* ──────────────────── 资产相册 ──────────────────── */

export const assetAlbum = pgTable(
  "asset_album",
  createSchema({
    id: serial("id").primaryKey(),
    /** 相册名称 */
    name: varchar("name", { length: 200 }).notNull(),
    /** 父相册 ID（支持层级） */
    parentId: integer("parent_id"),
    /** 排序 */
    sort: sort(),
  }),
);

/* ──────────────────── 资产-标签 多对多关联 ──────────────────── */

export const assetTag = pgTable(
  "asset_tag",
  createSchema({
    id: serial("id").primaryKey(),
    assetId: integer("asset_id")
      .notNull()
      .references(() => assetLib.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
  }),
  (table) => [
    index("idx_asset_tag_asset").on(table.assetId),
    index("idx_asset_tag_tag").on(table.tagId),
  ],
);

/* ──────────────────── 导出类型 ──────────────────── */

export type AssetLib = typeof assetLib.$inferSelect;
export type AssetLibInsert = typeof assetLib.$inferInsert;

export type AssetAlbum = typeof assetAlbum.$inferSelect;
export type AssetAlbumInsert = typeof assetAlbum.$inferInsert;

export type AssetTag = typeof assetTag.$inferSelect;
export type AssetTagInsert = typeof assetTag.$inferInsert;
