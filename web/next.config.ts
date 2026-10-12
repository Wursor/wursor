import type { NextConfig } from 'next';

const apiOrigin = process.env.WURSOR_API_URL ?? 'http://localhost:3000';

const config: NextConfig = {
  reactStrictMode: true,
  // Interim: the Sprint 1 shell at /app still calls the API on the same origin.
  // Replaced by server-held sessions (ADR 0018, step C).
  async rewrites() {
    return ['/auth/:path*', '/chat/:path*', '/chat', '/sites/:path*', '/sites', '/health'].map(
      (source) => ({ source, destination: `${apiOrigin}${source}` }),
    );
  },
};

export default config;
