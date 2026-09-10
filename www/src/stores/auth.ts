import { getUserInfo as getUserInfoApi, login as loginApi } from "@/api/auth";
import { TOKEN_KEY, USER_KEY } from "@/lib/constants";
import type { LoginRequest, User } from "@/types";
import { create } from "zustand";

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
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
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
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      set({ user });
    } catch {
      get().logout();
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    set({ user: null, token: null, isAuthenticated: false });
  },

  initialize: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
  },

  updateUser: (userData: Partial<User>) => {
    const { user } = get();
    if (user) {
      const updated = { ...user, ...userData };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      set({ user: updated });
    }
  },
}));
