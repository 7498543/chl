import { http } from "@/lib/api";
import type {
  Article,
  ArticleCategory,
  IdParam,
  PaginatedResponse,
  PaginationParams,
  Tag,
} from "@/types";

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

export interface UpdateArticleParams extends IdParam, Partial<CreateArticleParams> {}

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

export function getAdminArticleDetail(data: IdParam) {
  return http.post<Article>("/admin/article/detail", data);
}

export function createArticle(data: CreateArticleParams) {
  return http.post<Article>("/admin/article/create", data);
}

export function updateArticle(data: UpdateArticleParams) {
  return http.post<Article>("/admin/article/update", data);
}

export function deleteArticle(data: IdParam) {
  return http.post<null>("/admin/article/delete", data);
}

export function getAdminCategoryList(params: PaginationParams & { name?: string } = {}) {
  return http.post<PaginatedResponse<ArticleCategory>>("/admin/article/category/list", params);
}

export interface CreateCategoryParams {
  name: string;
  slug: string;
  icon?: string;
  coverId?: number;
  enabled?: number;
  sort?: number;
}

export interface UpdateCategoryParams extends IdParam, Partial<CreateCategoryParams> {}

export function createCategory(data: CreateCategoryParams) {
  return http.post<ArticleCategory>("/admin/article/category/create", data);
}

export function updateCategory(data: UpdateCategoryParams) {
  return http.post<ArticleCategory>("/admin/article/category/update", data);
}

export function deleteCategory(data: IdParam) {
  return http.post<null>("/admin/article/category/delete", data);
}

export function getAdminTagList(params: PaginationParams & { name?: string } = {}) {
  return http.post<PaginatedResponse<Tag>>("/admin/article/tag/list", params);
}

export interface CreateTagParams {
  name: string;
}

export interface UpdateTagParams extends IdParam, CreateTagParams {}

export function createTag(data: CreateTagParams) {
  return http.post<Tag>("/admin/article/tag/create", data);
}

export function updateTag(data: UpdateTagParams) {
  return http.post<Tag>("/admin/article/tag/update", data);
}

export function deleteTag(data: IdParam) {
  return http.post<null>("/admin/article/tag/delete", data);
}
