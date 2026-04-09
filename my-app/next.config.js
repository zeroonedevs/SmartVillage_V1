/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/**',
      },
      {
        protocol: 'https',
        hostname: 'i.imghippo.com',
        port: '',
        pathname: '/files/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: false,
    // Faster resolves for large icon/chart packages (fewer modules per import graph)
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  // Dev uses Turbopack by default (see package.json). Production build uses --turbopack.
  // Static assets use lowercase extensions (e.g. img_8078.jpg) so no Webpack-only rules are required.
};

module.exports = nextConfig;
