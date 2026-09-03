import { BaseController, businessCode } from "@/core";
import { articleService } from "@/service/article";
import { Request, Response } from "express";

export class ArticleController extends BaseController {
  /**
   * 获取文章分类列表
   */
  async getCategoryList(_: Request, res: Response) {
    const list = await articleService.getCategoryList();
    this.response(res, businessCode.Success, list, {
      message: "获取分类列表成功",
    });
  }

  /**
   * 获取标签列表
   */
  async getTagList(_: Request, res: Response) {
    const list = await articleService.getTagList();
    this.response(res, businessCode.Success, list, {
      message: "获取标签列表成功",
    });
  }

  /**
   * 获取文章列表
   */
  async getList(req: Request, res: Response) {
    const { categoryId, title, page, pageSize } = req.body;
    const result = await articleService.getArticleList({
      categoryId: categoryId ? Number(categoryId) : undefined,
      title,
      page: page ? Number(page) : 1,
      pageSize: pageSize ? Number(pageSize) : 10,
    });
    this.response(res, businessCode.Success, result, {
      message: "获取文章列表成功",
    });
  }

  /**
   * 获取文章详情
   */
  async getDetail(req: Request, res: Response) {
    const { id } = req.body;
    const article = await articleService.getArticleDetail(Number(id));
    if (!article) {
      this.response(res, businessCode.NotFound, null, {
        message: "文章不存在或已下架",
      });
      return;
    }
    this.response(res, businessCode.Success, article, {
      message: "获取文章详情成功",
    });
  }
}

export const articleController = new ArticleController();
