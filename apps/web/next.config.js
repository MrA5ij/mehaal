/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/admin/:path*',
          destination: '/api/auth/verify?role=ADMIN&next=/admin/:path*',
        },
        {
          source: '/franchise/:path*',
          destination: '/api/auth/verify?role=FRANCHISE&next=/franchise/:path*',
        },
      ],
    };
  },
};

module.exports = nextConfig;
