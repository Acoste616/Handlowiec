/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  experimental: {
    // appDir is now stable in Next.js 14
  },
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID,
    HUBSPOT_ACCESS_TOKEN: process.env.HUBSPOT_ACCESS_TOKEN,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
    LINKEDIN_PIXEL_ID: process.env.LINKEDIN_PIXEL_ID,
    GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID,
    HOTJAR_ID: process.env.HOTJAR_ID,
  },
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  redirects: async () => {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  trailingSlash: false,
};

const sentryWebpackPluginOptions = {
  silent: true,
  org: 'bezhandlowca',
  project: 'bezhandlowca-mvp',
};

module.exports = nextConfig; 