import { Link } from "react-router-dom";

export default function ServerError() {
  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">500</h1>
        <p className="mt-4 text-2xl text-primary">服务器错误</p>
        <p className="mt-2 text-primary">抱歉，服务器暂时无法处理您的请求，请稍后重试。</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
