import { z } from "zod";
import { PaginationDto } from "./common";

/* ───────── 资产 ───────── */

/** 上传资产 DTO */
export const UploadAssetDto = z.object({
  albumId: z.coerce.number().int().min(0).optional().nullable(),
  title: z.string().max(200).optional().nullable(),
  alt: z.string().max(200).optional().nullable(),
  sort: z.coerce.number().int().optional().default(0),
});

export type UploadAssetDtoType = z.infer<typeof UploadAssetDto>;

/** 资产列表 DTO */
export const AssetListDto = PaginationDto.extend({
  type: z.string().optional(),
  albumId: z.coerce.number().int().min(0).optional(),
  title: z.string().optional(),
});

export type AssetListDtoType = z.infer<typeof AssetListDto>;

/** 更新资产 DTO */
export const UpdateAssetDto = z.object({
  id: z.coerce.number().int().positive("ID 必须为正整数"),
  title: z.string().max(200).optional().nullable(),
  alt: z.string().max(200).optional().nullable(),
  albumId: z.coerce.number().int().min(0).optional().nullable(),
  sort: z.coerce.number().int().optional(),
});

export type UpdateAssetDtoType = z.infer<typeof UpdateAssetDto>;

/** 资产 ID DTO */
export const AssetIdDto = z.object({
  id: z.coerce.number().int().positive("ID 必须为正整数"),
});

export type AssetIdDtoType = z.infer<typeof AssetIdDto>;

/* ───────── 相册 ───────── */

/** 创建相册 DTO */
export const CreateAlbumDto = z.object({
  name: z.string().min(1, "相册名称不能为空").max(50, "相册名称最多 50 字"),
  parentId: z.coerce.number().int().min(0).optional().nullable(),
  sort: z.coerce.number().int().optional().default(0),
});

export type CreateAlbumDtoType = z.infer<typeof CreateAlbumDto>;

/** 更新相册 DTO */
export const UpdateAlbumDto = z.object({
  id: z.coerce.number().int().positive("ID 必须为正整数"),
  name: z.string().min(1).max(50).optional(),
  parentId: z.coerce.number().int().min(0).optional().nullable(),
  sort: z.coerce.number().int().optional(),
});

export type UpdateAlbumDtoType = z.infer<typeof UpdateAlbumDto>;

/** 相册列表 DTO */
export const AlbumListDto = PaginationDto.extend({
  name: z.string().optional(),
});

export type AlbumListDtoType = z.infer<typeof AlbumListDto>;

/** 相册 ID DTO */
export const AlbumIdDto = z.object({
  id: z.coerce.number().int().positive("ID 必须为正整数"),
});

export type AlbumIdDtoType = z.infer<typeof AlbumIdDto>;
