import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['three'],
  typedRoutes: false,
  turbopack: {
    // Pin the root to the frontend directory to prevent Turbopack from
    // watching the entire monorepo (including the Python backend).
    root: '.',
  },
  // Required for Docker multi-stage builds: produces a self-contained
  // server.js in .next/standalone that can run without node_modules.
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
};

export default nextConfig;
