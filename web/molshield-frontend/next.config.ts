import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['three'],
  typedRoutes: false,
  turbopack: {
    // Pin the root to the frontend directory to prevent Turbopack from
    // watching the entire monorepo (including the Python backend).
    root: '.',
  },
};

export default nextConfig;
