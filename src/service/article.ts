import { BaseService } from "@/core";
import { and, like, desc, eq, count } from "drizzle-orm";
import { article, articleCategory, articleTag, tag } from "@/core/db/schema/article";
import type { Article, ArticleCategory } from "@/core/db/schema/article";

export class ArticleService extends BaseService {
  /**
   * 获取文章分类列表（前台只返回启用的）
   */
  async getCategoryList(): Promise<ArticleCategory[]> {
    const db = this.db();
    return db
      .select()
      .from(articleCategory)
      .where(this.notDeleted(articleCategory))
      .orderBy(articleCategory.sort);
  }

  /**
   * 获取标签列表（前台只返回启用的）
   */
  async getTagList(): Promise<typeof tag.$inferSelect[]> {
    const db = this.db();
    return db
      .select()
      .from(tag)
      .where(this.notDeleted(tag))
      .orderBy(tag.sort);
  }

  /**
   * 获取文章列表
   */
  async getArticleList(params: {
    categoryId?: number;
    title?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ list: Article[]; total: number }> {
    const db = this.db();
    const { categoryId, title, page = 1, pageSize = 10 } = params;

    const conditions = [this.notDeleted(article), article.enabled.eq(true)];

    if (categoryId) {
      conditions.push(eq(article.categoryId, categoryId));
    }
    if (title) {
      conditions.push(like(article.title, `%${title}%`));
    }

    const [items, [{ total }]] = await Promise.all([
      db
        .select({
          id: article.id,
          title: article.title,
          description: article.description,
          categoryId: article.categoryId,
          userId: article.userId,
          sort: article.sort,
          enabled: article.enabled,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
        })
        .from(article)
        .where(and(...conditions))
        .orderBy(desc(article.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db.select({ total: count() }).from(article).where(and(...conditions)),
    ]);

    return {
      list: items,
      total,
    };
  }

  /**
   * 获取文章详情
   */
  async getArticleDetail(id: number): Promise<Article | null> {
    const db = this.db();
    const [item] = await db
      .select()
      .from(article)
      .where(and(this.notDeleted(article), eq(article.id, id), article.enabled.eq(true)))
      .limit(1);
    return item || null;
  }
}

export const articleService = new ArticleService();
