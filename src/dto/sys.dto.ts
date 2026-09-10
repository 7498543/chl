import { z } from "zod";
import { PaginationDto } from "./common";

/* ───────── 站点版本 ───────── */

/** 创建站点版本 DTO */
export const CreateSiteVersionDto = z.object({
  name: z.string().min(1, "版本名称不能为空").max(100, "版本名称最多 100 字"),
  description: z.string().max(500).optional().nullable(),
  version: z.string().min(1, "版本号不能为空").max(50, "版本号最多 50 字符"),
  content: z.record(z.string(), z.unknown()).describe("版本数据必须为 JSON 对象"),
});

export type CreateSiteVersionDtoType = z.infer<typeof CreateSiteVersionDto>;

/** 更新站点版本 DTO */
export const UpdateSiteVersionDto = z.object({
  id: z.coerce.number().int().positive("ID 必须为正整数"),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional().nullable(),
  version: z.string().min(1).max(50).optional(),
  content: z.record(z.string(), z.unknown()).optional(),
  enabled: z.coerce.number().int().min(0).max(1).optional(),
});

export type UpdateSiteVersionDtoType = z.infer<typeof UpdateSiteVersionDto>;

/** 站点版本列表 DTO */
export const SiteVersionListDto = PaginationDto.extend({
  name: z.string().optional(),
});

export type SiteVersionListDtoType = z.infer<typeof SiteVersionListDto>;

/** 站点版本 ID DTO */
export const SiteVersionIdDto = z.object({
  id: z.coerce.number().int().positive("ID 必须为正整数"),
});

export type SiteVersionIdDtoType = z.infer<typeof SiteVersionIdDto>;

/* ───────── 页面 ───────── */

/** 创建页面 DTO */
export const CreatePageDto = z.object({
  name: z.string().min(1, "页面名称不能为空").max(100, "页面名称最多 100 字"),
  slug: z
    .string()
    .min(1, "路由不能为空")
    .max(200, "路由最多 200 字符")
    .regex(/^[a-z0-9/-]+$/, "路由只能包含小写字母、数字、斜杠和连字符"),
  content: z.record(z.string(), z.unknown()).describe("页面内容必须为 JSON 对象"),
  siteVersionId: z.coerce.number().int().min(0).optional().nullable(),
  enabled: z.coerce.number().int().min(0).max(1).optional().default(1),
});

export type CreatePageDtoType = z.infer<typeof CreatePageDto>;

/** 更新页面 DTO */
export const UpdatePageDto = z.object({
  id: z.coerce.number().int().positive("ID 必须为正整数"),
  name: z.string().min(1).max(100).optional(),
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9/-]+$/, "路由只能包含小写字母、数字、斜杠和连字符")
    .optional(),
  content: z.record(z.string(), z.unknown()).optional(),
  siteVersionId: z.coerce.number().int().min(0).optional().nullable(),
  enabled: z.coerce.number().int().min(0).max(1).optional(),
});

export type UpdatePageDtoType = z.infer<typeof UpdatePageDto>;

/** 页面列表 DTO */
export const PageListDto = PaginationDto.extend({
  name: z.string().optional(),
  slug: z.string().optional(),
});

export type PageListDtoType = z.infer<typeof PageListDto>;

/** 页面 ID DTO */
export const PageIdDto = z.object({
  id: z.coerce.number().int().positive("ID 必须为正整数"),
});

export type PageIdDtoType = z.infer<typeof PageIdDto>;

/* ───────── SEO 元数据 ───────── */

/** 创建 SEO 元数据 DTO */
export const CreateSeoMetaDto = z.object({
  type: z.enum(["page", "article"], { message: "SEO 类型必须为 page 或 article" }),
  targetId: z.coerce.number().int().positive("目标 ID 必须为正整数"),
  title: z.string().max(200).optional().nullable(),
  keywords: z.string().max(500).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  ogImage: z.string().max(500).optional().nullable(),
  canonical: z.string().max(500).optional().nullable(),
});

export type CreateSeoMetaDtoType = z.infer<typeof CreateSeoMetaDto>;

/** 更新 SEO 元数据 DTO */
export const UpdateSeoMetaDto = z.object({
  id: z.coerce.number().int().positive("ID 必须为正整数"),
  title: z.string().max(200).optional().nullable(),
  keywords: z.string().max(500).optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  ogImage: z.string().max(500).optional().nullable(),
  canonical: z.string().max(500).optional().nullable(),
});

export type UpdateSeoMetaDtoType = z.infer<typeof UpdateSeoMetaDto>;

/** SEO 元数据列表 DTO */
export const SeoMetaListDto = PaginationDto.extend({
  type: z.enum(["page", "article"]).optional(),
  targetId: z.coerce.number().int().positive().optional(),
});

export type SeoMetaListDtoType = z.infer<typeof SeoMetaListDto>;

/** SEO 元数据 ID DTO */
export const SeoMetaIdDto = z.object({
  id: z.coerce.number().int().positive("ID 必须为正整数"),
});

export type SeoMetaIdDtoType = z.infer<typeof SeoMetaIdDto>;

/** 按目标查询 SEO DTO */
export const SeoMetaByTargetDto = z.object({
  type: z.enum(["page", "article"]),
  targetId: z.coerce.number().int().positive("目标 ID 必须为正整数"),
});

export type SeoMetaByTargetDtoType = z.infer<typeof SeoMetaByTargetDto>;
