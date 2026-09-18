import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unpkg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "yt3.ggpht.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.imperialvillapropertydevelopment.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "legacyplay.vercel.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "jennyglams.vercel.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "doyinsoft.vercel.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "doyintech.vercel.app",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
