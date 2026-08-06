import type { NextConfig } from "next";

const wellKnownJsonHeaders = [
  { key: "Content-Type", value: "application/json; charset=utf-8" },
  { key: "Content-Disposition", value: "inline" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Cache-Control", value: "public, max-age=300" },
];

const nextConfig: NextConfig = {
  // Static export only for production builds so `next dev` can apply headers
  // (extensionless AASA would otherwise download as octet-stream).
  ...(process.env.NODE_ENV === "production" ? { output: "export" as const } : {}),
  async headers() {
    return [
      {
        source: "/.well-known/apple-app-site-association",
        headers: wellKnownJsonHeaders,
      },
      {
        source: "/.well-known/assetlinks.json",
        headers: wellKnownJsonHeaders,
      },
    ];
  },
};

export default nextConfig;
