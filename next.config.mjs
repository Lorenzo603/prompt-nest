/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/dam/:path*',
        destination: '/api/static/dam/:path*',
      },
    ];
  },
};

export default nextConfig;
