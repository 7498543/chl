import { http } from "@/lib/api";
import type { Article, ArticleCategory, PaginatedResponse, PaginationParams, Tag } from "@/types";

export interface ArticleListParams extends PaginationParams {
  categoryId?: number;
  title?: string;
}

export interface AdminArticleListParams extends ArticleListParams {
  enabled?: number;
}

export interface CreateArticleParams {
  title: string;
  description?: string;
  content?: string;
  coverId?: number;
  categoryId?: number;
  tagIds?: number[];
  enabled?: number;
  sort?: number;
}

export interface UpdateArticleParams extends Partial<CreateArticleParams> {}

export function getArticleList(params: ArticleListParams = {}) {
  return http.post<PaginatedResponse<Article>>("/article/list", params);
}

export function getArticleCategoryList(params: PaginationParams = {}) {
  return http.post<PaginatedResponse<ArticleCategory>>("/article/category/list", params);
}

export function getArticleTagList(params: PaginationParams = {}) {
  return http.post<PaginatedResponse<Tag>>("/article/tag/list", params);
}

export function getAdminArticleList(params: AdminArticleListParams = {}) {
  return http.post<PaginatedResponse<Article>>("/admin/article/list", params);
}

export function getAdminArticleDetail(data: { id: number }) {
  return http.post<Article>("/admin/article/detail", data);
}

export function createArticle(data: CreateArticleParams) {
  return http.post<Article>("/admin/article/create", data);
}

export function updateArticle(data: UpdateArticleParams) {
  return http.post<Article>("/admin/article/update", data);
}
