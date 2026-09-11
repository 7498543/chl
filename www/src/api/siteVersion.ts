import { http } from "@/lib/api";
import type { PaginatedResponse, PaginationParams, SiteVersion } from "@/types";

export interface SiteVersionListParams extends PaginationParams {
  name?: string;
}

export interface CreateSiteVersionParams {
  name: string;
  version: string;
  description?: string;
  content: Record<string, unknown>;
}

export interface UpdateSiteVersionParams extends Partial<CreateSiteVersionParams> {
  enabled?: number;
}

export function getSiteVersionList(params: SiteVersionListParams = {}) {
  return http.post<PaginatedResponse<SiteVersion>>("/admin/site-version/list", params);
}

export function getSiteVersionDetail(data: IdParam) {
  return http.post<SiteVersion>("/admin/site-version/detail", data);
}

export function createSiteVersion(data: CreateSiteVersionParams) {
  return http.post<SiteVersion>("/admin/site-version/create", data);
}

export function updateSiteVersion(data: UpdateSiteVersionParams) {
  return http.post<SiteVersion>("/admin/site-version/update", data);
}

export function deleteSiteVersion(data: IdParam) {
  return http.post<null>("/admin/site-version/delete", data);
}
