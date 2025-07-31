#!/bin/bash

echo "🚀 Запуск PHP сервиса для CDEK API..."
echo "📍 Сервис будет доступен по адресу: http://localhost:8000"
echo "📁 Файл: service.php"
echo ""
echo "Для остановки нажмите Ctrl+C"
echo ""

# Проверяем что PHP установлен
if ! command -v php &> /dev/null; then
    echo "❌ PHP не найден. Установите PHP для работы сервиса."
    exit 1
fi

# Запускаем PHP сервер
php -S localhost:8000 -t .

echo ""
echo "✅ PHP сервис остановлен" 