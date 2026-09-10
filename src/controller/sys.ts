import { BaseController } from "@/core";
import { sysService } from "@/service/sys";
import type { Request, Response } from "express";

/* ═══════ 站点版本 ═══════ */
export class SiteVersionController extends BaseController {
  create = async (req: Request, res: Response) => {
    const item = await sysService.createSiteVersion(req.body);
    this.createResult(res, item, { message: "创建版本成功" });
  };

  update = async (req: Request, res: Response) => {
    const { id, ...data } = req.body;
    const item = await sysService.updateSiteVersion(id, data);
    if (!item) {
      this.notFoundResult(res, { message: "版本不存在" });
      return;
    }
    this.successResult(res, item, { message: "更新版本成功" });
  };

  delete = async (req: Request, res: Response) => {
    const result = await sysService.deleteSiteVersion(req.body.id);
    if (!result) {
      this.notFoundResult(res, { message: "版本不存在" });
      return;
    }
    this.successResult(res, null, { message: "删除版本成功" });
  };

  list = async (req: Request, res: Response) => {
    const result = await sysService.listSiteVersions(req.body);
    this.successResult(res, result, { message: "获取版本列表成功" });
  };

  detail = async (req: Request, res: Response) => {
    const item = await sysService.getSiteVersion(req.body.id);
    if (!item) {
      this.notFoundResult(res, { message: "版本不存在" });
      return;
    }
    this.successResult(res, item, { message: "获取版本详情成功" });
  };
}

/* ═══════ 页面 ═══════ */
export class PageController extends BaseController {
  create = async (req: Request, res: Response) => {
    const item = await sysService.createPage(req.body);
    this.createResult(res, item, { message: "创建页面成功" });
  };

  update = async (req: Request, res: Response) => {
    const { id, ...data } = req.body;
    const item = await sysService.updatePage(id, data);
    if (!item) {
      this.notFoundResult(res, { message: "页面不存在" });
      return;
    }
    this.successResult(res, item, { message: "更新页面成功" });
  };

  delete = async (req: Request, res: Response) => {
    const result = await sysService.deletePage(req.body.id);
    if (!result) {
      this.notFoundResult(res, { message: "页面不存在" });
      return;
    }
    this.successResult(res, null, { message: "删除页面成功" });
  };

  list = async (req: Request, res: Response) => {
    const result = await sysService.listPages(req.body);
    this.successResult(res, result, { message: "获取页面列表成功" });
  };

  detail = async (req: Request, res: Response) => {
    const item = await sysService.getPage(req.body.id);
    if (!item) {
      this.notFoundResult(res, { message: "页面不存在" });
      return;
    }
    this.successResult(res, item, { message: "获取页面详情成功" });
  };

  /** 通过 slug 获取页面（前端展示用） */
  detailBySlug = async (req: Request, res: Response) => {
    const item = await sysService.getPageBySlug(req.body.slug);
    if (!item) {
      this.notFoundResult(res, { message: "页面不存在" });
      return;
    }
    this.successResult(res, item, { message: "获取页面详情成功" });
  };
}

/* ═══════ SEO 元数据 ═══════ */
export class SeoMetaController extends BaseController {
  create = async (req: Request, res: Response) => {
    const item = await sysService.createSeoMeta(req.body);
    this.createResult(res, item, { message: "创建 SEO 成功" });
  };

  update = async (req: Request, res: Response) => {
    const { id, ...data } = req.body;
    const item = await sysService.updateSeoMeta(id, data);
    if (!item) {
      this.notFoundResult(res, { message: "SEO 记录不存在" });
      return;
    }
    this.successResult(res, item, { message: "更新 SEO 成功" });
  };

  delete = async (req: Request, res: Response) => {
    const result = await sysService.deleteSeoMeta(req.body.id);
    if (!result) {
      this.notFoundResult(res, { message: "SEO 记录不存在" });
      return;
    }
    this.successResult(res, null, { message: "删除 SEO 成功" });
  };

  list = async (req: Request, res: Response) => {
    const result = await sysService.listSeoMetas(req.body);
    this.successResult(res, result, { message: "获取 SEO 列表成功" });
  };

  detail = async (req: Request, res: Response) => {
    const item = await sysService.getSeoMetaByTarget(req.body.type, req.body.targetId);
    if (!item) {
      this.notFoundResult(res, { message: "SEO 记录不存在" });
      return;
    }
    this.successResult(res, item, { message: "获取 SEO 详情成功" });
  };
}

export const siteVersionController = new SiteVersionController();
export const pageController = new PageController();
export const seoMetaController = new SeoMetaController();
