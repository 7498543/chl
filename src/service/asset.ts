import { BaseService, fk, schema } from "@/core";
import { saveFile } from "@/utils/file";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";

import type {
  AlbumListDtoType,
  CreateAlbumDtoType,
  UpdateAlbumDtoType,
  UpdateAssetDtoType,
  UploadAssetDtoType,
} from "@/dto/asset.dto";

export class AssetService extends BaseService {
  /* ═══════ 资产 ═══════ */

  /**
   * 上传并保存资产
   * @param buffer        文件二进制
   * @param originalName  原始文件名
   * @param meta          DTO 中的额外元数据
   */
  async uploadAsset(buffer: Buffer, originalName: string, meta: UploadAssetDtoType) {
    const db = this.db();

    const fileMeta = await saveFile(buffer, originalName, {
      title: meta.title ?? undefined,
      alt: meta.alt ?? undefined,
      albumId: meta.albumId ?? undefined,
      sort: meta.sort,
    });

    const [row] = await db
      .insert(schema.assetLib)
      .values({
        type: fileMeta.type,
        originalName: fileMeta.originalName,
        url: fileMeta.url,
        fileSize: fileMeta.size,
        mime: fileMeta.mime,
        metadata: fileMeta.metadata,
        albumId: fk(meta.albumId),
        title: meta.title ?? null,
        alt: meta.alt ?? null,
        sort: meta.sort,
      })
      .returning();

    return row;
  }

  /** 资产列表（分页） */
  async listAssets(params: {
    page: number;
    pageSize: number;
    type?: string;
    albumId?: number;
    title?: string;
  }) {
    const db = this.db();

    const where = and(
      this.notDeleted(schema.assetLib),
      params.type ? eq(schema.assetLib.type, params.type as never) : undefined,
      params.albumId ? eq(schema.assetLib.albumId, params.albumId) : undefined,
      params.title ? ilike(schema.assetLib.title, `%${params.title}%`) : undefined,
    );

    const [total, rows] = await Promise.all([
      db.select({ total: count() }).from(schema.assetLib).where(where),
      db
        .select()
        .from(schema.assetLib)
        .where(where)
        .orderBy(desc(schema.assetLib.updatedAt))
        .offset((params.page - 1) * params.pageSize)
        .limit(params.pageSize),
    ]);

    return { list: rows, total: total[0].total };
  }

  /** 资产详情 */
  async getAsset(id: number) {
    const db = this.db();
    const [row] = await db
      .select()
      .from(schema.assetLib)
      .where(and(eq(schema.assetLib.id, id), this.notDeleted(schema.assetLib)));
    return row ?? null;
  }

  /** 更新资产元数据 */
  async updateAsset(id: number, data: UpdateAssetDtoType) {
    const db = this.db();
    const [row] = await db
      .update(schema.assetLib)
      .set({
        title: data.title,
        alt: data.alt,
        albumId: fk(data.albumId),
        sort: data.sort,
      })
      .where(and(eq(schema.assetLib.id, id), this.notDeleted(schema.assetLib)))
      .returning();
    return row ?? null;
  }

  /** 删除资产（软删除） */
  async deleteAsset(id: number) {
    return this.softDelete(schema.assetLib, id);
  }

  /* ═══════ 相册 ═══════ */

  /** 创建相册 */
  async createAlbum(data: CreateAlbumDtoType) {
    const db = this.db();
    const [row] = await db
      .insert(schema.assetAlbum)
      .values({ ...data, parentId: fk(data.parentId) })
      .returning();
    return row;
  }

  /** 更新相册 */
  async updateAlbum(id: number, data: UpdateAlbumDtoType) {
    const db = this.db();
    const { id: _, parentId, ...rest } = data;
    const [row] = await db
      .update(schema.assetAlbum)
      .set({ ...rest, parentId: fk(parentId) })
      .where(eq(schema.assetAlbum.id, id))
      .returning();
    return row ?? null;
  }

  /** 删除相册 */
  async deleteAlbum(id: number) {
    const db = this.db();
    const [row] = await db
      .delete(schema.assetAlbum)
      .where(eq(schema.assetAlbum.id, id))
      .returning();
    return row ?? null;
  }

  /** 相册列表（分页） */
  async listAlbums(params: AlbumListDtoType) {
    const db = this.db();
    const where = params.name ? ilike(schema.assetAlbum.name, `%${params.name}%`) : undefined;

    const [total, rows] = await Promise.all([
      db.select({ total: count() }).from(schema.assetAlbum).where(where),
      db
        .select()
        .from(schema.assetAlbum)
        .where(where)
        .orderBy(asc(schema.assetAlbum.sort), desc(schema.assetAlbum.id))
        .offset((params.page - 1) * params.pageSize)
        .limit(params.pageSize),
    ]);

    return { list: rows, total: total[0].total };
  }

  /** 全部相册（下选用） */
  async getAllAlbums() {
    const db = this.db();
    return db
      .select({
        id: schema.assetAlbum.id,
        name: schema.assetAlbum.name,
        parentId: schema.assetAlbum.parentId,
      })
      .from(schema.assetAlbum)
      .orderBy(asc(schema.assetAlbum.sort));
  }
}

export const assetService = new AssetService();
