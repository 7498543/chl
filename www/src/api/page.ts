import { http } from "@/lib/api";
import type { IdParam, Page, PaginatedResponse, PaginationParams } from "@/types";

export interface PageListParams extends PaginationParams {
  name?: string;
  slug?: string;
}

export interface CreatePageParams {
  name: string;
  slug: string;
  content: Record<string, unknown>;
  siteVersionId?: number;
  enabled?: number;
}

export interface UpdatePageParams extends IdParam, Partial<CreatePageParams> {}

export function getPageList(params: PageListParams = {}) {
  return http.post<PaginatedResponse<Page>>("/admin/page/list", params);
}

export function getPageDetail(data: IdParam) {
  return http.post<Page>("/admin/page/detail", data);
}

export function createPage(data: CreatePageParams) {
  return http.post<Page>("/admin/page/create", data);
}

export function updatePage(data: UpdatePageParams) {
  return http.post<Page>("/admin/page/update", data);
}

export function deletePage(data: IdParam) {
  return http.post<null>("/admin/page/delete", data);
}
