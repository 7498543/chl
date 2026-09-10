import { BaseController } from "@/core";
import { articleService } from "@/service/article";
import type { Request, Response } from "express";

export class ArticleController extends BaseController {
  /* ═══════ 前端展示 ═══════ */

  /** 获取文章分类列表 */
  getCategoryList = async (req: Request, res: Response) => {
    const result = await articleService.getCategoryList(req.body);
    this.successResult(res, result, { message: "获取分类列表成功" });
  };

  /** 获取标签列表 */
  getTagList = async (req: Request, res: Response) => {
    const result = await articleService.getTagList(req.body);
    this.successResult(res, result, { message: "获取标签列表成功" });
  };

  /** 获取文章列表 */
  getList = async (req: Request, res: Response) => {
    const result = await articleService.getArticleList(req.body);
    this.successResult(res, result, { message: "获取文章列表成功" });
  };

  /** 获取文章详情 */
  getDetail = async (req: Request, res: Response) => {
    const article = await articleService.getArticleDetail(req.body.id);
    if (!article) {
      this.notFoundResult(res, { message: "文章不存在或已下架" });
      return;
    }
    this.successResult(res, article, { message: "获取文章详情成功" });
  };

  /* ═══════ 管理端 ═══════ */

  // ── 文章 ──

  /** 创建文章 */
  createArticle = async (req: Request, res: Response) => {
    const article = await articleService.createArticle({
      ...req.body,
      userId: req.user!.userId,
    });
    this.createResult(res, article, { message: "创建文章成功" });
  };

  /** 更新文章 */
  updateArticle = async (req: Request, res: Response) => {
    const { id, ...data } = req.body;
    const article = await articleService.updateArticle(id, data);
    if (!article) {
      this.notFoundResult(res, { message: "文章不存在" });
      return;
    }
    this.successResult(res, article, { message: "更新文章成功" });
  };

  /** 删除文章 */
  deleteArticle = async (req: Request, res: Response) => {
    await articleService.deleteArticle(req.body.id);
    this.successResult(res, null, { message: "删除文章成功" });
  };

  /** 管理端文章列表 */
  getAdminList = async (req: Request, res: Response) => {
    const result = await articleService.getAdminArticleList(req.body);
    this.successResult(res, result, { message: "获取文章列表成功" });
  };

  /** 管理端文章详情 */
  getAdminDetail = async (req: Request, res: Response) => {
    const article = await articleService.getAdminArticleDetail(req.body.id);
    if (!article) {
      this.notFoundResult(res, { message: "文章不存在" });
      return;
    }
    this.successResult(res, article, { message: "获取文章详情成功" });
  };

  // ── 分类 ──

  /** 创建分类 */
  createCategory = async (req: Request, res: Response) => {
    const category = await articleService.createCategory(req.body);
    this.createResult(res, category, { message: "创建分类成功" });
  };

  /** 更新分类 */
  updateCategory = async (req: Request, res: Response) => {
    const { id, ...data } = req.body;
    const category = await articleService.updateCategory(id, data);
    if (!category) {
      this.notFoundResult(res, { message: "分类不存在" });
      return;
    }
    this.successResult(res, category, { message: "更新分类成功" });
  };

  /** 删除分类 */
  deleteCategory = async (req: Request, res: Response) => {
    await articleService.deleteCategory(req.body.id);
    this.successResult(res, null, { message: "删除分类成功" });
  };

  /** 管理端分类列表 */
  getAdminCategoryList = async (req: Request, res: Response) => {
    const result = await articleService.getAdminCategoryList(req.body);
    this.successResult(res, result, { message: "获取分类列表成功" });
  };

  // ── 标签 ──

  /** 创建标签 */
  createTag = async (req: Request, res: Response) => {
    const tag = await articleService.createTag(req.body.name);
    this.createResult(res, tag, { message: "创建标签成功" });
  };

  /** 更新标签 */
  updateTag = async (req: Request, res: Response) => {
    const { id, name } = req.body;
    const tag = await articleService.updateTag(id, name);
    if (!tag) {
      this.notFoundResult(res, { message: "标签不存在" });
      return;
    }
    this.successResult(res, tag, { message: "更新标签成功" });
  };

  /** 删除标签 */
  deleteTag = async (req: Request, res: Response) => {
    await articleService.deleteTag(req.body.id);
    this.successResult(res, null, { message: "删除标签成功" });
  };

  /** 管理端标签列表 */
  getAdminTagList = async (req: Request, res: Response) => {
    const result = await articleService.getAdminTagList(req.body);
    this.successResult(res, result, { message: "获取标签列表成功" });
  };
}

export const articleController = new ArticleController();
