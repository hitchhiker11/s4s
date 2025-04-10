/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  // Добавляем опцию для отключения проверки версии Node.js
  experimental: {
    skipNodeCompatibilityCheck: true,
  },
  // Отключаем телеметрию
  telemetry: { 
    disabled: true 
  },
};

module.exports = nextConfig; 