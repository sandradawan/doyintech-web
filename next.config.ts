import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "unpkg.com", pathname: "/**" },
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/**" },
      { protocol: "https", hostname: "img.youtube.com", pathname: "/**" },
      { protocol: "https", hostname: "yt3.ggpht.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      {
        protocol: "https",
        hostname: "www.imperialvillapropertydevelopment.com",
        pathname: "/**",
      },
      { protocol: "https", hostname: "legacyplay.vercel.app", pathname: "/**" },
      { protocol: "https", hostname: "jennyglams.vercel.app", pathname: "/**" },
      { protocol: "https", hostname: "doyinsoft.vercel.app", pathname: "/**" },
      { protocol: "https", hostname: "doyintech.vercel.app", pathname: "/**" },
      { protocol: "https", hostname: "www.doyintech.com", pathname: "/**" },
      { protocol: "https", hostname: "doyintech.com", pathname: "/**" },
      { protocol: "https", hostname: "image.thum.io", pathname: "/**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Content-Security-Policy",
            value: "upgrade-insecure-requests",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-site",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "doyintech.com" }],
        destination: "https://www.doyintech.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
