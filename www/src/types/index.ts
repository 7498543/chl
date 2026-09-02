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
  icon: string;
  link: string;
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

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
