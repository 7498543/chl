"use client";

import AdminHeader from "@/components/layout/admin/Header";
import Sidebar from "@/components/layout/admin/Sidebar";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app";
import { useAuthStore } from "@/stores/auth";
import { useEffect } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { sidebar } = useAppStore();
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <Sidebar />
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          sidebar.collapsed ? "ml-16" : "ml-64",
        )}
      >
        <AdminHeader />
        <main className="min-h-[calc(100vh-4rem)] bg-bg/50 p-4">{children}</main>
      </div>
    </div>
  );
}
