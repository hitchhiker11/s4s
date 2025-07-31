#!/bin/bash

echo "📺 Запуск Shop4Shoot в tmux..."

# Проверяем, установлен ли tmux
if ! command -v tmux &> /dev/null; then
    echo "❌ tmux не установлен!"
    echo "Установите tmux: sudo apt install tmux"
    exit 1
fi

# Убиваем старую сессию (если есть)
tmux kill-session -t shop4shoot 2>/dev/null || true

echo "🔧 Создаем новую tmux сессию..."

# Создаем новую сессию
tmux new-session -d -s shop4shoot -n main

# Окно 1: Frontend
tmux send-keys -t shop4shoot:main "cd /home/alexandr/s4s/frontend" Enter
tmux send-keys -t shop4shoot:main "echo '📦 Устанавливаем зависимости...'" Enter
tmux send-keys -t shop4shoot:main "npm install" Enter
tmux send-keys -t shop4shoot:main "echo '🔨 Собираем проект...'" Enter
tmux send-keys -t shop4shoot:main "npm run build" Enter
tmux send-keys -t shop4shoot:main "echo '🚀 Запускаем Next.js...'" Enter
tmux send-keys -t shop4shoot:main "npm start" Enter

# Окно 2: PHP сервер
tmux new-window -t shop4shoot -n php
tmux send-keys -t shop4shoot:php "cd /home/alexandr/s4s" Enter

if [ -d "widget" ]; then
    tmux send-keys -t shop4shoot:php "cd widget" Enter
    tmux send-keys -t shop4shoot:php "echo '🐘 Запускаем PHP сервер...'" Enter
    tmux send-keys -t shop4shoot:php "php -S localhost:8000" Enter
else
    tmux send-keys -t shop4shoot:php "echo '❌ Директория widget не найдена'" Enter
fi

# Окно 3: Мониторинг (опционально)
tmux new-window -t shop4shoot -n monitor
tmux send-keys -t shop4shoot:monitor "echo '📊 Мониторинг системы'" Enter
tmux send-keys -t shop4shoot:monitor "echo 'Команды:'" Enter
tmux send-keys -t shop4shoot:monitor "echo '  htop - мониторинг процессов'" Enter
tmux send-keys -t shop4shoot:monitor "echo '  tail -f ../logs/* - просмотр логов'" Enter

echo ""
echo "✅ Tmux сессия создана!"
echo ""
echo "🔍 Управление tmux:"
echo "  tmux attach -t shop4shoot    # Подключиться к сессии"
echo "  tmux detach                  # Отключиться (Ctrl+B, затем D)"
echo "  tmux ls                      # Список сессий"
echo "  tmux kill-session -t shop4shoot  # Убить сессию"
echo ""
echo "📱 Переключение между окнами:"
echo "  Ctrl+B, затем 0  # Frontend"
echo "  Ctrl+B, затем 1  # PHP сервер"
echo "  Ctrl+B, затем 2  # Мониторинг"
echo ""
echo "🌐 Адреса:"
echo "  Frontend: http://localhost:3000"
echo "  PHP: http://localhost:8000"
echo ""

# Подключаемся к сессии
echo "Подключаемся к сессии через 3 секунды..."
sleep 3
tmux attach -t shop4shoot 