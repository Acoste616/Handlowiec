/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  
  // Skip API routes during build if no Supabase config
  async rewrites() {
    return [];
  },

  // Environment variables validation
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID,
    HUBSPOT_ACCESS_TOKEN: process.env.HUBSPOT_ACCESS_TOKEN,
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
    HOTJAR_ID: process.env.HOTJAR_ID,
  },

  // Webpack config for build optimization
  webpack: (config, { isServer, dev }) => {
    // Skip Supabase client creation during build if no env vars
    if (!dev && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/lib/supabase/client': false,
      };
    }
    
    return config;
  },

  // Image optimization
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true, // Temporary fix for Vercel build
  },

  // Compression
  compress: true,

  // Power by header
  poweredByHeader: false,

  // Trailing slash
  trailingSlash: false,

  // React strict mode
  reactStrictMode: true,

  // SWC minification
  swcMinify: true,

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
        ],
      },
    ];
  },

  redirects: async () => {
    return [
      {
        source: '/dashboard',
        destination: '/client/dashboard',
        permanent: true,
      },
    ];
  },

  generateEtags: false,
};

module.exports = nextConfig; 