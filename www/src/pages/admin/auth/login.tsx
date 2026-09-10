// 从 API 层引入表单校验 schema（与后端 DTO 定义保持一致）
import { loginScheme } from "@/api/auth";
// 引入全局认证状态 store，管理用户登录态
import { useAuthStore } from "@/stores/auth";
// UI 组件库
import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
// 路由钩子：useLocation 用于获取拦截前的来源地址，useNavigate 用于登录成功后跳转
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  // 从 zustand store 中解构出 login 方法，登录成功后会自动写入 localStorage 和更新状态
  const login = useAuthStore((state) => state.login);

  // 表单数据 state
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  // 按钮 loading 状态，防止重复提交
  const [loading, setLoading] = useState(false);
  // 错误提示文案
  const [error, setError] = useState("");

  // 受控输入框 onChange：更新对应字段值，同时清除上次错误提示
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  }

  // 表单提交处理
  async function handleLogin(e: React.FormEvent) {
    // 阻止默认表单刷新行为
    e.preventDefault();

    // 使用 zod 做前端表单校验（与后端 LoginDto 规则一致）
    const parsed = loginScheme.safeParse(loginForm);
    if (!parsed.success) {
      // 取第一个校验错误展示，避免一次弹多条
      const firstError = parsed.error.issues[0];
      setError(firstError?.message || "请输入用户名和密码");
      return;
    }

    setLoading(true);
    try {
      // 调用 store.login() → 内部会请求 /api/auth/login 并持久化 token + user 到 localStorage
      await login(parsed.data);
      // 登录成功后，优先跳转到被 AuthGuard 拦截前的原始地址（location.state.from），
      // 如果没有则回到后台首页
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname;
      navigate(from || "/admin/dashboard", { replace: true });
    } catch (err) {
      // 错误信息优先使用后端返回的 message（API 拦截器会透传），兜底用默认文案
      setError(err instanceof Error ? err.message : "登录失败，请检查用户名或密码");
    } finally {
      // 无论成功失败都关闭 loading
      setLoading(false);
    }
  }

  return (
    // 撑起来屏幕
    <div className="flex min-h-screen items-center justify-center bg-gray-500">
      {/* 页面展示 网格划分12块 */}
      <div className=" grid grid-cols-12">
        {/* div 占位 用来实现大面积空白 */}
        <div className="col-start-2 col-span-6"> </div>
        {/* 表单容器 */}
        <Box className=" bg-white p-10 col-span-4">
          {/* 提交表单 */}
          <form onSubmit={handleLogin} noValidate>
            {/* 表单标题 */}
            <Typography variant="h5" sx={{ mb: 2, textAlign: "center" }}>
              登录
            </Typography>
            {/* 用户账号输入 */}
            <TextField
              label="用户名"
              name="username"
              value={loginForm.username}
              onChange={handleChange}
              fullWidth
              margin="normal"
              autoComplete="username"
            />
            {/* 用户密码输入 */}
            <TextField
              label="密码"
              name="password"
              type="password"
              value={loginForm.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              autoComplete="current-password"
            />
            {/* 错误提示 */}
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            {/* 提交表单 */}
            <Button type="submit" variant="contained" fullWidth disabled={loading} sx={{ mt: 3 }}>
              {loading ? "登录中…" : "登录"}
            </Button>
          </form>
        </Box>
      </div>
    </div>
  );
}
