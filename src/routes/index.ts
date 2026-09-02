import express from "express";
import baseRouter from "./router/base";

const router = express.Router();

// TODO 自动导入所有路由

router.use("/base", baseRouter);

export default router;
