import { logger } from "@/core/logger";
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// ============================================================
// 类型定义
// ============================================================

/** 签名配置 */
export interface SignConfig {
  /** 签名类型 */
  type?: "custom";
  /** 应用 Key */
  appKey?: string;
  /** 应用密钥 */
  appSecret?: string;
  /** 自定义签名函数 */
  signFn?: (params: Record<string, any>, secret: string) => string;
}

/** 请求选项（在 Axios 基础上扩展） */
export interface RequestOptions extends AxiosRequestConfig {
  /** 重试次数（默认 0 不重试） */
  retry?: number;
  /** 重试基础间隔（毫秒，默认 1000，每次翻倍） */
  retryDelay?: number;
  /** 是否启用请求日志（默认 false） */
  enableLog?: boolean;
  /** 签名配置 */
  signConfig?: SignConfig;
  /** 请求来源标识，用于日志追踪 */
  source?: string;
}

/** 统一 API 响应格式 */
export interface ApiResponse<T = any> {
  /** 是否成功 */
  success: boolean;
  /** 响应数据 */
  data?: T;
  /** 提示消息 */
  message?: string;
  /** 业务状态码 */
  code?: number | string;
  /** 原始 Axios 响应（完整信息） */
  raw?: AxiosResponse<T>;
}

/** Token 信息 */
export interface TokenInfo {
  accessToken: string;
  expiresAt: number;
  refreshToken?: string;
  tokenType?: string;
}

/** 请求事件钩子 */
export interface HttpClientHooks {
  onBeforeRequest?: (config: InternalAxiosRequestConfig) => void | Promise<void>;
  onAfterResponse?: (response: AxiosResponse) => void;
  onError?: (error: AxiosError) => void;
}

// ============================================================
// 核心请求类
// ============================================================

export class HttpClient {
  private instance: AxiosInstance;
  private options: RequestOptions;
  private hooks: HttpClientHooks;

  /** Token 管理 */
  private tokenInfo: TokenInfo | null = null;
  private tokenRefreshPromise: Promise<string> | null = null;
  private tokenRefreshHandler: (() => Promise<TokenInfo>) | null = null;

  constructor(options: RequestOptions = {}, hooks: HttpClientHooks = {}) {
    this.options = {
      retry: 0,
      retryDelay: 1000,
      enableLog: false,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    };
    this.hooks = hooks;
    this.instance = axios.create(this.options);
    this.setupInterceptors();
  }

  // ──────────────────────────────────────────────
  // 拦截器设置
  // ──────────────────────────────────────────────

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const customConfig = config as InternalAxiosRequestConfig & RequestOptions;

        // 事件钩子
        await this.hooks.onBeforeRequest?.(config);

        // 日志
        if (customConfig.enableLog ?? this.options.enableLog) {
          const source = customConfig.source ? `[${customConfig.source}]` : "";
          logger.info(`[HTTP${source}] ${config.method?.toUpperCase()} ${config.url}`, {
            params: config.params,
            data: config.data,
            type: "http-request",
          });
        }

        // 签名
        if (customConfig.signConfig) {
          this.applySign(config, customConfig.signConfig);
        }

        return config;
      },
      (error) => {
        this.hooks.onError?.(error);
        return Promise.reject(error);
      },
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        this.hooks.onAfterResponse?.(response);

        const reqConfig = response.config as InternalAxiosRequestConfig & RequestOptions;
        if (reqConfig.enableLog ?? this.options.enableLog) {
          const source = reqConfig.source ? `[${reqConfig.source}]` : "";
          logger.info(`[HTTP${source}] ${response.status} ${response.config.url}`, {
            type: "http-response",
          });
        }
        return response;
      },
      async (error: AxiosError) => {
        this.hooks.onError?.(error);

        const config = error.config as (InternalAxiosRequestConfig & RequestOptions) | undefined;

        if (config) {
          const source = config.source ? `[${config.source}]` : "";
          if (config.enableLog ?? this.options.enableLog) {
            logger.error(`[HTTP${source}] ${error.code} ${config.url}`, {
              message: error.message,
              status: error.response?.status,
              type: "http-error",
            });
          }

          // 自动重试
          if (config.retry && config.retry > 0) {
            return this.retryRequest(config, error);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  // ──────────────────────────────────────────────
  // 重试机制（指数退避）
  // ──────────────────────────────────────────────

  private async retryRequest(
    config: InternalAxiosRequestConfig & RequestOptions,
    error: AxiosError,
    retryCount = 0,
  ): Promise<AxiosResponse> {
    const maxRetries = config.retry || 0;
    if (retryCount >= maxRetries) {
      return Promise.reject(error);
    }

    // 只对可重试的状态码重试
    const status = error.response?.status;
    if (status && status < 500 && status !== 429) {
      return Promise.reject(error);
    }

    // 指数退避：1s, 2s, 4s, 8s ...
    const delay = (config.retryDelay || 1000) * Math.pow(2, retryCount) + Math.random() * 500;
    const source = config.source ? `[${config.source}]` : "";

    logger.warn(`[HTTP${source}] 重试请求 ${config.url} (${retryCount + 1}/${maxRetries})`, {
      delay: Math.round(delay),
      type: "http-retry",
    });

    await new Promise((resolve) => setTimeout(resolve, delay));

    try {
      return await this.instance.request(config);
    } catch (newError) {
      return this.retryRequest(config, newError as AxiosError, retryCount + 1);
    }
  }

  // ──────────────────────────────────────────────
  // 签名算法
  // ──────────────────────────────────────────────

  private applySign(config: InternalAxiosRequestConfig, signConfig: SignConfig) {
    switch (signConfig.type) {
      case "custom": {
        this.signCustom(config, signConfig);
        break;
      }
      default: {
        this.signCustom(config, signConfig);
        break;
      }
    }
  }

  /**
   * 自定义签名
   */
  private signCustom(config: InternalAxiosRequestConfig, signConfig: SignConfig) {
    if (signConfig.signFn) {
      const params = { ...config.params } || {};
      const signature = signConfig.signFn(params, signConfig.appSecret || "");
      config.params = { ...params, signature };
    }
  }

  // ──────────────────────────────────────────────
  // Token 管理
  // ──────────────────────────────────────────────

  /** 设置 Token */
  setToken(token: TokenInfo) {
    this.tokenInfo = token;
  }

  /** 设置 Token 刷新回调（返回新的 TokenInfo） */
  setTokenRefreshHandler(handler: () => Promise<TokenInfo>) {
    this.tokenRefreshHandler = handler;
  }

  /** 获取有效 Token（过期自动刷新） */
  private async getValidToken(): Promise<string | null> {
    if (!this.tokenInfo) return null;

    // Token 仍有效（提前 5 分钟刷新）
    if (this.tokenInfo.expiresAt > Date.now() + 5 * 60 * 1000) {
      return this.tokenInfo.accessToken;
    }

    // 防止并发刷新
    if (!this.tokenRefreshPromise) {
      this.tokenRefreshPromise = this.doRefreshToken();
    }

    return this.tokenRefreshPromise;
  }

  private async doRefreshToken(): Promise<string> {
    try {
      if (!this.tokenRefreshHandler) {
        throw new Error("Token 已过期且未设置 refreshHandler");
      }
      logger.info("[HTTP] Token 刷新中...", { type: "http-token" });
      const newToken = await this.tokenRefreshHandler();
      this.tokenInfo = newToken;
      logger.info("[HTTP] Token 刷新成功", { type: "http-token" });
      return newToken.accessToken;
    } finally {
      this.tokenRefreshPromise = null;
    }
  }

  // ──────────────────────────────────────────────
  // 请求方法
  // ──────────────────────────────────────────────

  /**
   * 通用请求
   * @param config 请求配置（支持重试、签名、日志等扩展选项）
   */
  async request<T = any>(config: RequestOptions): Promise<ApiResponse<T>> {
    try {
      // Token 注入
      if (this.tokenInfo) {
        const token = await this.getValidToken();
        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `${this.tokenInfo.tokenType || "Bearer"} ${token}`,
          };
        }
      }

      const response = await this.instance.request<T>(config);

      return {
        success: true,
        data: response.data,
        code: response.status,
        raw: response,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * GET 请求
   * @example
   * ```ts
   * const { data, success } = await httpClient.get<User[]>('/api/users', { params: { page: 1 } });
   * ```
   */
  async get<T = any>(url: string, config?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "GET", url });
  }

  /**
   * POST 请求
   * @example
   * ```ts
   * const { data } = await httpClient.post<CreateRes>('/api/users', { name: 'foo' });
   * ```
   */
  async post<T = any>(url: string, data?: any, config?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "POST", url, data });
  }

  /**
   * PUT 请求
   */
  async put<T = any>(url: string, data?: any, config?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "PUT", url, data });
  }

  /**
   * PATCH 请求
   */
  async patch<T = any>(url: string, data?: any, config?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "PATCH", url, data });
  }

  /**
   * DELETE 请求
   */
  async delete<T = any>(url: string, config?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "DELETE", url });
  }

  /**
   * 上传文件（multipart/form-data）
   * @example
   * ```ts
   * const { data } = await httpClient.upload('/api/upload', { file: fileBuffer });
   * ```
   */
  async upload<T = any>(
    url: string,
    formData: Record<string, any>,
    config?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    return this.request<T>({
      ...config,
      method: "POST",
      url,
      data,
      headers: {
        "Content-Type": "multipart/form-data",
        ...config?.headers,
      },
    });
  }

  /** 错误统一处理 */
  private handleError(error: any): ApiResponse {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string; code?: string }>;
      return {
        success: false,
        message: axiosError.response?.data?.message || axiosError.message,
        code: axiosError.response?.status || axiosError.code,
        raw: axiosError.response,
      };
    }

    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
        code: -1,
      };
    }

    return {
      success: false,
      message: "未知请求错误",
      code: -1,
    };
  }

  /** 获取原始 Axios 实例（高级用法） */
  getRawInstance(): AxiosInstance {
    return this.instance;
  }
}

/**
 * 创建自定义 HTTP 客户端
 *
 * @example
 * ```ts
 * // 对接 GitHub API
 * const github = createHttpClient({
 *   baseURL: 'https://api.github.com',
 *   timeout: 10000,
 *   source: 'GitHub',
 *   headers: { Accept: 'application/vnd.github.v3+json' },
 * });
 *
 * const res = await github.get('/repos/user/repo');
 * ```
 */
export function createHttpClient(options: RequestOptions, hooks?: HttpClientHooks): HttpClient {
  return new HttpClient(
    {
      timeout: 30000,
      enableLog: true,
      retry: 2,
      ...options,
    },
    hooks,
  );
}

export default HttpClient;
