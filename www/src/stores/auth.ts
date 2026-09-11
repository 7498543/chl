import { getUserInfo as getUserInfoApi, login as loginApi } from "@/api/auth";
import { TOKEN_KEY, USER_KEY } from "@/lib/constants";
import type { LoginRequest, User } from "@/types";
import { create } from "zustand";

/** 客户端安全读写 localStorage */
const ssrSafe = {
  getItem(key: string): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  },
  setItem(key: string, value: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
  },
  removeItem(key: string) {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },
};

/** 写 cookie（供 middleware 鉴权使用） */
function setTokenCookie(token: string) {
  if (typeof window === "undefined") return;
  // 30 天过期
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `token=${token}; path=/; expires=${expires}; SameSite=Lax`;
}

function removeTokenCookie() {
  if (typeof window === "undefined") return;
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  fetchUserInfo: () => Promise<void>;
  logout: () => void;
  initialize: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (data: LoginRequest) => {
    set({ isLoading: true });
    try {
      const res = await loginApi(data);
      const { token, user } = res.data;
      ssrSafe.setItem(TOKEN_KEY, token);
      ssrSafe.setItem(USER_KEY, JSON.stringify(user));
      setTokenCookie(token);
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch {
      set({ isLoading: false });
      throw new Error("登录失败");
    }
  },

  fetchUserInfo: async () => {
    try {
      const res = await getUserInfoApi();
      const user = res.data;
      ssrSafe.setItem(USER_KEY, JSON.stringify(user));
      set({ user });
    } catch {
      get().logout();
    }
  },

  logout: () => {
    ssrSafe.removeItem(TOKEN_KEY);
    ssrSafe.removeItem(USER_KEY);
    removeTokenCookie();
    set({ user: null, token: null, isAuthenticated: false });
  },

  initialize: () => {
    const token = ssrSafe.getItem(TOKEN_KEY);
    const userStr = ssrSafe.getItem(USER_KEY);
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ user, token, isAuthenticated: true });
      } catch {
        ssrSafe.removeItem(TOKEN_KEY);
        ssrSafe.removeItem(USER_KEY);
      }
    }
  },

  updateUser: (userData: Partial<User>) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...userData };
    ssrSafe.setItem(USER_KEY, JSON.stringify(updated));
    set({ user: updated });
  },
}));
