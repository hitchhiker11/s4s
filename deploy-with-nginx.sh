#!/bin/bash

echo "🚀 Деплой Shop4Shoot с Nginx через Docker..."

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
docker-compose --profile with-nginx down

echo "🔨 Собираем новые образы..."
docker-compose --profile with-nginx build --no-cache

echo "🚀 Запускаем контейнеры с Nginx..."
docker-compose --profile with-nginx up -d

echo "⏳ Ждем запуска сервисов..."
sleep 15

echo "🔍 Проверяем статус..."
docker-compose --profile with-nginx ps

echo ""
echo "✅ Деплой с Nginx завершен!"
echo ""
echo "🌐 Сайт доступен по адресам:"
echo "  - http://localhost (через Nginx, рекомендуется)"
echo "  - http://ВАШ_IP (доступен извне через Nginx)"
echo "  - http://localhost:3000 (прямой доступ к Next.js)"
echo "  - http://localhost:8000 (прямой доступ к PHP)"
echo ""
echo "📋 Полезные команды:"
echo "  docker-compose --profile with-nginx logs -f"
echo "  docker-compose --profile with-nginx ps"
echo "  docker-compose --profile with-nginx down"
echo "  docker-compose --profile with-nginx restart"
echo ""

# Показываем логи последних запусков
echo "📜 Последние логи:"
docker-compose --profile with-nginx logs --tail=20 