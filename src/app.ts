// ---------------------------------------------------
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import router from "@/routes";

// ---------------------------------------------------
// 创建应用实例
// ---------------------------------------------------
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

// ---------------------------------------------------
export default app;
