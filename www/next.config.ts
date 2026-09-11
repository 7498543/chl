import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 远程图片域名白名单按需添加
    remotePatterns: [
      // { protocol: "https", hostname: "*.amazonaws.com" },
      // { protocol: "https", hostname: "images.unsplash.com" },
    ],
    // 启用图片优化
    formats: ["image/avif", "image/webp"],
  },

  // 将 /api/* 请求代理到后端服务
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_PROXY || "http://localhost:3000"}/api/:path*`,
      },
    ];
  },

  turbopack: {
    root: process.cwd(),
  },

  serverExternalPackages: [],
};

export default nextConfig;
