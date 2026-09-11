// ==================== 存储封装 ====================

interface StorageOptions {
  /** 过期时间（毫秒） */
  expire?: number;
}

/** SSR 安全获取 Storage */
function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage;
  } catch {
    return null;
  }
}

function getSessionStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage;
  } catch {
    return null;
  }
}

class StorageWrapper {
  private getStorage: () => Storage | null;

  constructor(getStorage: () => Storage | null) {
    this.getStorage = getStorage;
  }

  /** 设置存储项 */
  set<T>(key: string, value: T, options?: StorageOptions): void {
    const storage = this.getStorage();
    if (!storage) return;
    const data = {
      value,
      expire: options?.expire ? Date.now() + options.expire : null,
    };
    storage.setItem(key, JSON.stringify(data));
  }

  /** 获取存储项 */
  get<T = unknown>(key: string): T | null {
    const storage = this.getStorage();
    if (!storage) return null;
    const raw = storage.getItem(key);
    if (!raw) return null;

    try {
      const data = JSON.parse(raw) as { value: T; expire: number | null };
      if (data.expire && Date.now() > data.expire) {
        storage.removeItem(key);
        return null;
      }
      return data.value;
    } catch {
      return raw as unknown as T;
    }
  }

  /** 移除存储项 */
  remove(key: string): void {
    const storage = this.getStorage();
    if (!storage) return;
    storage.removeItem(key);
  }

  /** 清除所有存储 */
  clear(): void {
    const storage = this.getStorage();
    if (!storage) return;
    storage.clear();
  }
}

/** 本地存储（带过期时间支持，SSR 安全） */
export const storage = new StorageWrapper(getStorage);

/** 会话存储（SSR 安全） */
export const session = new StorageWrapper(getSessionStorage);

// ==================== 类型判断 ====================

export const is = {
  /** 是否为字符串 */
  string: (val: unknown): val is string => typeof val === "string",

  /** 是否为数字 */
  number: (val: unknown): val is number => typeof val === "number" && !Number.isNaN(val),

  /** 是否为布尔值 */
  boolean: (val: unknown): val is boolean => typeof val === "boolean",

  /** 是否为数组 */
  array: <T = unknown>(val: unknown): val is T[] => Array.isArray(val),

  /** 是否为对象（不含 null） */
  object: (val: unknown): val is Record<string, unknown> =>
    val !== null && typeof val === "object" && !Array.isArray(val),

  /** 是否为函数 */
  function: (val: unknown): val is (...args: unknown[]) => unknown => typeof val === "function",

  /** 是否为空值（null / undefined / '' / [] / {}） */
  empty: (val: unknown): boolean => {
    if (val === null || val === undefined) return true;
    if (typeof val === "string" || Array.isArray(val)) return val.length === 0;
    if (typeof val === "object") return Object.keys(val).length === 0;
    return false;
  },

  /** 是否为 Promise */
  promise: (val: unknown): val is Promise<unknown> =>
    val instanceof Promise ||
    (val !== null &&
      typeof val === "object" &&
      "then" in val &&
      typeof (val as Record<string, unknown>).then === "function"),

  /** 是否为 Blob */
  blob: (val: unknown): val is Blob => val instanceof Blob,

  /** 是否为 File */
  file: (val: unknown): val is File => val instanceof File,

  /** 是否为有效的 URL */
  url: (val: string): boolean => {
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  },
};

// ==================== 字符串工具 ====================

export const str = {
  /** 截断字符串 */
  truncate(text: string, maxLength: number, suffix = "..."): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).replace(/\s+\S*$/, "") + suffix;
  },

  /** 首字母大写 */
  capitalize(text: string): string {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
  },

  /** 驼峰转下划线 */
  camelToSnake(text: string): string {
    return text.replace(/([A-Z])/g, "_$1").toLowerCase();
  },

  /** 下划线转驼峰 */
  snakeToCamel(text: string): string {
    return text.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  },

  /** 生成随机字符串 */
  random(length = 8): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  /** 手机号脱敏：138****1234 */
  maskPhone(phone: string): string {
    if (!phone || phone.length !== 11) return phone;
    return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
  },

  /** 邮箱脱敏：tes***@example.com */
  maskEmail(email: string): string {
    if (!email || !email.includes("@")) return email;
    const [name, domain] = email.split("@");
    const masked = name.length <= 3 ? name.slice(0, 1) + "***" : name.slice(0, 2) + "***";
    return `${masked}@${domain}`;
  },

  /** 去除 HTML 标签 */
  stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "");
  },
};

// ==================== 数字工具 ====================

export const num = {
  /** 数字格式化：1234567 -> 1,234,567 */
  format(value: number, digits = 0): string {
    return value.toLocaleString("zh-CN", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  },

  /** 文件大小格式化：1024 -> 1 KB */
  formatSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB", "TB", "PB"];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`;
  },

  /** 数字缩略：12345 -> 1.2万 */
  abbreviate(value: number): string {
    if (value < 10000) return String(value);
    const wan = value / 10000;
    if (wan < 10000) return `${wan.toFixed(1)}万`;
    return `${(wan / 10000).toFixed(1)}亿`;
  },

  /** 范围随机整数 */
  randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /** 保留指定位数小数 */
  round(value: number, decimals = 2): number {
    const factor = 10 ** decimals;
    return Math.round(value * factor) / factor;
  },

  /** 金额分转元 */
  fenToYuan(fen: number): string {
    return (fen / 100).toFixed(2);
  },

  /** 金额元转分 */
  yuanToFen(yuan: number): number {
    return Math.round(yuan * 100);
  },
};

// ==================== 对象工具 ====================

export const obj = {
  /** 深拷贝（使用 structuredClone，不支持时回退到 JSON 序列化） */
  clone<T>(value: T): T {
    if (typeof structuredClone !== "undefined") {
      return structuredClone(value);
    }
    return JSON.parse(JSON.stringify(value));
  },

  /** 安全获取嵌套属性：get(obj, 'a.b.c', default) */
  get<T = unknown>(source: unknown, path: string, defaultValue?: T): T | undefined {
    const keys = path.split(".");
    let result = source as Record<string, unknown> | undefined;
    for (const key of keys) {
      if (result === null || result === undefined) return defaultValue;
      result = result[key] as Record<string, unknown> | undefined;
    }
    return (result === undefined ? defaultValue : result) as T | undefined;
  },

  /** 剔除指定键 */
  omit<T extends Record<string, unknown>, K extends keyof T>(source: T, keys: K[]): Omit<T, K> {
    const result = { ...source };
    for (const key of keys) {
      delete result[key];
    }
    return result;
  },

  /** 选取指定键 */
  pick<T extends Record<string, unknown>, K extends keyof T>(source: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    for (const key of keys) {
      if (key in source) {
        result[key] = source[key];
      }
    }
    return result;
  },
};

// ==================== 树结构工具 ====================

export interface TreeEntity {
  id: number | string;
  parentId: number | string | null;
  children?: TreeEntity[];
  [key: string]: unknown;
}

export const tree = {
  /** 列表转树形结构 */
  toTree<T extends TreeEntity>(items: T[], parentId: number | string | null = null): T[] {
    const result: T[] = [];
    for (const item of items) {
      if (item.parentId === parentId) {
        const children = this.toTree(items, item.id);
        if (children.length) {
          (item as Record<string, unknown>).children = children;
        }
        result.push(item);
      }
    }
    return result;
  },

  /** 树形结构转列表（扁平化） */
  toList<T extends TreeEntity>(treeNodes: T[]): T[] {
    const result: T[] = [];
    const stack = [...treeNodes];
    while (stack.length) {
      const node = stack.shift()!;
      const { children, ...rest } = node as T & { children?: T[] };
      result.push(rest as T);
      if (children?.length) {
        stack.unshift(...children);
      }
    }
    return result;
  },

  /** 查找节点 */
  findNode<T extends TreeEntity>(treeNodes: T[], predicate: (node: T) => boolean): T | null {
    for (const node of treeNodes) {
      if (predicate(node)) return node;
      if (node.children?.length) {
        const found = this.findNode(node.children as T[], predicate);
        if (found) return found;
      }
    }
    return null;
  },

  /** 过滤树节点（保留匹配项及其父节点） */
  filterTree<T extends TreeEntity>(treeNodes: T[], predicate: (node: T) => boolean): T[] {
    const result: T[] = [];
    for (const node of treeNodes) {
      const cloned = { ...node };
      if (predicate(node)) {
        result.push(cloned);
      } else if (node.children?.length) {
        const filteredChildren = this.filterTree(node.children as T[], predicate);
        if (filteredChildren.length) {
          (cloned as Record<string, unknown>).children = filteredChildren;
          result.push(cloned);
        }
      }
    }
    return result;
  },

  /** 获取所有叶子节点 */
  getLeaves<T extends TreeEntity>(treeNodes: T[]): T[] {
    const leaves: T[] = [];
    for (const node of treeNodes) {
      if (!node.children?.length) {
        leaves.push(node);
      } else {
        leaves.push(...this.getLeaves(node.children as T[]));
      }
    }
    return leaves;
  },

  /** 获取节点路径（从根到目标） */
  getPath<T extends TreeEntity>(
    treeNodes: T[],
    targetId: number | string,
    path: T[] = [],
  ): T[] | null {
    for (const node of treeNodes) {
      const newPath = [...path, node];
      if (node.id === targetId) return newPath;
      if (node.children?.length) {
        const found = this.getPath(node.children as T[], targetId, newPath);
        if (found) return found;
      }
    }
    return null;
  },
};

// ==================== 时间工具 ====================

export const time = {
  /** 格式化时间差为人类可读形式 */
  timeAgo(date: string | Date): string {
    const now = Date.now();
    const past = new Date(date).getTime();
    const diff = now - past;

    const units: Array<[number, string]> = [
      [1000, "秒"],
      [60_000, "分钟"],
      [3_600_000, "小时"],
      [86_400_000, "天"],
      [2_592_000_000, "月"],
      [31_536_000_000, "年"],
    ];

    for (const [ms, label] of units) {
      const value = Math.floor(diff / ms);
      if (value < 1) continue;
      if (label === "秒") return "刚刚";
      if (value < 60 || label === "年") return `${value}${label}前`;
    }
    return "刚刚";
  },

  /** 倒计时：返回 { days, hours, minutes, seconds } */
  countdown(target: string | Date): {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
  } {
    const total = new Date(target).getTime() - Date.now();
    if (total <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }
    return {
      days: Math.floor(total / 86_400_000),
      hours: Math.floor((total % 86_400_000) / 3_600_000),
      minutes: Math.floor((total % 3_600_000) / 60_000),
      seconds: Math.floor((total % 60_000) / 1000),
      total,
    };
  },

  /** 获取当日起止时间戳 */
  todayRange(): [number, number] {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return [start.getTime(), end.getTime()];
  },
};

// ==================== 浏览器工具 ====================

export const browser = {
  /** 复制到剪贴板 */
  async copy(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // 降级方案
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    }
  },

  /** 获取 URL 查询参数 */
  getQueryParam(key: string): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  },

  /** 设置 URL 查询参数（不刷新页面） */
  setQueryParam(key: string, value: string): void {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.replaceState({}, "", url.toString());
  },

  /** 删除 URL 查询参数 */
  removeQueryParam(key: string): void {
    const url = new URL(window.location.href);
    url.searchParams.delete(key);
    window.history.replaceState({}, "", url.toString());
  },

  /** 滚动到顶部 */
  scrollToTop(behavior: ScrollBehavior = "smooth"): void {
    window.scrollTo({ top: 0, behavior });
  },

  /** 判断是否移动端 */
  isMobile(): boolean {
    return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  },

  /** 判断是否 iOS */
  isIOS(): boolean {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  },

  /** 判断是否微信浏览器 */
  isWeChat(): boolean {
    return /MicroMessenger/i.test(navigator.userAgent);
  },

  /** 下载 Blob 数据 */
  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
