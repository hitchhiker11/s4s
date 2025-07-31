#!/bin/bash

echo "⚙️ Создание systemd сервисов..."

# Проверяем права
if [ "$EUID" -eq 0 ]; then
    echo "❌ Не запускайте под root! Используйте sudo только для установки сервисов."
    exit 1
fi

USER_NAME=$(whoami)
PROJECT_PATH="/home/alexandr/s4s"

echo "👤 Пользователь: $USER_NAME"
echo "📁 Путь к проекту: $PROJECT_PATH"

# Создаем сервис для Frontend
cat > shop4shoot-frontend.service << EOF
[Unit]
Description=Shop4Shoot Frontend (Next.js)
After=network.target

[Service]
Type=simple
User=$USER_NAME
WorkingDirectory=$PROJECT_PATH/frontend
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Создаем сервис для PHP
cat > shop4shoot-php.service << EOF
[Unit]
Description=Shop4Shoot PHP Server
After=network.target

[Service]
Type=simple
User=$USER_NAME
WorkingDirectory=$PROJECT_PATH/widget
ExecStart=/usr/bin/php -S localhost:8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

echo "📝 Сервисы созданы:"
echo "  - shop4shoot-frontend.service"
echo "  - shop4shoot-php.service"
echo ""
echo "📋 Для установки выполните:"
echo ""
echo "sudo cp shop4shoot-*.service /etc/systemd/system/"
echo "sudo systemctl daemon-reload"
echo "sudo systemctl enable shop4shoot-frontend"
echo "sudo systemctl enable shop4shoot-php"
echo "sudo systemctl start shop4shoot-frontend"
echo "sudo systemctl start shop4shoot-php"
echo ""
echo "🔍 Управление сервисами:"
echo "sudo systemctl status shop4shoot-frontend"
echo "sudo systemctl restart shop4shoot-frontend"
echo "sudo systemctl stop shop4shoot-frontend"
echo "sudo journalctl -u shop4shoot-frontend -f" 