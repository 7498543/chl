import { BaseController } from "@/core";
import { articleService } from "@/service/article";
import { Request, Response } from "express";

export class ArticleController extends BaseController {
  /**
   * 获取文章分类列表
   */
  getCategoryList = async (req: Request, res: Response) => {
    console.log('getCategoryList', req.body);
    const result = await articleService.getCategoryList(req.body);
    this.successResult(res, result, {
      message: "获取分类列表成功",
    });
  };

  /**
   * 获取标签列表
   */
  getTagList = async (req: Request, res: Response) => {
    const result = await articleService.getTagList(req.body);
    this.successResult(res, result, {
      message: "获取标签列表成功",
    });
  };

  /**
   * 获取文章列表
   */
  getList = async (req: Request, res: Response) => {
    const result = await articleService.getArticleList(req.body);
    this.successResult(res, result, {
      message: "获取文章列表成功",
    });
  };

  /**
   * 获取文章详情
   */
  getDetail = async (req: Request, res: Response) => {
    const article = await articleService.getArticleDetail(req.body.id);
    if (!article) {
      this.notFoundResult(res, {
        message: "文章不存在或已下架",
      });
      return;
    }

    this.successResult(res, article, {
      message: "获取文章详情成功",
    });
  };
}

export const articleController = new ArticleController();
