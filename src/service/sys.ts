import { BaseService, fk, schema } from "@/core";
import { and, count, desc, eq, ilike } from "drizzle-orm";

import type {
  CreatePageDtoType,
  CreateSeoMetaDtoType,
  CreateSiteVersionDtoType,
  PageListDtoType,
  SeoMetaListDtoType,
  SiteVersionListDtoType,
  UpdatePageDtoType,
  UpdateSeoMetaDtoType,
  UpdateSiteVersionDtoType,
} from "@/dto/sys.dto";

export class SysService extends BaseService {
  /* ════════════════════ 站点版本 ════════════════════ */

  async createSiteVersion(data: CreateSiteVersionDtoType) {
    const db = this.db();
    const [row] = await db.insert(schema.siteVersion).values(data).returning();
    return row;
  }

  async updateSiteVersion(id: number, data: UpdateSiteVersionDtoType) {
    const db = this.db();
    const { id: _, ...setData } = data;
    const [row] = await db
      .update(schema.siteVersion)
      .set(setData)
      .where(eq(schema.siteVersion.id, id))
      .returning();
    return row ?? null;
  }

  async deleteSiteVersion(id: number) {
    const db = this.db();
    const [row] = await db
      .update(schema.siteVersion)
      .set({ deletedAt: new Date() })
      .where(and(eq(schema.siteVersion.id, id), this.notDeleted(schema.siteVersion)))
      .returning();
    return row ?? null;
  }

  async listSiteVersions(params: SiteVersionListDtoType) {
    const db = this.db();

    const where = and(
      this.notDeleted(schema.siteVersion),
      params.name ? ilike(schema.siteVersion.name, `%${params.name}%`) : undefined,
    );

    const [total, rows] = await Promise.all([
      db.select({ total: count() }).from(schema.siteVersion).where(where),
      db
        .select()
        .from(schema.siteVersion)
        .where(where)
        .orderBy(desc(schema.siteVersion.updatedAt))
        .offset((params.page - 1) * params.pageSize)
        .limit(params.pageSize),
    ]);

    return { list: rows, total: total[0].total };
  }

  async getSiteVersion(id: number) {
    const db = this.db();
    const [row] = await db
      .select()
      .from(schema.siteVersion)
      .where(and(eq(schema.siteVersion.id, id), this.notDeleted(schema.siteVersion)));
    return row ?? null;
  }

  /* ════════════════════ 页面 ════════════════════ */

  async createPage(data: CreatePageDtoType) {
    const db = this.db();
    const [row] = await db
      .insert(schema.page)
      .values({ ...data, siteVersionId: fk(data.siteVersionId) })
      .returning();
    return row;
  }

  async updatePage(id: number, data: UpdatePageDtoType) {
    const db = this.db();
    const { id: _, siteVersionId, ...rest } = data;
    const [row] = await db
      .update(schema.page)
      .set({ ...rest, siteVersionId: fk(siteVersionId) })
      .where(and(eq(schema.page.id, id), this.notDeleted(schema.page)))
      .returning();
    return row ?? null;
  }

  async deletePage(id: number) {
    const db = this.db();
    const [row] = await db
      .update(schema.page)
      .set({ deletedAt: new Date() })
      .where(and(eq(schema.page.id, id), this.notDeleted(schema.page)))
      .returning();
    return row ?? null;
  }

  async listPages(params: PageListDtoType) {
    const db = this.db();

    const where = and(
      this.notDeleted(schema.page),
      params.name ? ilike(schema.page.name, `%${params.name}%`) : undefined,
      params.slug ? ilike(schema.page.slug, `%${params.slug}%`) : undefined,
    );

    const [total, rows] = await Promise.all([
      db.select({ total: count() }).from(schema.page).where(where),
      db
        .select()
        .from(schema.page)
        .where(where)
        .orderBy(desc(schema.page.updatedAt))
        .offset((params.page - 1) * params.pageSize)
        .limit(params.pageSize),
    ]);

    return { list: rows, total: total[0].total };
  }

  async getPage(id: number) {
    const db = this.db();
    const [row] = await db
      .select()
      .from(schema.page)
      .where(and(eq(schema.page.id, id), this.notDeleted(schema.page)));
    return row ?? null;
  }

  /** 通过 slug 获取页面（前端用） */
  async getPageBySlug(slug: string) {
    const db = this.db();
    const [row] = await db
      .select()
      .from(schema.page)
      .where(
        and(eq(schema.page.slug, slug), eq(schema.page.enabled, 1), this.notDeleted(schema.page)),
      );
    return row ?? null;
  }

  /* ════════════════════ SEO 元数据 ════════════════════ */

  async createSeoMeta(data: CreateSeoMetaDtoType) {
    const db = this.db();

    // 同一目标（type + targetId）只能有一条记录，先查已存在则更新
    const existing = await db
      .select()
      .from(schema.seoMeta)
      .where(and(eq(schema.seoMeta.type, data.type), eq(schema.seoMeta.targetId, data.targetId)));

    if (existing.length > 0) {
      const [row] = await db
        .update(schema.seoMeta)
        .set({
          title: data.title,
          keywords: data.keywords,
          description: data.description,
          ogImage: data.ogImage,
          canonical: data.canonical,
        })
        .where(and(eq(schema.seoMeta.type, data.type), eq(schema.seoMeta.targetId, data.targetId)))
        .returning();
      return row;
    }

    const [row] = await db.insert(schema.seoMeta).values(data).returning();
    return row;
  }

  async updateSeoMeta(id: number, data: UpdateSeoMetaDtoType) {
    const db = this.db();
    const { id: _, ...setData } = data;
    const [row] = await db
      .update(schema.seoMeta)
      .set(setData)
      .where(eq(schema.seoMeta.id, id))
      .returning();
    return row ?? null;
  }

  async deleteSeoMeta(id: number) {
    const db = this.db();
    const [row] = await db.delete(schema.seoMeta).where(eq(schema.seoMeta.id, id)).returning();
    return row ?? null;
  }

  async listSeoMetas(params: SeoMetaListDtoType) {
    const db = this.db();

    const where = and(
      params.type ? eq(schema.seoMeta.type, params.type) : undefined,
      params.targetId ? eq(schema.seoMeta.targetId, params.targetId) : undefined,
    );

    const [total, rows] = await Promise.all([
      db.select({ total: count() }).from(schema.seoMeta).where(where),
      db
        .select()
        .from(schema.seoMeta)
        .where(where)
        .orderBy(desc(schema.seoMeta.id))
        .offset((params.page - 1) * params.pageSize)
        .limit(params.pageSize),
    ]);

    return { list: rows, total: total[0].total };
  }

  /** 按目标（type + targetId）查询 SEO */
  async getSeoMetaByTarget(type: string, targetId: number) {
    const db = this.db();
    const [row] = await db
      .select()
      .from(schema.seoMeta)
      .where(and(eq(schema.seoMeta.type, type), eq(schema.seoMeta.targetId, targetId)));
    return row ?? null;
  }
}

export const sysService = new SysService();
