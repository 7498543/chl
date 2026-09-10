import { z } from "zod";
import { PaginationDto } from "./common";

/* ───────── 公共 DTO ───────── */

/** ID 参数 */
export const IdDto = z.object({
  id: z.coerce.number().int().positive("ID 必须为正整数"),
});

export type IdDtoType = z.infer<typeof IdDto>;

/* ───────── 前端展示 ───────── */

/** 文章分类列表 DTO */
export const ArticleCategoryListDto = PaginationDto;

export type ArticleCategoryListDtoType = z.infer<typeof ArticleCategoryListDto>;

/** 标签列表 DTO */
export const ArticleTagListDto = PaginationDto;

export type ArticleTagListDtoType = z.infer<typeof ArticleTagListDto>;

/** 文章列表 DTO */
export const ArticleListDto = PaginationDto.extend({
  categoryId: z.coerce.number().int().min(0).optional(),
  title: z.string().optional(),
});

export type ArticleListDtoType = z.infer<typeof ArticleListDto>;

/** 文章详情 DTO */
export const ArticleDetailDto = IdDto;

export type ArticleDetailDtoType = z.infer<typeof ArticleDetailDto>;

/* ───────── 管理端 ───────── */

/** 创建文章 DTO */
export const CreateArticleDto = z.object({
  title: z.string().min(1, "标题不能为空").max(200, "标题最多 200 字"),
  description: z.string().optional(),
  content: z.string().optional(),
  coverId: z.coerce.number().int().min(0).optional().nullable(),
  categoryId: z.coerce.number().int().min(0).optional().nullable(),
  tagIds: z.array(z.coerce.number().int().positive()).optional(),
  enabled: z.coerce.number().int().min(0).max(1).optional().default(1),
  sort: z.coerce.number().int().optional().default(0),
});

export type CreateArticleDtoType = z.infer<typeof CreateArticleDto>;

/** 更新文章 DTO */
export const UpdateArticleDto = z.object({
  id: z.coerce.number().int().positive("ID 必须为正整数"),
  title: z.string().min(1, "标题不能为空").max(200, "标题最多 200 字").optional(),
  description: z.string().optional().nullable(),
  content: z.string().optional().nullable(),
  coverId: z.coerce.number().int().min(0).optional().nullable(),
  categoryId: z.coerce.number().int().min(0).optional().nullable(),
  tagIds: z.array(z.coerce.number().int().positive()).optional(),
  enabled: z.coerce.number().int().min(0).max(1).optional(),
  sort: z.coerce.number().int().optional(),
});

export type UpdateArticleDtoType = z.infer<typeof UpdateArticleDto>;

/** 创建分类 DTO */
export const CreateCategoryDto = z.object({
  name: z.string().min(1, "分类名称不能为空").max(50, "分类名称最多 50 字"),
  slug: z.string().min(1, "路由不能为空").max(100, "路由最多 100 字"),
  icon: z.string().optional().nullable(),
  coverId: z.coerce.number().int().min(0).optional().nullable(),
  enabled: z.coerce.number().int().min(0).max(1).optional().default(1),
  sort: z.coerce.number().int().optional().default(0),
});

export type CreateCategoryDtoType = z.infer<typeof CreateCategoryDto>;

/** 更新分类 DTO */
export const UpdateCategoryDto = z.object({
  id: z.coerce.number().int().positive("ID 必须为正整数"),
  name: z.string().min(1, "分类名称不能为空").max(50).optional(),
  slug: z.string().min(1, "路由不能为空").max(100).optional(),
  icon: z.string().optional().nullable(),
  coverId: z.coerce.number().int().min(0).optional().nullable(),
  enabled: z.coerce.number().int().min(0).max(1).optional(),
  sort: z.coerce.number().int().optional(),
});

export type UpdateCategoryDtoType = z.infer<typeof UpdateCategoryDto>;

/** 创建标签 DTO */
export const CreateTagDto = z.object({
  name: z.string().min(1, "标签名称不能为空").max(30, "标签名称最多 30 字"),
});

export type CreateTagDtoType = z.infer<typeof CreateTagDto>;

/** 更新标签 DTO */
export const UpdateTagDto = z.object({
  id: z.coerce.number().int().positive("ID 必须为正整数"),
  name: z.string().min(1, "标签名称不能为空").max(30, "标签名称最多 30 字"),
});

export type UpdateTagDtoType = z.infer<typeof UpdateTagDto>;
