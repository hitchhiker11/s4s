# 🐳 DOCKER ДЕПЛОЙ - Максимально бесшовно!

## ⚡ Быстрый старт (одной командой!)

### 1. Локально собираете:
```bash
git add .
git commit -m "Docker setup"
git push
```

### 2. На сервере разворачиваете:
```bash
git pull
./deploy.sh
```

**🎉 ВСЁ! Сайт работает!**

---

## 🔧 Что происходит автоматически:

- ✅ **Сборка** Next.js приложения в Docker
- ✅ **Запуск** PHP сервера для СДЭК
- ✅ **Автоперезапуск** при сбоях
- ✅ **Изоляция** от системы
- ✅ **Логирование** всех процессов

---

## 🌐 Доступ к сайту:

### Простой вариант:
- **Сайт**: `http://ВАШ_IP:3000`
- **PHP**: `http://ВАШ_IP:8000`

### С Nginx (рекомендуется для продакшена):
```bash
./deploy-with-nginx.sh
```
- **Сайт**: `http://ВАШ_IP` (стандартный 80 порт)

---

## 📋 Команды управления:

```bash
# Простой деплой
./deploy.sh

# Деплой с Nginx
./deploy-with-nginx.sh

# Статус контейнеров
docker-compose ps

# Логи
docker-compose logs -f

# Перезапуск
docker-compose restart

# Остановка
docker-compose down

# Обновление (на сервере)
git pull && ./deploy.sh
```

---

## 🚀 Процесс деплоя:

### 1. Локальная разработка:
```bash
# Разрабатываете как обычно
cd frontend
npm run dev
```

### 2. Готовы к деплою:
```bash
git add .
git commit -m "Update"
git push
```

### 3. На сервере (автоматизировано):
```bash
git pull
./deploy.sh
```

**Готово! Сайт обновлен!**

---

## ⚙️ Структура Docker:

```
📦 Docker Setup
├── Dockerfile              # Next.js приложение
├── docker-compose.yml      # Оркестрация сервисов
├── nginx.conf              # Конфигурация Nginx
├── deploy.sh               # Простой деплой
├── deploy-with-nginx.sh    # Деплой с Nginx
└── .dockerignore           # Исключения для Docker
```

---

## 🔍 Что внутри контейнеров:

### Frontend (Next.js):
- ✅ Node.js 18 Alpine
- ✅ Оптимизированная сборка
- ✅ Standalone режим
- ✅ Автоматический перезапуск

### PHP Server:
- ✅ PHP 8.2 CLI Alpine
- ✅ Встроенный веб-сервер
- ✅ Работа с СДЭК виджетом

### Nginx (опционально):
- ✅ Проксирование запросов
- ✅ Кэширование статики
- ✅ Сжатие gzip
- ✅ Безопасность headers

---

## 🛠️ Требования на сервере:

```bash
# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установка Docker Compose
sudo apt install docker-compose

# Добавление пользователя в группу docker
sudo usermod -aG docker $USER
```

---

## 🔥 Преимущества Docker подхода:

- 🚀 **Быстрый деплой** - одна команда
- 🔒 **Изоляция** - не влияет на систему
- 📦 **Портабельность** - работает везде одинаково
- 🔧 **Простота** - не нужно настраивать PM2/Node.js
- 📈 **Масштабируемость** - легко добавить сервисы
- 🛡️ **Безопасность** - изолированная среда

---

## 🆘 Troubleshooting:

```bash
# Проблемы с портами
sudo netstat -tulpn | grep :3000
sudo lsof -i :3000

# Перезапуск Docker
sudo systemctl restart docker

# Очистка Docker
docker system prune -a

# Пересборка без кэша
docker-compose build --no-cache

# Логи конкретного сервиса
docker-compose logs frontend
docker-compose logs php-server
```

---

## 💡 Дополнительные возможности:

### Добавить SSL (Let's Encrypt):
```bash
# В docker-compose.yml добавить certbot
# Автоматическое получение сертификатов
```

### Мониторинг:
```bash
# Добавить в docker-compose.yml:
# - Prometheus
# - Grafana
# - Node Exporter
```

### Backup:
```bash
# Автоматический backup данных
# Синхронизация с S3/облаком
```

---

## ✅ Итого: Максимально бесшовный процесс!

1. **Разработка**: работаете как обычно
2. **Деплой**: `git push` → `git pull && ./deploy.sh`
3. **Готово**: сайт работает по IP сервера!

**Никаких настроек PM2, Node.js, PHP - всё в Docker! 🐳** 