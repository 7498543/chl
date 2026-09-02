import multer from "multer";
import path from "path";
import fs from "fs";

import { useRuntimeConfig } from "@/core";

const config = useRuntimeConfig();

const UPLOAD_FOLDER = config.UPLOAD_DIR;

if (!fs.existsSync(UPLOAD_FOLDER)) fs.mkdirSync(UPLOAD_FOLDER);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_FOLDER);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.random().toString(36) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });
