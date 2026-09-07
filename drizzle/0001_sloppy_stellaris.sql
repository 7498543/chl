CREATE TYPE "public"."asset_type" AS ENUM('image', 'video', 'audio', 'file', 'unknown');--> statement-breakpoint
ALTER TABLE "image_album" RENAME TO "asset_album";--> statement-breakpoint
ALTER TABLE "image_lib" RENAME TO "asset_lib";--> statement-breakpoint
ALTER TABLE "asset_lib" ADD COLUMN "type" "asset_type" DEFAULT 'unknown' NOT NULL;--> statement-breakpoint
ALTER TABLE "asset_lib" ADD COLUMN "title" text;--> statement-breakpoint
ALTER TABLE "asset_lib" ADD COLUMN "alt" text;--> statement-breakpoint
ALTER TABLE "asset_lib" ADD COLUMN "sort" integer DEFAULT 0 NOT NULL;