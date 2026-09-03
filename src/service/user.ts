import { BaseService } from "@/core";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { user } from "@/core/db/schema/sys";
import type { CreateUserDtoType } from "@/dto/user.dto";
import type { UserInsert } from "@/core/db/schema/sys";

export class UserService extends BaseService {
  /**
   * 创建用户（后台）
   */
  async createUser(data: CreateUserDtoType) {
    const db = this.db();

    const { email, username, nickname, password, role, enabled } = data;

    const [existUser] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.username, username))
      .limit(1);

    if (existUser) {
      return {
        success: false,
        message: "用户名已存在",
      };
    }

    const [existEmail] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (existEmail) {
      return {
        success: false,
        message: "邮箱已被注册",
      };
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser: UserInsert = {
      email,
      username,
      nickname,
      password: hashedPassword,
      role,
      enabled,
    };

    const [result] = await db.insert(user).values(newUser).returning({
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      role: user.role,
      enabled: user.enabled,
    });

    return {
      success: true,
      data: result,
    };
  }
}

export const userService = new UserService();
