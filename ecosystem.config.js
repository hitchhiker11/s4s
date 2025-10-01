module.exports = {
  apps: [
    {
      // Next.js приложение
      name: 'shop4shoot-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/home/metr/work_projects/s4s/frontend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      log_file: '/home/metr/work_projects/s4s/logs/frontend-combined.log',
      out_file: '/home/metr/work_projects/s4s/logs/frontend-out.log',
      error_file: '/home/metr/work_projects/s4s/logs/frontend-error.log',
      time: true
    },
    {
      // PHP сервер для СДЭК виджета
      name: 'shop4shoot-php-server',
      script: 'php',
      args: '-S localhost:8000',
      cwd: '/home/metr/work_projects/s4s',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        PHP_ENV: 'production'
      },
      log_file: '/home/metr/work_projects/s4s/logs/php-server-combined.log',
      out_file: '/home/metr/work_projects/s4s/logs/php-server-out.log',
      error_file: '/home/metr/work_projects/s4s/logs/php-server-error.log',
      time: true
    }
  ]
};
