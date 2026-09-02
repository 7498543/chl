import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createSchema } from "../tool";

export const imageLib = pgTable(
  "image_lib",
  createSchema({
    id: serial().primaryKey(),
    originalName: text("original_name").notNull(),
    url: text("url").notNull(),
    metadata: text("metadata"),
    albumId: serial("album_id"),
  }),
);

export const imageAlbum = pgTable(
  "image_album",
  createSchema({
    id: serial().primaryKey(),
    name: text("name"),
    parentId: serial("parent_id"),
  }),
);

export type ImageLib = typeof imageLib.$inferSelect;
export type ImageAlbum = typeof imageAlbum.$inferSelect;
