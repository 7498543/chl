import { BaseService, fk } from "@/core";
import type { Article, ArticleCategory } from "@/core/db/schema/article";
import { article, articleCategory, articleTag, tag } from "@/core/db/schema/article";
import type { PaginationDtoType } from "@/dto/common";
import { and, count, desc, eq, like } from "drizzle-orm";

export class ArticleService extends BaseService {
  /* ═══════ 前端展示 ═══════ */

  /**
   * 获取文章分类列表（仅已启用的）
   */
  async getCategoryList(
    params: PaginationDtoType,
  ): Promise<{ list: ArticleCategory[]; total: number }> {
    const db = this.db();
    const { page = 1, pageSize = 10 } = params;

    const conditions = [this.notDeleted(articleCategory), eq(articleCategory.enabled, 1)];

    const [items, [{ total }]] = await Promise.all([
      db
        .select()
        .from(articleCategory)
        .where(and(...conditions))
        .orderBy(articleCategory.sort)
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db
        .select({ total: count() })
        .from(articleCategory)
        .where(and(...conditions)),
    ]);

    return { list: items, total };
  }

  /**
   * 获取标签列表（仅已启用的）
   */
  async getTagList(
    params: PaginationDtoType,
  ): Promise<{ list: (typeof tag.$inferSelect)[]; total: number }> {
    const db = this.db();
    const { page = 1, pageSize = 10 } = params;

    const conditions = [this.notDeleted(tag), eq(tag.enabled, 1)];

    const [items, [{ total }]] = await Promise.all([
      db
        .select()
        .from(tag)
        .where(and(...conditions))
        .orderBy(tag.sort)
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db
        .select({ total: count() })
        .from(tag)
        .where(and(...conditions)),
    ]);

    return { list: items, total };
  }

  /**
   * 获取文章列表（仅已启用的）
   */
  async getArticleList(
    params: {
      categoryId?: number;
      title?: string;
    } & PaginationDtoType,
  ): Promise<{ list: Article[]; total: number }> {
    const db = this.db();
    const { categoryId, title, page = 1, pageSize = 10 } = params;

    const conditions = [this.notDeleted(article), eq(article.enabled, 1)];

    if (categoryId) {
      conditions.push(eq(article.categoryId, categoryId));
    }
    if (title) {
      conditions.push(like(article.title, `%${title}%`));
    }

    const [items, [{ total }]] = await Promise.all([
      db
        .select()
        .from(article)
        .where(and(...conditions))
        .orderBy(desc(article.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db
        .select({ total: count() })
        .from(article)
        .where(and(...conditions)),
    ]);

    return { list: items, total };
  }

  /**
   * 获取文章详情（仅已启用的）
   */
  async getArticleDetail(id: number): Promise<Article | null> {
    const db = this.db();
    const [item] = await db
      .select()
      .from(article)
      .where(and(this.notDeleted(article), eq(article.id, id), eq(article.enabled, 1)))
      .limit(1);
    return item || null;
  }

  /* ═══════ 管理端 ═══════ */

  // ── 文章 ──

  /**
   * 创建文章（含标签绑定）
   */
  async createArticle(data: {
    title: string;
    description?: string | null;
    content?: string | null;
    coverId?: number | null;
    categoryId?: number | null;
    tagIds?: number[];
    userId: number;
    enabled?: number;
    sort?: number;
  }): Promise<Article> {
    const db = this.db();
    const { tagIds, coverId: rawCoverId, categoryId: rawCategoryId, ...fields } = data;

    const [item] = await db
      .insert(article)
      .values({ ...fields, coverId: fk(rawCoverId), categoryId: fk(rawCategoryId) })
      .returning();

    // 绑定标签
    if (tagIds?.length) {
      await db.insert(articleTag).values(tagIds.map((tagId) => ({ articleId: item.id, tagId })));
    }

    return item;
  }

  /**
   * 更新文章（含标签同步）
   */
  async updateArticle(
    id: number,
    data: {
      title?: string;
      description?: string | null;
      content?: string | null;
      coverId?: number | null;
      categoryId?: number | null;
      tagIds?: number[];
      enabled?: number;
      sort?: number;
    },
  ): Promise<Article | null> {
    const db = this.db();
    const { tagIds, coverId: rawCoverId, categoryId: rawCategoryId, ...fields } = data;

    // 可选外键 0→null
    const safeCoverId = rawCoverId !== undefined ? fk(rawCoverId) : undefined;
    const safeCategoryId = rawCategoryId !== undefined ? fk(rawCategoryId) : undefined;

    // 只更新有传值的字段
    const updateData = Object.fromEntries(
      Object.entries({ ...fields, coverId: safeCoverId, categoryId: safeCategoryId }).filter(
        ([, v]) => v !== undefined,
      ),
    );

    if (Object.keys(updateData).length > 0) {
      await db.update(article).set(updateData).where(eq(article.id, id));
    }

    // 同步标签：先删后插
    if (tagIds !== undefined) {
      await db.delete(articleTag).where(eq(articleTag.articleId, id));
      if (tagIds.length > 0) {
        await db.insert(articleTag).values(tagIds.map((tagId) => ({ articleId: id, tagId })));
      }
    }

    const [item] = await db.select().from(article).where(eq(article.id, id)).limit(1);

    return item || null;
  }

  /**
   * 软删除文章
   */
  async deleteArticle(id: number): Promise<void> {
    await this.softDelete(article, id);
  }

  /**
   * 管理端文章列表（含草稿／禁用）
   */
  async getAdminArticleList(
    params: {
      categoryId?: number;
      title?: string;
      enabled?: number;
    } & PaginationDtoType,
  ): Promise<{ list: Article[]; total: number }> {
    const db = this.db();
    const { categoryId, title, enabled: enabledVal, page = 1, pageSize = 10 } = params;

    const conditions = [this.notDeleted(article)];

    if (categoryId) conditions.push(eq(article.categoryId, categoryId));
    if (title) conditions.push(like(article.title, `%${title}%`));
    if (enabledVal !== undefined) conditions.push(eq(article.enabled, enabledVal));

    const [items, [{ total }]] = await Promise.all([
      db
        .select()
        .from(article)
        .where(and(...conditions))
        .orderBy(desc(article.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db
        .select({ total: count() })
        .from(article)
        .where(and(...conditions)),
    ]);

    return { list: items, total };
  }

  /**
   * 管理端文章详情（不过滤启用状态）
   */
  async getAdminArticleDetail(id: number): Promise<Article | null> {
    const db = this.db();
    const [item] = await db
      .select()
      .from(article)
      .where(and(this.notDeleted(article), eq(article.id, id)))
      .limit(1);
    return item || null;
  }

  // ── 分类 ──

  /**
   * 创建分类
   */
  async createCategory(data: {
    name: string;
    slug: string;
    icon?: string | null;
    coverId?: number | null;
    enabled?: number;
    sort?: number;
  }): Promise<ArticleCategory> {
    const db = this.db();
    const { coverId: rawCoverId, ...rest } = data;
    const [item] = await db
      .insert(articleCategory)
      .values({ ...rest, coverId: fk(rawCoverId) })
      .returning();
    return item;
  }

  /**
   * 更新分类
   */
  async updateCategory(
    id: number,
    data: {
      name?: string;
      slug?: string;
      icon?: string | null;
      coverId?: number | null;
      enabled?: number;
      sort?: number;
    },
  ): Promise<ArticleCategory | null> {
    const db = this.db();
    const { coverId: rawCoverId, ...rest } = data;
    const coverId = rawCoverId !== undefined ? fk(rawCoverId) : undefined;
    const updateData = Object.fromEntries(
      Object.entries({ ...rest, coverId }).filter(([, v]) => v !== undefined),
    );

    if (Object.keys(updateData).length === 0) {
      const [item] = await db
        .select()
        .from(articleCategory)
        .where(eq(articleCategory.id, id))
        .limit(1);
      return item || null;
    }

    const [item] = await db
      .update(articleCategory)
      .set(updateData)
      .where(eq(articleCategory.id, id))
      .returning();

    return item || null;
  }

  /**
   * 软删除分类
   */
  async deleteCategory(id: number): Promise<void> {
    await this.softDelete(articleCategory, id);
  }

  /**
   * 管理端分类列表（全部状态）
   */
  async getAdminCategoryList(
    params: PaginationDtoType & { name?: string },
  ): Promise<{ list: ArticleCategory[]; total: number }> {
    const db = this.db();
    const { page = 1, pageSize = 10, name } = params;

    const conditions = [this.notDeleted(articleCategory)];

    if (name) conditions.push(like(articleCategory.name, `%${name}%`));

    const [items, [{ total }]] = await Promise.all([
      db
        .select()
        .from(articleCategory)
        .where(and(...conditions))
        .orderBy(articleCategory.sort)
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db
        .select({ total: count() })
        .from(articleCategory)
        .where(and(...conditions)),
    ]);

    return { list: items, total };
  }

  // ── 标签 ──

  /**
   * 创建标签
   */
  async createTag(name: string): Promise<typeof tag.$inferSelect> {
    const db = this.db();
    const [item] = await db.insert(tag).values({ name }).returning();
    return item;
  }

  /**
   * 更新标签
   */
  async updateTag(id: number, name: string): Promise<typeof tag.$inferSelect | null> {
    const db = this.db();
    const [item] = await db.update(tag).set({ name }).where(eq(tag.id, id)).returning();
    return item || null;
  }

  /**
   * 软删除标签
   */
  async deleteTag(id: number): Promise<void> {
    await this.softDelete(tag, id);
  }

  /**
   * 管理端标签列表（全部状态）
   */
  async getAdminTagList(
    params: PaginationDtoType & { name?: string },
  ): Promise<{ list: (typeof tag.$inferSelect)[]; total: number }> {
    const db = this.db();
    const { page = 1, pageSize = 10, name } = params;

    const conditions = [this.notDeleted(tag)];

    if (name) conditions.push(like(tag.name, `%${name}%`));

    const [items, [{ total }]] = await Promise.all([
      db
        .select()
        .from(tag)
        .where(and(...conditions))
        .orderBy(tag.sort)
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db
        .select({ total: count() })
        .from(tag)
        .where(and(...conditions)),
    ]);

    return { list: items, total };
  }
}

export const articleService = new ArticleService();
