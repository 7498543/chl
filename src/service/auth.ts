import { BaseService } from "@/core";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { user } from "@/core/db/schema/sys";
import type { RegisterDtoType } from "@/dto/auth.dto";
import type { UserInsert } from "@/core/db/schema/sys";

export class AuthService extends BaseService {
  /**
   * 用户注册
   */
  async register(data: RegisterDtoType) {
    const db = this.db();

    const { email, username, nickname, password } = data;

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
      role: "user",
      enabled: 1,
    };

    const [result] = await db.insert(user).values(newUser).returning({
      id: user.id,
      username: user.username,
      nickname: user.nickname,
      email: user.email,
      role: user.role,
    });

    return {
      success: true,
      data: result,
    };
  }

  /**
   * 用户登录
   */
  async login(username: string, password: string) {
    const db = this.db();

    const [userRecord] = await db
      .select({
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        password: user.password,
        role: user.role,
        enabled: user.enabled,
        avatar: user.avatar,
      })
      .from(user)
      .where(eq(user.username, username))
      .limit(1);

    if (!userRecord) {
      return {
        success: false,
        message: "用户名或密码错误",
      };
    }

    if (userRecord.enabled !== 1) {
      return {
        success: false,
        message: "账号已被禁用，请联系管理员",
      };
    }

    const valid = await bcrypt.compare(password, userRecord.password);
    if (!valid) {
      return {
        success: false,
        message: "用户名或密码错误",
      };
    }

    const { password: _, ...userWithoutPassword } = userRecord;
    return {
      success: true,
      data: userWithoutPassword,
    };
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(userId: number) {
    const db = this.db();

    const [userRecord] = await db
      .select({
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    return userRecord || null;
  }
}

export const authService = new AuthService();
