import { http } from "@/lib/api";
import type { PaginatedResponse, PaginationParams, User } from "@/types";

export interface CreateUserParams {
  email: string;
  username: string;
  nickname: string;
  password: string;
  role?: "user" | "admin" | "editor";
  enabled?: number;
}

export function createUser(data: CreateUserParams) {
  return http.post<User>("/admin/user/create", data);
}

export function getUserList(params: PaginationParams = {}) {
  return http.post<PaginatedResponse<User>>("/admin/user/list", params);
}

export function updateUser(data: Partial<User> & IdParam) {
  return http.post<User>("/admin/user/update", data);
}

export function deleteUser(data: IdParam) {
  return http.post<null>("/admin/user/delete", data);
}
