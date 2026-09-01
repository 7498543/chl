// ---------------------------------------------------
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

// ---------------------------------------------------
// 创建应用实例
// ---------------------------------------------------
const app = express();
app.use(cors());

// ---------------------------------------------------
module.exports = app;
