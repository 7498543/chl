import { http } from "@/lib/api";
import type { LoginRequest, LoginResponse, RegisterRequest, User } from "@/types";
import { z } from "zod";

export const loginScheme = z.object({
  username: z.string().min(1, "用户名不能为空"),
  password: z.string().min(1, "密码不能为空"),
});

export const registerScheme = z.object({
  email: z.string().email("邮箱格式不正确"),
  username: z.string().min(3, "用户名至少3个字符").max(20, "用户名最多20个字符"),
  nickname: z.string().min(1, "昵称不能为空").max(50, "昵称最多50个字符"),
  password: z.string().min(6, "密码至少6个字符").max(32, "密码最多32个字符"),
});

export function login(data: LoginRequest) {
  return http.post<LoginResponse>("/auth/login", data);
}

export function register(data: RegisterRequest) {
  return http.post<{ user: User }>("/auth/register", data);
}

export function getUserInfo() {
  return http.get<User>("/admin/user/info");
}
