import { z } from "zod";

/** 用户注册 DTO */
export const RegisterDto = z.object({
  email: z.string().email("邮箱格式不正确"),
  username: z.string().min(3, "用户名至少3个字符").max(20, "用户名最多20个字符"),
  nickname: z.string().min(1, "昵称不能为空").max(50, "昵称最多50个字符"),
  password: z.string().min(6, "密码至少6个字符").max(32, "密码最多32个字符"),
});

export type RegisterDtoType = z.infer<typeof RegisterDto>;

/** 用户登录 DTO */
export const LoginDto = z.object({
  username: z.string().min(1, "用户名不能为空"),
  password: z.string().min(1, "密码不能为空"),
});

export type LoginDtoType = z.infer<typeof LoginDto>;
