import { BaseController } from "@/core";
import { assetService } from "@/service/asset";
import type { Request, Response } from "express";
import fs from "fs/promises";

export class AssetController extends BaseController {
  /* ═══════ 资产 ═══════ */

  /** 上传资产 */
  upload = async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      this.errorResult(res, { message: "未选择文件" });
      return;
    }

    const asset = await assetService.uploadAsset(
      file.buffer || (await fs.readFile(file.path)),
      file.originalname,
      req.body,
    );
    this.createResult(res, asset, { message: "上传成功" });
  };

  /** 资产列表 */
  list = async (req: Request, res: Response) => {
    const result = await assetService.listAssets(req.body);
    this.successResult(res, result, { message: "获取资产列表成功" });
  };

  /** 资产详情 */
  detail = async (req: Request, res: Response) => {
    const asset = await assetService.getAsset(req.body.id);
    if (!asset) {
      this.notFoundResult(res, { message: "资产不存在" });
      return;
    }
    this.successResult(res, asset, { message: "获取资产详情成功" });
  };

  /** 更新资产 */
  update = async (req: Request, res: Response) => {
    const { id, ...data } = req.body;
    const asset = await assetService.updateAsset(id, data);
    if (!asset) {
      this.notFoundResult(res, { message: "资产不存在" });
      return;
    }
    this.successResult(res, asset, { message: "更新资产成功" });
  };

  /** 删除资产 */
  delete = async (req: Request, res: Response) => {
    const result = await assetService.deleteAsset(req.body.id);
    if (!result) {
      this.notFoundResult(res, { message: "资产不存在" });
      return;
    }
    this.successResult(res, null, { message: "删除资产成功" });
  };

  /* ═══════ 相册 ═══════ */

  /** 创建相册 */
  createAlbum = async (req: Request, res: Response) => {
    const album = await assetService.createAlbum(req.body);
    this.createResult(res, album, { message: "创建相册成功" });
  };

  /** 更新相册 */
  updateAlbum = async (req: Request, res: Response) => {
    const { id, ...data } = req.body;
    const album = await assetService.updateAlbum(id, data);
    if (!album) {
      this.notFoundResult(res, { message: "相册不存在" });
      return;
    }
    this.successResult(res, album, { message: "更新相册成功" });
  };

  /** 删除相册 */
  deleteAlbum = async (req: Request, res: Response) => {
    const result = await assetService.deleteAlbum(req.body.id);
    if (!result) {
      this.notFoundResult(res, { message: "相册不存在" });
      return;
    }
    this.successResult(res, null, { message: "删除相册成功" });
  };

  /** 相册列表 */
  listAlbums = async (req: Request, res: Response) => {
    const result = await assetService.listAlbums(req.body);
    this.successResult(res, result, { message: "获取相册列表成功" });
  };

  /** 全部相册（下拉选择） */
  allAlbums = async (_req: Request, res: Response) => {
    const list = await assetService.getAllAlbums();
    this.successResult(res, list, { message: "获取相册列表成功" });
  };
}

export const assetController = new AssetController();
