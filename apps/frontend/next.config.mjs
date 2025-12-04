/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow dev access from subdomain hosts used in the multi-tenant setup
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://brandini.test',
    'http://dashboard.brandini.test',
    'http://shoppy.brandini.test',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'api.brandini.tn',
        pathname: '/uploads/**',
      },
    ],
  },
  transpilePackages: ['@busi/types'],
};

export default nextConfig;
