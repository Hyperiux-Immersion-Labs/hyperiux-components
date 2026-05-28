import path from 'path'
import { fileURLToPath } from 'url'
import { withSentryConfig } from "@sentry/nextjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.join(__dirname, "..", "..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // In a monorepo, Next.js/Turbopack auto-detects the "root" using the workspace
  // lockfile (repo root). That can dramatically expand filesystem watching and
  // memory usage during `next dev`.
  //
  // With pnpm, workspace dependencies are symlinked into this app from
  // `<repo>/node_modules/.pnpm/...`, so `turbopack.root` must include both:
  // - this app folder, and
  // - the real path where `next` resolves to.
  turbopack: {
    root: REPO_ROOT,
  },
  experimental: {
    // Reduce initial RSS by not preloading every route/module at server start.
    preloadEntriesOnStart: false,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/effects',
        permanent: false,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only upload source maps in CI/production to avoid slowing local builds
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,

  // Disable source map upload if DSN isn't set (local dev)
  sourcemaps: {
    disable: !process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
});
