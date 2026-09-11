import Link from "next/link";

export default function Forbidden() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-accent">403</h1>
        <p className="mt-4 text-2xl text-text">权限不足</p>
        <p className="mt-2 text-text">抱歉，您没有权限访问此页面。</p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
