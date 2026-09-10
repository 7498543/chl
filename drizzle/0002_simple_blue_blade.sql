CREATE TYPE "public"."user_role" AS ENUM('admin', 'editor', 'user');--> statement-breakpoint
ALTER TYPE "public"."asset_type" ADD VALUE 'document' BEFORE 'file';--> statement-breakpoint
ALTER TYPE "public"."asset_type" ADD VALUE 'spreadsheet' BEFORE 'file';--> statement-breakpoint
ALTER TYPE "public"."asset_type" ADD VALUE 'presentation' BEFORE 'file';--> statement-breakpoint
ALTER TYPE "public"."asset_type" ADD VALUE 'archive' BEFORE 'file';--> statement-breakpoint
ALTER TYPE "public"."asset_type" ADD VALUE 'font' BEFORE 'file';--> statement-breakpoint
ALTER TYPE "public"."asset_type" ADD VALUE 'code' BEFORE 'file';--> statement-breakpoint
ALTER TYPE "public"."asset_type" ADD VALUE 'ebook' BEFORE 'file';--> statement-breakpoint
CREATE TABLE "asset_tag" (
	"id" serial PRIMARY KEY NOT NULL,
	"asset_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "page" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"site_version_id" integer,
	"content" jsonb NOT NULL,
	"enabled" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "seo_meta" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(30) NOT NULL,
	"target_id" integer NOT NULL,
	"title" varchar(200),
	"keywords" text,
	"description" text,
	"og_image" varchar(500),
	"canonical" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "site_version" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"version" varchar(50) NOT NULL,
	"content" jsonb NOT NULL,
	"enabled" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "article_category" RENAME COLUMN "link" TO "slug";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "username" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "nickname" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "password" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "avatar" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user'::"public"."user_role";--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "role" SET DATA TYPE "public"."user_role" USING "role"::"public"."user_role";--> statement-breakpoint
ALTER TABLE "article" ALTER COLUMN "title" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "article_category" ALTER COLUMN "name" SET DATA TYPE varchar(200);--> statement-breakpoint
ALTER TABLE "article_category" ALTER COLUMN "icon" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "tag" ALTER COLUMN "name" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "asset_album" ALTER COLUMN "name" SET DATA TYPE varchar(200);--> statement-breakpoint
ALTER TABLE "asset_album" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "asset_album" ALTER COLUMN "parent_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "asset_album" ALTER COLUMN "parent_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "asset_lib" ALTER COLUMN "original_name" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "asset_lib" ALTER COLUMN "url" SET DATA TYPE varchar(1000);--> statement-breakpoint
ALTER TABLE "asset_lib" ALTER COLUMN "metadata" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "asset_lib" ALTER COLUMN "album_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "asset_lib" ALTER COLUMN "album_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "asset_lib" ALTER COLUMN "title" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "asset_lib" ALTER COLUMN "alt" SET DATA TYPE varchar(500);--> statement-breakpoint
ALTER TABLE "article" ADD COLUMN "cover_id" integer;--> statement-breakpoint
ALTER TABLE "article" ADD COLUMN "seo_meta_id" integer;--> statement-breakpoint
ALTER TABLE "article_category" ADD COLUMN "seo_meta_id" integer;--> statement-breakpoint
ALTER TABLE "article_category" ADD COLUMN "cover_id" integer;--> statement-breakpoint
ALTER TABLE "asset_album" ADD COLUMN "sort" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "asset_lib" ADD COLUMN "file_size" integer;--> statement-breakpoint
ALTER TABLE "asset_lib" ADD COLUMN "mime" varchar(100);--> statement-breakpoint
ALTER TABLE "asset_tag" ADD CONSTRAINT "asset_tag_asset_id_asset_lib_id_fk" FOREIGN KEY ("asset_id") REFERENCES "public"."asset_lib"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asset_tag" ADD CONSTRAINT "asset_tag_tag_id_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page" ADD CONSTRAINT "page_site_version_id_site_version_id_fk" FOREIGN KEY ("site_version_id") REFERENCES "public"."site_version"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_asset_tag_asset" ON "asset_tag" USING btree ("asset_id");--> statement-breakpoint
CREATE INDEX "idx_asset_tag_tag" ON "asset_tag" USING btree ("tag_id");--> statement-breakpoint
ALTER TABLE "article" ADD CONSTRAINT "article_cover_id_asset_lib_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."asset_lib"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article" ADD CONSTRAINT "article_seo_meta_id_seo_meta_id_fk" FOREIGN KEY ("seo_meta_id") REFERENCES "public"."seo_meta"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_category" ADD CONSTRAINT "article_category_seo_meta_id_seo_meta_id_fk" FOREIGN KEY ("seo_meta_id") REFERENCES "public"."seo_meta"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_category" ADD CONSTRAINT "article_category_cover_id_asset_lib_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."asset_lib"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "article_category" ADD CONSTRAINT "article_category_slug_unique" UNIQUE("slug");