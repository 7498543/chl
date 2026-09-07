import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app";
import { Outlet } from "react-router-dom";

export default function AdminMain() {
  const { sidebar } = useAppStore();

  return (
    <main
      className={cn(
        "min-h-[calc(100vh-4rem)] bg-bg/50 pt-4 px-4 transition-all duration-300",
        sidebar.collapsed ? "ml-16" : "ml-64",
      )}
    >
      <Outlet />
    </main>
  );
}
