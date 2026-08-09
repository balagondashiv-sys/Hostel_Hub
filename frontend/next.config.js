/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'res.cloudinary.com', 'api.dicebear.com'],
  },
  async rewrites() {
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    apiUrl = apiUrl.replace(/\/+$/, '');
    if (!apiUrl.endsWith('/api')) {
      apiUrl = `${apiUrl}/api`;
    }

    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
