import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
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
