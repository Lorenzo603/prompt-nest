/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
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
