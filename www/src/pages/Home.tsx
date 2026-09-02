import Seo from "@/components/ui/Seo";
import { SITE_DESCRIPTION } from "@/lib/constants";

export default function Home() {
  return (
    <>
      <Seo description={SITE_DESCRIPTION} />
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight">欢迎来到 CHL</h1>
        <p className="mt-4 text-gray-500">内容管理系统</p>
      </div>
    </>
  );
}
