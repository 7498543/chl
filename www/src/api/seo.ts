import { http } from "@/lib/api";
import type { IdParam, PaginatedResponse, PaginationParams, SeoMeta } from "@/types";

export interface SeoListParams extends PaginationParams {
  type?: "page" | "article";
  targetId?: number;
}

export interface SeoByTargetParams {
  type: "page" | "article";
  targetId: number;
}

export interface CreateSeoParams {
  type: "page" | "article";
  targetId: number;
  title?: string;
  keywords?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
}

export interface UpdateSeoParams extends IdParam {
  title?: string;
  keywords?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
}

export function getSeoList(params: SeoListParams = {}) {
  return http.post<PaginatedResponse<SeoMeta>>("/admin/seo/list", params);
}

export function getSeoByTarget(data: SeoByTargetParams) {
  return http.post<SeoMeta>("/admin/seo/detail", data);
}

export function createSeo(data: CreateSeoParams) {
  return http.post<SeoMeta>("/admin/seo/create", data);
}

export function updateSeo(data: UpdateSeoParams) {
  return http.post<SeoMeta>("/admin/seo/update", data);
}

export function deleteSeo(data: IdParam) {
  return http.post<null>("/admin/seo/delete", data);
}
