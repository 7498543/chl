import { z } from "zod";
import { PaginationDto } from "./common";

/** 文章分类列表 DTO */
export const ArticleCategoryListDto = PaginationDto;

export type ArticleCategoryListDtoType = z.infer<typeof ArticleCategoryListDto>;

/** 标签列表 DTO */
export const ArticleTagListDto = PaginationDto;

export type ArticleTagListDtoType = z.infer<typeof ArticleTagListDto>;

/** 文章列表 DTO */
export const ArticleListDto = PaginationDto.extend({
  categoryId: z.coerce.number().int().positive().optional(),
  title: z.string().optional(),
});

export type ArticleListDtoType = z.infer<typeof ArticleListDto>;

/** 文章详情 DTO */
export const ArticleDetailDto = z.object({
  id: z.coerce.number().int().positive(),
});

export type ArticleDetailDtoType = z.infer<typeof ArticleDetailDto>;
