#!/bin/bash

echo "🐘 Запуск PHP сервера..."

# Проверяем, установлен ли PHP
if ! command -v php &> /dev/null; then
    echo "❌ PHP не установлен!"
    echo "Установите PHP: sudo apt install php"
    exit 1
fi

# Определяем директорию для сервера
if [ -d "widget" ]; then
    SERVER_DIR="widget"
    echo "📁 Запускаем сервер из директории: widget/"
elif [ -d "backend" ]; then
    SERVER_DIR="backend"
    echo "📁 Запускаем сервер из директории: backend/"
else
    SERVER_DIR="."
    echo "📁 Запускаем сервер из текущей директории"
fi

# Определяем порт
PORT=${1:-8000}

echo "🌐 Сервер будет доступен на: http://localhost:$PORT"
echo "📍 Директория сервера: $SERVER_DIR"
echo "⏹️  Для остановки нажмите Ctrl+C"
echo ""

# Запускаем PHP сервер
cd "$SERVER_DIR"
php -S localhost:$PORT 