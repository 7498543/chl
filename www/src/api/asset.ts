import { http, uploadHttp } from "@/lib/api";
import type { Asset, AssetAlbum, PaginatedResponse, PaginationParams } from "@/types";

export interface AssetListParams extends PaginationParams {
  type?: string;
  albumId?: number;
  title?: string;
}

export interface CreateAlbumParams {
  name: string;
  parentId?: number;
  sort?: number;
}

export interface UpdateAssetParams {
  title?: string;
  alt?: string;
  albumId?: number;
  sort?: number;
}

export interface UpdateAlbumParams {
  name?: string;
  parentId?: number;
  sort?: number;
}

export function uploadAsset(
  file: File,
  data?: { title?: string; alt?: string; albumId?: number; sort?: number },
) {
  return uploadHttp.upload<Asset>(
    "/admin/asset/upload",
    file,
    "file",
    data as Record<string, unknown>,
  );
}

export function getAssetList(params: AssetListParams = {}) {
  return http.post<PaginatedResponse<Asset>>("/admin/asset/list", params);
}

export function getAssetDetail(data: IdParam) {
  return http.post<Asset>("/admin/asset/detail", data);
}

export function updateAsset(data: UpdateAssetParams) {
  return http.post<Asset>("/admin/asset/update", data);
}

export function deleteAsset(data: IdParam) {
  return http.post<null>("/admin/asset/delete", data);
}

export function createAlbum(data: CreateAlbumParams) {
  return http.post<AssetAlbum>("/admin/asset/album/create", data);
}

export function updateAlbum(data: UpdateAlbumParams) {
  return http.post<AssetAlbum>("/admin/asset/album/update", data);
}

export function deleteAlbum(data: IdParam) {
  return http.post<null>("/admin/asset/album/delete", data);
}

export function getAlbumList(params: PaginationParams & { name?: string } = {}) {
  return http.post<PaginatedResponse<AssetAlbum>>("/admin/asset/album/list", params);
}

export function getAllAlbums() {
  return http.post<AssetAlbum[]>("/admin/asset/album/all");
}
