import { Link } from "react-router-dom";
import Seo from "@/components/ui/Seo";

export default function NotFound() {
  return (
    <>
      <Seo title="页面不存在" />
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <h1 className="text-6xl font-bold text-gray-200">404</h1>
        <p className="mt-4 text-gray-500">页面不存在</p>
        <Link
          to="/"
          className="mt-6 rounded-lg bg-gray-900 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-700"
        >
          返回首页
        </Link>
      </div>
    </>
  );
}
