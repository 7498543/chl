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

export interface Tag {
  id: number;
  name: string;
  sort: number;
  enabled: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface IdParam {
  id: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  username: string;
  nickname: string;
  password: string;
}

export interface Asset {
  id: number;
  filename: string;
  url: string;
  type: string;
  size: number;
  title: string;
  alt: string;
  albumId: number;
  sort: number;
  createdAt: string;
  updatedAt: string;
}

export interface AssetAlbum {
  id: number;
  name: string;
  parentId: number;
  sort: number;
  createdAt: string;
  updatedAt: string;
}

export interface Page {
  id: number;
  name: string;
  slug: string;
  content: Record<string, unknown>;
  siteVersionId: number;
  enabled: number;
  createdAt: string;
  updatedAt: string;
}

export interface SeoMeta {
  id: number;
  type: "page" | "article";
  targetId: number;
  title: string;
  keywords: string;
  description: string;
  ogImage: string;
  canonical: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteVersion {
  id: number;
  name: string;
  version: string;
  description: string;
  content: Record<string, unknown>;
  enabled: number;
  createdAt: string;
  updatedAt: string;
}
