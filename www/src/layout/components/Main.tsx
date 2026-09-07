import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <main className="flex-1">
      <Outlet />
    </main>
  );
}
