/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@skyra/shared'],
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
