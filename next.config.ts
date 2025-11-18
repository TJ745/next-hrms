import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    domains: ["localhost", "yourdomain.com"],
    unoptimized: true,
  },
};

export default nextConfig;
