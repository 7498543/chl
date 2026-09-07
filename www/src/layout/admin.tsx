import AdminHeader from "./admin/Header";
import AdminMain from "./admin/Main";
import Sidebar from "./admin/Sidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <AdminMain />
      </div>
    </div>
  );
}
