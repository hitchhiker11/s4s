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