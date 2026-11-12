import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16 options that came with create-next-app. Keep them.
  cacheComponents: true,
  partialPrefetching: true,
  // Serve photos as AVIF first, then WebP, then the original format.
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
