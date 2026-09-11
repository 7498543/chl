"use client";

import { loginScheme } from "@/api/auth";
import { useAuthStore } from "@/stores/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const parsed = loginScheme.safeParse(loginForm);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      setError(firstError?.message || "请输入用户名和密码");
      return;
    }

    setLoading(true);
    try {
      await login(parsed.data);
      const from = searchParams.get("from") || "/admin";
      router.replace(from);
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败，请检查用户名或密码");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#6b7280]">
      <div className="w-full max-w-md">
        <form onSubmit={handleLogin} noValidate className="rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">登录</h1>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700">
              用户名
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={loginForm.username}
              onChange={handleChange}
              autoComplete="username"
              autoFocus
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="请输入用户名"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={loginForm.password}
              onChange={handleChange}
              autoComplete="current-password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="请输入密码"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#6b7280] text-white">
          加载中...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
