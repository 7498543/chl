import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-accent">404</h1>
        <p className="mt-4 text-2xl text-text">页面未找到</p>
        <p className="mt-2 text-text">抱歉，您访问的页面不存在或已被移除。</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
