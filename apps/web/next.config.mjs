/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Skyra Platform packages expose TypeScript source directly (src/index.ts).
  // Next.js must transpile them rather than treating them as pre-compiled JS.
  transpilePackages: [
    '@skyra/shared',
    '@skyra/ui',
    '@skyra/dialogs',
    '@skyra/data-table',
    '@skyra/dynamic-form',
    '@skyra/design-tokens',
    '@skyra/utils',
    '@skyra/data-export',
    '@skyra/validation',
  ],
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    return [
      {
        source: '/backend-api/:path*',
        destination: `${apiBaseUrl}/:path*`,
      },
      {
        source: '/health/:path*',
        destination: `${apiBaseUrl}/health/:path*`,
      },
    ];
  },
};

export default nextConfig;
