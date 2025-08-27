// next.config.js
const { withSentryConfig } = require('@sentry/nextjs');
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: { instrumentationHook: true },
  // Konfigurasi Webpack yang sudah ada
  webpack: (config, { isServer }) => {
    // Konfigurasi ini hanya berlaku untuk build sisi server,
    // untuk memberitahu Webpack agar tidak mencoba membundel modul native Node.js
    if (isServer) {
      config.externals.push('bufferutil', 'utf-8-validate');
    }
    return config;
  },

  images: {
    remotePatterns: [
      { protocol:'https', hostname:'yqybhgqeejpdgffxzsno.supabase.co', pathname:'/storage/v1/object/public/**' },
    ],
    formats: ['image/avif','image/webp'],
  },
};

const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
};

// Combine PWA and Sentry configurations
module.exports = withSentryConfig(withPWA(nextConfig), sentryWebpackPluginOptions);
