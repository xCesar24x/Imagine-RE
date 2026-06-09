import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd && !isVercel ? "/Imagine-RE" : "",
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd && !isVercel ? "/Imagine-RE" : "",
  },
};

export default nextConfig;

