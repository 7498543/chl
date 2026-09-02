import express from "express";
import path from "node:path";
import baseRouter from "./router/base";

const router = express.Router();

router.use(express.static(path.resolve("public")));

// TODO 自动导入所有路由

router.use("/base", baseRouter);

export default router;
