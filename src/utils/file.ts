import fsSync from "fs";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

import { useRuntimeConfig } from "@/core";

// ──────────────────────────────────────────────
// 类型定义（与数据库 asset_lib 字段对应，但不耦合数据库）
// ──────────────────────────────────────────────

/** 资产类型（与 asset_type 枚举一致） */
export type AssetType =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "spreadsheet"
  | "presentation"
  | "archive"
  | "font"
  | "code"
  | "ebook"
  | "file"
  | "unknown";

/** 文件元数据（镜像 asset_lib 表结构，纯数据层） */
export interface FileMeta {
  type: AssetType;
  originalName: string;
  url: string;
  metadata: Record<string, unknown>;
  albumId?: number;
  title?: string;
  alt?: string;
  sort?: number;
  size: number;
  mime: string;
  ext: string;
  filename: string;
}

/** 分片上传配置 */
export interface ChunkOptions {
  index: number;
  total: number;
  identifier: string;
  originalName: string;
  chunk: Buffer;
}

/** 合并分片配置 */
export interface MergeOptions {
  identifier: string;
  originalName: string;
  total: number;
  title?: string;
  alt?: string;
  albumId?: number;
}

// ──────────────────────────────────────────────
// 危险文件过滤
// ──────────────────────────────────────────────

/** 禁止上传的文件扩展名（服务端可执行/高危脚本） */
const DANGEROUS_EXT = new Set([
  // Windows 可执行
  "exe",
  "dll",
  "com",
  "scr",
  "msi",
  "msp",
  "bat",
  "cmd",
  // Unix 可执行
  "sh",
  "bash",
  "zsh",
  "fish",
  // 服务端脚本
  "php",
  "phtml",
  "php3",
  "php4",
  "php5",
  "php7",
  "phps",
  "py",
  "pyc",
  "pyo",
  "pl",
  "pm",
  "cgi",
  "asp",
  "aspx",
  "ashx",
  "asmx",
  "jsp",
  "jspx",
  "jspa",
  "ps1",
  "psm1",
  "vbs",
  "vbe",
  // 其他高危
  "jar",
  "war",
  "ear",
  "reg",
  "swf",
]);

/** 检查文件扩展名是否安全 */
export function isSafeFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase().replace(".", "");
  return !DANGEROUS_EXT.has(ext);
}

/** 获取安全的文件扩展名，危险文件抛异常 */
export function assertSafeFile(filename: string): void {
  if (!isSafeFile(filename)) {
    const ext = path.extname(filename);
    throw new Error(`禁止上传危险文件类型: ${ext}`);
  }
}

// ──────────────────────────────────────────────
// 内部常量 & 工具函数
// ──────────────────────────────────────────────

const config = useRuntimeConfig();
const rootDir = path.resolve(config.UPLOAD_DIR);
/** 临时目录名，用于存放未合并的分片 */
const CHUNK_DIR = "_chunks";

/** 扩展名 → 资产类型映射 */
const typeMap: Record<string, AssetType> = {
  // ── 图片 ──
  jpg: "image",
  jpeg: "image",
  png: "image",
  gif: "image",
  webp: "image",
  svg: "image",
  bmp: "image",
  ico: "image",
  avif: "image",
  // ── 视频 ──
  mp4: "video",
  avi: "video",
  mov: "video",
  wmv: "video",
  flv: "video",
  mkv: "video",
  webm: "video",
  // ── 音频 ──
  mp3: "audio",
  wav: "audio",
  ogg: "audio",
  flac: "audio",
  aac: "audio",
  wma: "audio",
  m4a: "audio",
  // ── 文档 ──
  pdf: "document",
  doc: "document",
  docx: "document",
  txt: "document",
  md: "document",
  rst: "document",
  // ── 表格 ──
  xls: "spreadsheet",
  xlsx: "spreadsheet",
  csv: "spreadsheet",
  // ── 演示 ──
  ppt: "presentation",
  pptx: "presentation",
  // ── 压缩包 ──
  zip: "archive",
  rar: "archive",
  "7z": "archive",
  tar: "archive",
  gz: "archive",
  bz2: "archive",
  xz: "archive",
  zst: "archive",
  // ── 字体 ──
  ttf: "font",
  otf: "font",
  woff: "font",
  woff2: "font",
  eot: "font",
  // ── 代码/配置 ──
  json: "code",
  xml: "code",
  yaml: "code",
  yml: "code",
  toml: "code",
  js: "code",
  ts: "code",
  jsx: "code",
  tsx: "code",
  html: "code",
  htm: "code",
  css: "code",
  scss: "code",
  less: "code",
  // ── 电子书 ──
  epub: "ebook",
  mobi: "ebook",
  azw3: "ebook",
  fb2: "ebook",
};

/** 扩展名 → MIME 映射 */
const mimeMap: Record<string, string> = {
  // image
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  bmp: "image/bmp",
  ico: "image/x-icon",
  avif: "image/avif",
  // video
  mp4: "video/mp4",
  avi: "video/x-msvideo",
  mov: "video/quicktime",
  wmv: "video/x-ms-wmv",
  flv: "video/x-flv",
  mkv: "video/x-matroska",
  webm: "video/webm",
  // audio
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  flac: "audio/flac",
  aac: "audio/aac",
  wma: "audio/x-ms-wma",
  m4a: "audio/mp4",
  // document
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  txt: "text/plain",
  md: "text/markdown",
  // spreadsheet
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  csv: "text/csv",
  // presentation
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  // archive
  zip: "application/zip",
  rar: "application/vnd.rar",
  "7z": "application/x-7z-compressed",
  tar: "application/x-tar",
  gz: "application/gzip",
  bz2: "application/x-bzip2",
  // font
  ttf: "font/ttf",
  otf: "font/otf",
  woff: "font/woff",
  woff2: "font/woff2",
  // code
  json: "application/json",
  xml: "application/xml",
  yaml: "application/x-yaml",
  toml: "application/toml",
  js: "text/javascript",
  ts: "text/typescript",
  html: "text/html",
  css: "text/css",
  // ebook
  epub: "application/epub+zip",
  mobi: "application/x-mobipocket-ebook",
};

/** 根据扩展名推断资产类型 */
function detectType(ext: string): AssetType {
  return typeMap[ext.toLowerCase()] || "file";
}

/** 获取扩展名（不含点，全小写） */
function getExt(filename: string): string {
  const e = path.extname(filename).toLowerCase();
  return e ? e.slice(1) : "";
}

/** 获取 MIME 类型 */
function getMimeType(ext: string): string {
  return mimeMap[ext.toLowerCase()] || "application/octet-stream";
}

/** 生成唯一存储文件名 */
function generateFilename(originalName: string): string {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${random}${ext}`;
}

/** 生成按类型/日期分组的相对路径（如 image/2025/09/07/） */
function buildRelativeDir(type: AssetType, subDir?: string): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const datePath = path.join(String(y), m, d);
  return subDir ? path.join(type, subDir, datePath) : path.join(type, datePath);
}

/** 确保目录存在 */
async function ensureDir(dir: string): Promise<void> {
  await fs.mkdir(dir, { recursive: true });
}

/** 检查目录是否存在 */
function existsSync(dir: string): boolean {
  return fsSync.existsSync(dir);
}

// ──────────────────────────────────────────────
// 核心 API
// ──────────────────────────────────────────────

/**
 * 保存文件到磁盘
 * @param buffer        文件二进制数据
 * @param originalName  原始文件名
 * @param options       可选元数据
 * @throws {Error} 危险文件类型将被拒绝
 */
export async function saveFile(
  buffer: Buffer,
  originalName: string,
  options?: {
    title?: string;
    alt?: string;
    albumId?: number;
    sort?: number;
    subDir?: string;
  },
): Promise<FileMeta> {
  // 危险文件拦截
  assertSafeFile(originalName);

  const ext = getExt(originalName);
  const type = detectType(ext);
  const filename = generateFilename(originalName);

  const relativeDir = buildRelativeDir(type, options?.subDir);
  const relativePath = path.join(relativeDir, filename);
  const absoluteDir = path.join(rootDir, relativeDir);
  const absolutePath = path.join(rootDir, relativePath);

  await ensureDir(absoluteDir);
  await fs.writeFile(absolutePath, buffer);

  // 构建元数据
  const meta: Record<string, unknown> = {
    size: buffer.length,
    mime: getMimeType(ext),
  };

  // 图片提取尺寸
  if (type === "image") {
    try {
      const imageMeta = await sharp(buffer).metadata();
      if (imageMeta.width) meta.width = imageMeta.width;
      if (imageMeta.height) meta.height = imageMeta.height;
      if (imageMeta.format) meta.format = imageMeta.format;
      if (imageMeta.channels) meta.channels = imageMeta.channels;
      if (imageMeta.hasAlpha !== undefined) meta.hasAlpha = imageMeta.hasAlpha;
    } catch {
      // 非标准图片，忽略
    }
  }

  return {
    type,
    originalName,
    url: relativePath.replace(/\\/g, "/"),
    metadata: meta,
    albumId: options?.albumId,
    title: options?.title,
    alt: options?.alt,
    sort: options?.sort,
    size: buffer.length,
    mime: getMimeType(ext),
    ext,
    filename,
  };
}

/**
 * 删除文件
 * @param url 相对路径 URL（即 FileMeta.url）
 */
export async function deleteFile(url: string): Promise<boolean> {
  const absolutePath = path.join(rootDir, url);
  try {
    await fs.unlink(absolutePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * 批量删除文件
 */
export async function deleteFiles(urls: string[]): Promise<number> {
  const results = await Promise.allSettled(urls.map(deleteFile));
  return results.filter((r) => r.status === "fulfilled" && r.value).length;
}

/**
 * 获取文件元数据（不读取内容）
 */
export async function getFileMeta(url: string): Promise<FileMeta | null> {
  const absolutePath = path.join(rootDir, url);
  try {
    const stat = await fs.stat(absolutePath);
    if (!stat.isFile()) return null;

    const ext = getExt(url);
    const type = detectType(ext);

    const meta: Record<string, unknown> = {
      size: stat.size,
      mime: getMimeType(ext),
      createdAt: stat.birthtime.toISOString(),
      modifiedAt: stat.mtime.toISOString(),
    };

    if (type === "image" && stat.size > 0) {
      try {
        const buffer = await fs.readFile(absolutePath);
        const imageMeta = await sharp(buffer).metadata();
        if (imageMeta.width) meta.width = imageMeta.width;
        if (imageMeta.height) meta.height = imageMeta.height;
        if (imageMeta.format) meta.format = imageMeta.format;
      } catch {
        /* ignore */
      }
    }

    return {
      type,
      originalName: path.basename(url),
      url: url.replace(/\\/g, "/"),
      metadata: meta,
      size: stat.size,
      mime: getMimeType(ext),
      ext,
      filename: path.basename(url),
    };
  } catch {
    return null;
  }
}

/**
 * 读取文件内容
 */
export async function readFile(url: string): Promise<Buffer | null> {
  const absolutePath = path.join(rootDir, url);
  try {
    return await fs.readFile(absolutePath);
  } catch {
    return null;
  }
}

/**
 * 列出指定目录下的所有文件
 */
export async function listFiles(type?: AssetType, subDir?: string): Promise<FileMeta[]> {
  const searchDir = type ? path.join(rootDir, type, subDir || "") : rootDir;

  if (!existsSync(searchDir)) return [];

  const entries = await fs.readdir(searchDir, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile());

  const results: FileMeta[] = [];
  for (const file of files) {
    const relativePath = type ? path.join(type, subDir || "", file.name) : file.name;
    const meta = await getFileMeta(relativePath);
    if (meta) results.push(meta);
  }

  return results.sort((a, b) => {
    const aTime = String(a.metadata?.createdAt || "");
    const bTime = String(b.metadata?.createdAt || "");
    return bTime.localeCompare(aTime);
  });
}

// ──────────────────────────────────────────────
// 分片上传
// ──────────────────────────────────────────────

/**
 * 上传单个分片
 */
export async function uploadChunk(options: ChunkOptions): Promise<void> {
  // 分片也检查文件名安全性
  assertSafeFile(options.originalName);

  const chunkDir = path.join(rootDir, CHUNK_DIR, options.identifier);
  await ensureDir(chunkDir);
  const chunkPath = path.join(chunkDir, String(options.index));
  await fs.writeFile(chunkPath, options.chunk);
}

/**
 * 检查分片是否已全部上传完毕
 */
export async function areAllChunksUploaded(identifier: string, total: number): Promise<boolean> {
  const chunkDir = path.join(rootDir, CHUNK_DIR, identifier);
  if (!existsSync(chunkDir)) return false;

  const entries = await fs.readdir(chunkDir);
  const chunkFiles = entries.filter((e) => /^\d+$/.test(e));
  return chunkFiles.length >= total;
}

/**
 * 合并分片为完整文件
 */
export async function mergeChunks(options: MergeOptions): Promise<FileMeta> {
  const chunkDir = path.join(rootDir, CHUNK_DIR, options.identifier);
  if (!existsSync(chunkDir)) {
    throw new Error(`分片目录不存在: ${options.identifier}`);
  }

  const chunks: Buffer[] = [];
  for (let i = 0; i < options.total; i++) {
    const chunkPath = path.join(chunkDir, String(i));
    try {
      chunks.push(await fs.readFile(chunkPath));
    } catch {
      throw new Error(`分片 ${i} 不存在或无法读取`);
    }
  }

  const mergedBuffer = Buffer.concat(chunks);
  const fileMeta = await saveFile(mergedBuffer, options.originalName, {
    title: options.title,
    alt: options.alt,
    albumId: options.albumId,
  });

  await fs.rm(chunkDir, { recursive: true, force: true });
  return fileMeta;
}

/**
 * 获取分片上传状态
 */
export async function getChunkStatus(
  identifier: string,
  total: number,
): Promise<{
  uploaded: number[];
  missing: number[];
  complete: boolean;
}> {
  const chunkDir = path.join(rootDir, CHUNK_DIR, identifier);
  if (!existsSync(chunkDir)) {
    return {
      uploaded: [],
      missing: Array.from({ length: total }, (_, i) => i),
      complete: false,
    };
  }

  const entries = await fs.readdir(chunkDir);
  const uploadedIndices = entries
    .filter((e) => /^\d+$/.test(e))
    .map(Number)
    .sort((a, b) => a - b);

  const uploadedSet = new Set(uploadedIndices);
  const missing = Array.from({ length: total }, (_, i) => i).filter((i) => !uploadedSet.has(i));

  return { uploaded: uploadedIndices, missing, complete: missing.length === 0 };
}

/**
 * 取消分片上传（清理临时文件）
 */
export async function cancelChunkUpload(identifier: string): Promise<boolean> {
  const chunkDir = path.join(rootDir, CHUNK_DIR, identifier);
  try {
    await fs.rm(chunkDir, { recursive: true, force: true });
    return true;
  } catch {
    return false;
  }
}
