/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental.appDir 설정이 더 이상 필요하지 않음 (stable)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

module.exports = nextConfig 