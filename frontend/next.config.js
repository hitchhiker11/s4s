/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  env: {
    NEXT_PUBLIC_BITRIX_URL: "https://shop4shoot.com/api",
    NEXT_PUBLIC_CATALOG_IBLOCK_ID: "21",
    NEXT_PUBLIC_BRANDS_IBLOCK_ID: "21",
    NEXT_PUBLIC_SLIDER_IBLOCK_ID: "21"
  },
  experimental: {
    // skipNodeCompatibilityCheck: true,
  },
  // telemetry: false,
  server: {
    host: '0.0.0.0',
    port: 3000,
  }
};

// Скрываем вывод debug info
if (process.env.NODE_ENV !== 'development') {
  // Отключаем debug-логи Next.js и React
  process.env.NEXT_TELEMETRY_DISABLED = '1';
  process.env.NEXT_PRIVATE_DEBUG = '0';
  process.env.NODE_DEBUG = '';
  process.env.DEBUG = '';
  // Переопределяем console.debug и console.log (опционально)
  globalThis.console.debug = () => {};
  globalThis.console.log = () => {};
}

module.exports = nextConfig; 