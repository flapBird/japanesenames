import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/ai-japanese-name-generator",
        destination: "/",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/contact",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate, no-transform",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
