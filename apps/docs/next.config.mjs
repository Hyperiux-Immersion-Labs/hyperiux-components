import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Point turbopack.root to the workspace root so packages (like `next`) resolve correctly
  turbopack: { root: path.resolve(__dirname, '..', '..') },
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
