import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Paid product files are read from ./private at runtime (never web-served);
  // make sure they ship with the serverless functions that deliver them.
  outputFileTracingIncludes: {
    "/api/**/*": ["./private/**/*"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "unpkg.com", pathname: "/**" },
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/**" },
      { protocol: "https", hostname: "img.youtube.com", pathname: "/**" },
      { protocol: "https", hostname: "yt3.ggpht.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "litter.catbox.moe", pathname: "/**" },
      { protocol: "https", hostname: "files.catbox.moe", pathname: "/**" },
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
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        ],
      },
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
            // Structural directives only (no script-src): blocks clickjacking, <base> hijacking,
            // plugin content and cross-site form posts without risking Paystack/Pixel/YouTube.
            key: "Content-Security-Policy",
            value:
              "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self'; upgrade-insecure-requests",
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
    // Retired features (Oct 2026): send old links and search results somewhere useful.
    const retired: [string, string][] = [
      ["/bills", "/tools"],
      ["/wallet", "/tools"],
      ["/auth/:path*", "/account"],
      ["/store", "/products"],
      ["/store/:path*", "/products"],
      ["/real-estate", "/"],
      ["/real-estate/:path*", "/"],
      ["/apps", "/pro"],
      ["/apps/:path*", "/pro"],
      ["/ai", "/tools"],
      ["/ai/:path*", "/tools"],
      ["/solve", "/tools"],
      ["/pricing-quiz", "/pricing"],
    ];
    return [
      ...retired.map(([source, destination]) => ({ source, destination, permanent: true })),
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
