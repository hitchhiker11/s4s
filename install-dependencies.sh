#!/bin/bash

# Скрипт для установки всех необходимых зависимостей для проекта Shop4Shoot

echo "Устанавливаем зависимости для React/Next.js фронтенда..."
cd frontend

# Устанавливаем основные зависимости
npm install next react react-dom axios styled-components

# Устанавливаем библиотеки для работы с данными и состоянием
npm install react-query zod

# Устанавливаем библиотеку для слайдера
npm install swiper

# Устанавливаем зависимости для разработки
npm install -D typescript @types/react @types/node eslint eslint-config-next prettier

echo "Все зависимости успешно установлены!"
echo "Теперь можно запустить проект командой 'npm run dev' в директории frontend" 