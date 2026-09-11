// -------------------------------
// 后台数据库表结构定义
// -------------------------------

import { Recordable } from "./helper";

/** 用户表结构定义 */
export interface User {
  id: number;
  email: string;
  username: string;
  nickname: string;
  avatar: string;
  role: string;
  lastLoginAt: string;
  enabled: number;
  createdAt: string;
  updatedAt: string;
}

/** 文章表结构定义 */
export interface Article {
  id: number;
  title: string;
  description: string;
  content: string;
  userId: number;
  categoryId: number;
  sort: number;
  enabled: number;
  createdAt: string;
  updatedAt: string;
}

/** 文章分类表结构定义 */
export interface ArticleCategory {
  id: number;
  name: string;
  slug: string;
  icon: string;
  coverId: number;
  sort: number;
  enabled: number;
  createdAt: string;
  updatedAt: string;
}

/** 标签表结构定义 */
export interface Tag {
  id: number;
  name: string;
  sort: number;
  enabled: number;
  createdAt: string;
  updatedAt: string;
}

/** 资产表结构定义 */
export interface Asset {}

/** 资产册表结构定义 */
export interface AssetAlbum {}

/** 后台 API 标准响应消息类型定义 */
export type ApiMessageType = "success" | "error" | "warning" | "info";

/** 后台 API 标准响应消息类型定义 */
export interface ApiMessage {
  show: boolean;
  message: string;
  timestamp: string;
  type: ApiMessageType;
}

/** 后台 API 标准响应消息类型定义 */
export interface ApiResponse<T> {
  code: number;
  message: ApiMessage;
  data: T;
}

/** 分页参数表结构定义 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

/** 分页响应表结构定义 */
export interface PaginatedResponse<T> {
  list: T[];
  count: number;
}

export interface ListResponse<T = Recordable> extends ApiResponse<PaginatedResponse<T>> {}
