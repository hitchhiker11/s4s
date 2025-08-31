# Инструкции по запуску проекта через PM2

## Предварительные требования

1. **Node.js** (версия 16.x или выше)
2. **PM2** (Process Manager 2)
3. **PHP** (версия 7.4 или выше) для виджета СДЭК
4. **Nginx** (опционально, для проксирования)

## Установка PM2

```bash
# Глобальная установка PM2
npm install -g pm2

# Проверка установки
pm2 --version
```

## Структура проекта

```
/home/alexandr/s4s/
├── frontend/          # Next.js приложение
├── backend/           # Bitrix backend
├── widget/           # PHP сервер для СДЭК виджета
└── PM2_SETUP_INSTRUCTIONS.md
```

## Шаг 1: Подготовка Next.js приложения

```bash
# Переход в директорию frontend
cd /home/alexandr/s4s/frontend

# Установка зависимостей
npm install

# Сборка приложения для production
npm run build
```

## Шаг 2: Создание конфигурационных файлов PM2

### 2.1 Создание ecosystem.config.js

Создайте файл `ecosystem.config.js` в корне проекта (`/home/alexandr/s4s/`):

```javascript
module.exports = {
  apps: [
    {
      // Next.js приложение
      name: 'shop4shoot-frontend',
      script: 'npm',
      args: 'start',
      cwd: '/home/alexandr/s4s/frontend',
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
      log_file: '/home/alexandr/s4s/logs/frontend-combined.log',
      out_file: '/home/alexandr/s4s/logs/frontend-out.log',
      error_file: '/home/alexandr/s4s/logs/frontend-error.log',
      time: true
    },
    {
      // PHP сервер для СДЭК виджета
      name: 'shop4shoot-php-server',
      script: 'php',
      args: '-S localhost:8000',
      cwd: '/home/alexandr/s4s/widget',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
      env: {
        PHP_ENV: 'production'
      },
      log_file: '/home/alexandr/s4s/logs/php-server-combined.log',
      out_file: '/home/alexandr/s4s/logs/php-server-out.log',
      error_file: '/home/alexandr/s4s/logs/php-server-error.log',
      time: true
    }
  ]
};
```

### 2.2 Создание директории для логов

```bash
# Создание директории для логов
mkdir -p /home/alexandr/s4s/logs
```

## Шаг 3: Запуск приложений через PM2

### 3.1 Запуск всех сервисов

```bash
# Переход в корневую директорию проекта
cd /home/alexandr/s4s

# Запуск всех приложений через ecosystem файл
pm2 start ecosystem.config.js

# Или запуск для production среды
pm2 start ecosystem.config.js --env production
```

### 3.2 Альтернативный запуск (по отдельности)

```bash
# Запуск Next.js приложения
pm2 start npm --name "shop4shoot-frontend" -- start --cwd /home/alexandr/s4s/frontend

# Запуск PHP сервера для СДЭК виджета
pm2 start "php -S localhost:8000" --name "shop4shoot-php-server" --cwd /home/alexandr/s4s/widget
```

## Шаг 4: Управление процессами PM2

### 4.1 Основные команды

```bash
# Просмотр статуса всех процессов
pm2 status

# Просмотр подробной информации
pm2 show shop4shoot-frontend

# Просмотр логов в реальном времени
pm2 logs

# Просмотр логов конкретного приложения
pm2 logs shop4shoot-frontend

# Перезапуск приложения
pm2 restart shop4shoot-frontend

# Остановка приложения
pm2 stop shop4shoot-frontend

# Удаление приложения из PM2
pm2 delete shop4shoot-frontend

# Перезапуск всех приложений
pm2 restart all

# Остановка всех приложений
pm2 stop all
```

### 4.2 Мониторинг

```bash
# Web-мониторинг (откроется веб-интерфейс)
pm2 monit

# Сохранение текущего состояния PM2
pm2 save

# Автозапуск PM2 при перезагрузке системы
pm2 startup

# После выполнения команды startup, скопируйте и выполните предложенную команду
```

## Шаг 5: Настройка автозапуска при загрузке системы

```bash
# 1. Генерация startup скрипта
pm2 startup

# 2. Запуск ваших приложений
pm2 start ecosystem.config.js

# 3. Сохранение текущего состояния
pm2 save

# Теперь ваши приложения будут автоматически запускаться при перезагрузке сервера
```

## Шаг 6: Настройка Nginx (опционально)

Создайте конфигурацию Nginx для проксирования запросов:

```nginx
# /etc/nginx/sites-available/shop4shoot
server {
    listen 80;
    server_name your-domain.com;

    # Проксирование к Next.js приложению
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Проксирование к PHP серверу для СДЭК виджета
    location /cdek-widget/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Активация конфигурации:
```bash
sudo ln -s /etc/nginx/sites-available/shop4shoot /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Шаг 7: Проверка работы

### 7.1 Проверка портов

```bash
# Проверка, что порты прослушиваются
netstat -tuln | grep -E ':3000|:8000'

# Или с помощью ss
ss -tuln | grep -E ':3000|:8000'
```

### 7.2 Проверка приложений

```bash
# Проверка Next.js приложения
curl http://localhost:3000

# Проверка PHP сервера
curl http://localhost:8000
```

## Шаг 8: Обновление приложения

### 8.1 Обновление кода

```bash
# 1. Остановка приложений
pm2 stop all

# 2. Обновление кода (git pull, etc.)
cd /home/alexandr/s4s/frontend
git pull origin main

# 3. Установка новых зависимостей (если есть)
npm install

# 4. Пересборка приложения
npm run build

# 5. Запуск приложений
pm2 start ecosystem.config.js
```

### 8.2 Zero-downtime обновление

```bash
# Плавное обновление без простоя
pm2 reload ecosystem.config.js
```

## Шаг 9: Резервное копирование и восстановление

### 9.1 Сохранение конфигурации PM2

```bash
# Создание дампа процессов PM2
pm2 save

# Резервное копирование
cp ~/.pm2/dump.pm2 /home/alexandr/s4s/backup/dump.pm2.backup
```

### 9.2 Восстановление

```bash
# Восстановление процессов из дампа
pm2 resurrect
```

## Устранение неполадок

### Проблема: Приложение не запускается

```bash
# Проверка логов
pm2 logs shop4shoot-frontend --lines 50

# Проверка статуса
pm2 status

# Перезапуск с flush логов
pm2 flush
pm2 restart shop4shoot-frontend
```

### Проблема: PHP сервер не отвечает

```bash
# Проверка, что PHP работает
php --version

# Проверка портов
lsof -i :8000

# Перезапуск PHP сервера
pm2 restart shop4shoot-php-server
```

### Проблема: Высокое потребление памяти

```bash
# Мониторинг ресурсов
pm2 monit

# Настройка лимита памяти в ecosystem.config.js
max_memory_restart: '512M'
```

## Полезные команды для мониторинга

```bash
# Просмотр метрик
pm2 show shop4shoot-frontend

# Просмотр использования ресурсов
pm2 monit

# Архивация старых логов
pm2 flush

# Просмотр версии PM2 и конфигурации
pm2 info
```

## Заключение

После выполнения всех шагов у вас будет:

1. **Next.js приложение** на порту 3000
2. **PHP сервер для СДЭК виджета** на порту 8000
3. **Автоматический перезапуск** при сбоях
4. **Автозапуск при загрузке системы**
5. **Централизованное логирование**
6. **Веб-мониторинг** через PM2

Доступ к приложению:
- **Frontend**: http://localhost:3000
- **СДЭК виджет**: http://localhost:8000
- **PM2 мониторинг**: `pm2 monit` 