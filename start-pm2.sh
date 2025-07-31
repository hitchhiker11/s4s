#!/bin/bash

echo "🚀 Запуск Shop4Shoot через PM2..."

# Создаем директорию для логов
mkdir -p logs

# Переходим в директорию frontend
cd frontend

echo "📦 Устанавливаем зависимости..."
npm install

echo "🔨 Собираем проект..."
npm run build

# Возвращаемся в корень
cd ..

echo "🔧 Запускаем процессы через PM2..."

# Останавливаем старые процессы (если есть)
pm2 stop shop4shoot-frontend shop4shoot-php-server 2>/dev/null || true
pm2 delete shop4shoot-frontend shop4shoot-php-server 2>/dev/null || true

# Запускаем Next.js приложение
pm2 start npm --name "shop4shoot-frontend" -- start --cwd /home/alexandr/s4s/frontend

# Запускаем PHP сервер (если директория widget существует)
if [ -d "widget" ]; then
    pm2 start "php -S localhost:8000" --name "shop4shoot-php-server" --cwd /home/alexandr/s4s/widget
    echo "✅ PHP сервер запущен на http://localhost:8000"
fi

# Сохраняем конфигурацию
pm2 save

echo "✅ Готово!"
echo "Frontend: http://localhost:3000"
echo "Проверить статус: pm2 status"
echo "Просмотр логов: pm2 logs" 