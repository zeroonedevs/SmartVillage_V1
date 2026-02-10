/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
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
      }
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: false,
  },
  // Webpack config to handle uppercase image extensions
  webpack: (config) => {
    // Handle uppercase image extensions (.JPG, .JPEG, .PNG, etc.)
    // This ensures case-insensitive matching for image files
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test && rule.test.toString().includes('jpg|jpeg')
    );
    
    if (fileLoaderRule) {
      // Update existing rule to be case-insensitive
      fileLoaderRule.test = /\.(jpg|jpeg|png|gif|webp|avif|svg|JPG|JPEG|PNG|GIF|WEBP|AVIF|SVG)$/i;
    } else {
      // Add rule if it doesn't exist
      config.module.rules.push({
        test: /\.(jpg|jpeg|png|gif|webp|avif|svg|JPG|JPEG|PNG|GIF|WEBP|AVIF|SVG)$/i,
        type: 'asset/resource',
      });
    }
    
    return config;
  },
}

module.exports = nextConfig
