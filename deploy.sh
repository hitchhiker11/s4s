#!/bin/bash

echo "🚀 Деплой Shop4Shoot через Docker..."

# Проверяем, установлен ли Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен!"
    echo "Установите Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Проверяем, установлен ли docker-compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен!"
    echo "Установите Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "🛑 Останавливаем старые контейнеры..."
docker-compose down

echo "🔨 Собираем новые образы..."
docker-compose build --no-cache

echo "🚀 Запускаем контейнеры..."
docker-compose up -d

echo "⏳ Ждем запуска сервисов..."
sleep 10

echo "🔍 Проверяем статус..."
docker-compose ps

echo ""
echo "✅ Деплой завершен!"
echo ""
echo "🌐 Сайт доступен по адресам:"
echo "  - http://localhost:3000 (прямой доступ к Next.js)"
echo "  - http://localhost:8000 (PHP сервер для СДЭК)"
echo ""
echo "📋 Полезные команды:"
echo "  docker-compose logs -f          # Просмотр логов"
echo "  docker-compose ps               # Статус контейнеров"
echo "  docker-compose down             # Остановить"
echo "  docker-compose restart          # Перезапустить"
echo ""

# Показываем логи последних запусков
echo "📜 Последние логи:"
docker-compose logs --tail=20 