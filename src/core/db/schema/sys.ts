import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createSchema } from "../tool";

// 系统用户表
export const user = pgTable(
  "user",
  createSchema({
    id: serial("id").primaryKey(),
    email: text("email").unique(),
    username: text("username").unique(),
    nickname: text("nickname"),
    password: text("password"),
  }),
);
