"use client";

import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">500</h1>
        <p className="mt-4 text-2xl text-text">服务器错误</p>
        <p className="mt-2 text-text">抱歉，服务器暂时无法处理您的请求，请稍后重试。</p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
          >
            重试
          </button>
          <Link
            href="/"
            className="rounded-lg bg-accent px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
