#!/bin/bash

# Перейти в директорию frontend
cd "$(dirname "$0")"

# Использовать NODE_OPTIONS для обхода проблем совместимости
export NODE_OPTIONS="--openssl-legacy-provider"

# Запустить проект
npm run dev 