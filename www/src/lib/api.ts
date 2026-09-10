import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type CreateAxiosDefaults,
  type InternalAxiosRequestConfig,
} from "axios";
import { API_BASE_URL, TOKEN_KEY } from "./constants";

/** 自定义请求配置 */
interface HttpOptions extends CreateAxiosDefaults {
  encrypt?: boolean;
  /** 是否显示错误提示（默认 true） */
  showError?: boolean;
}

/** 统一响应结构 */
interface HttpResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
}

/** 请求取消管理器 */
class CancelManager {
  private pendingMap = new Map<string, AbortController>();

  private generateKey(config: AxiosRequestConfig): string {
    const { method, url, params, data } = config;
    return `${method}:${url}:${JSON.stringify(params)}:${JSON.stringify(data)}`;
  }

  /** 添加请求 */
  add(config: AxiosRequestConfig): AbortController {
    this.remove(config);
    const controller = new AbortController();
    const key = this.generateKey(config);
    this.pendingMap.set(key, controller);
    return controller;
  }

  /** 移除请求 */
  remove(config: AxiosRequestConfig): void {
    const key = this.generateKey(config);
    this.pendingMap.delete(key);
  }

  /** 取消指定请求 */
  cancel(key: string): void {
    const controller = this.pendingMap.get(key);
    controller?.abort();
    this.pendingMap.delete(key);
  }

  /** 取消全部请求 */
  cancelAll(): void {
    this.pendingMap.forEach((controller) => controller.abort());
    this.pendingMap.clear();
  }
}

export class HttpClient {
  private instance: AxiosInstance;
  private cancelManager = new CancelManager();
  private options: HttpOptions;

  constructor(options?: HttpOptions) {
    this.options = {
      baseURL: API_BASE_URL,
      timeout: 30_000,
      showError: true,
      ...options,
    };

    this.instance = axios.create(this.options);
    this.setupInterceptors();
  }

  // ==================== 拦截器 ====================

  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // 添加 token
        const token = localStorage.getItem(TOKEN_KEY);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 添加取消控制器
        const controller = this.cancelManager.add(config);
        config.signal = controller.signal;

        return config;
      },
      (error) => Promise.reject(error),
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<HttpResponse>) => {
        this.cancelManager.remove(response.config);
        const res = response.data;

        // 业务状态码处理
        if (res.code !== 0 && res.code !== 200) {
          this.handleBusinessError(res);
          return Promise.reject(new Error(res.message || "请求失败"));
        }

        return response;
      },
      async (error) => {
        if (axios.isCancel(error)) {
          console.log("请求已取消:", error.message);
          return Promise.reject(error);
        }

        // 清除 pending 记录
        if (error.config) {
          this.cancelManager.remove(error.config);
        }

        // 处理 HTTP 错误
        if (error.response) {
          const { status } = error.response;
          switch (status) {
            case 401:
              // token 过期，尝试刷新
              try {
                await this.refreshToken();
                // 重新发起原请求
                const config = error.config;
                config.headers.Authorization = `Bearer ${localStorage.getItem(TOKEN_KEY)}`;
                return this.instance.request(config);
              } catch {
                this.handleUnauthorized();
              }
              break;
            case 403:
              window.location.href = "/403";
              break;
            case 404:
              window.location.href = "/404";
              break;
            case 500:
              window.location.href = "/500";
              break;
            default:
              break;
          }
        }

        if (this.options.showError) {
          this.showErrorMessage(error);
        }

        return Promise.reject(error);
      },
    );
  }

  // ==================== 业务错误处理 ====================

  private handleBusinessError(res: HttpResponse): void {
    const messages: Record<number, string> = {
      400: "请求参数错误",
      401: "未授权，请重新登录",
      403: "无权限访问",
      404: "请求的资源不存在",
      500: "服务器内部错误",
    };

    const message = messages[res.code] || res.message || "未知错误";
    if (this.options.showError) {
      console.error(`[API Error] ${message}`);
    }
  }

  private handleUnauthorized(): void {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/admin/auth/login";
  }

  private showErrorMessage(error: unknown): void {
    if (error instanceof Error) {
      console.error("[API Error]", error.message);
    }
  }

  // ==================== Token 刷新 ====================

  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  private async refreshToken(): Promise<void> {
    if (this.isRefreshing) {
      // 等待刷新完成
      return new Promise((resolve) => {
        this.refreshSubscribers.push((token: string) => {
          resolve(token);
        });
      });
    }

    this.isRefreshing = true;
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      const res = await axios.post<HttpResponse<{ token: string }>>(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken },
      );
      const newToken = res.data.data.token;
      localStorage.setItem(TOKEN_KEY, newToken);
      this.isRefreshing = false;
      this.refreshSubscribers.forEach((cb) => cb(newToken));
      this.refreshSubscribers = [];
    } catch {
      this.isRefreshing = false;
      this.refreshSubscribers = [];
      throw new Error("刷新 Token 失败");
    }
  }

  // ==================== 加密/解密 ====================

  /** 加密（可扩展为实际加密逻辑） */
  encrypt(data: string): string {
    // 可集成 crypto-js 等库
    return btoa(encodeURIComponent(data));
  }

  /** 解密 */
  decrypt(data: string): string {
    return decodeURIComponent(atob(data));
  }

  // ==================== HTTP 方法 ====================

  /** GET 请求 */
  async get<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.instance.get<HttpResponse<T>>(url, {
      params,
      ...config,
    });
    return response.data;
  }

  /** POST 请求 */
  async post<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.instance.post<HttpResponse<T>>(url, data, config);
    return response.data;
  }

  /** PUT 请求 */
  async put<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.instance.put<HttpResponse<T>>(url, data, config);
    return response.data;
  }

  /** DELETE 请求 */
  async delete<T = unknown>(
    url: string,
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.instance.delete<HttpResponse<T>>(url, {
      params,
      ...config,
    });
    return response.data;
  }

  /** PATCH 请求 */
  async patch<T = unknown>(
    url: string,
    data?: Record<string, unknown>,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponse<T>> {
    const response = await this.instance.patch<HttpResponse<T>>(url, data, config);
    return response.data;
  }

  /** 上传文件 */
  async upload<T = unknown>(
    url: string,
    file: File | Blob,
    name = "file",
    data?: Record<string, unknown>,
  ): Promise<HttpResponse<T>> {
    const formData = new FormData();
    formData.append(name, file);
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }
    const response = await this.instance.post<HttpResponse<T>>(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  /** 下载文件 */
  async download(url: string, filename?: string): Promise<void> {
    const response = await this.instance.get(url, {
      responseType: "blob",
    });
    const blob = new Blob([response.data]);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename || url.split("/").pop() || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  // ==================== 请求取消 ====================

  /** 取消特定请求 */
  cancel(key: string): void {
    this.cancelManager.cancel(key);
  }

  /** 取消全部请求 */
  cancelAll(): void {
    this.cancelManager.cancelAll();
  }
}

// ==================== 预置实例 ====================

/** 默认 API 实例 */
export const http = new HttpClient({
  baseURL: "/api",
});

/** 文件上传实例（长超时） */
export const uploadHttp = new HttpClient({
  baseURL: API_BASE_URL,
  timeout: 120_000,
});

/** 外部 API 实例（无 token 注入） */
export const aliyunHttp = new HttpClient({
  baseURL: "https://api.chl.site",
});

export default http;
