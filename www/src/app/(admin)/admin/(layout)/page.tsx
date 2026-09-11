"use client";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-h">控制台</h1>
      <p className="mt-1 text-text">欢迎回来</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-bg p-4">
          <h3 className="text-sm font-medium text-text">文章总数</h3>
          <p className="mt-2 text-3xl font-bold text-text-h">-</p>
        </div>
        <div className="rounded-lg border border-border bg-bg p-4">
          <h3 className="text-sm font-medium text-text">分类总数</h3>
          <p className="mt-2 text-3xl font-bold text-text-h">-</p>
        </div>
        <div className="rounded-lg border border-border bg-bg p-4">
          <h3 className="text-sm font-medium text-text">用户总数</h3>
          <p className="mt-2 text-3xl font-bold text-text-h">-</p>
        </div>
      </div>
    </div>
  );
}
