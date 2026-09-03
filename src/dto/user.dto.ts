import { z } from "zod";

/** 创建用户 DTO */
export const CreateUserDto = z.object({
  email: z.string().email("邮箱格式不正确"),
  username: z.string().min(3, "用户名至少3个字符").max(20, "用户名最多20个字符"),
  nickname: z.string().min(1, "昵称不能为空").max(50, "昵称最多50个字符"),
  password: z.string().min(6, "密码至少6个字符").max(32, "密码最多32个字符"),
  role: z.enum(["user", "admin"]).default("user"),
  enabled: z.coerce.number().int().min(0).max(1).default(1),
});

export type CreateUserDtoType = z.infer<typeof CreateUserDto>;
