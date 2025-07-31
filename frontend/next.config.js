/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  
  // Для работы с Bitrix API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*'
      }
    ]
  },
  
  // Оптимизация изображений
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  
  // Для работы со styled-components
  compiler: {
    styledComponents: true
  }
}

module.exports = nextConfig