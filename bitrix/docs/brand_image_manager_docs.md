# Brand Image Manager API

## 📋 Описание

Контроллер `BrandImageManager` предназначен для автоматической загрузки и обновления изображений брендов из base64 данных. Система использует умный алгоритм поиска брендов в каталоге и автоматически связывает изображения с соответствующими элементами.

## 🎯 Основные возможности

- **Умный поиск брендов** - множественные алгоритмы сопоставления названий
- **Base64 обработка** - автоматическое декодирование и валидация изображений
- **Гибкие настройки** - порог схожести, размеры файлов, качество
- **Безопасность** - валидация форматов, размеров, защита от вредоносного кода
- **Подробное логирование** - детальные отчеты о каждой операции
- **Тестовый режим** - проверка поиска без сохранения

## 🔌 Endpoint

```
POST /api/brand-images
```

## 🔐 Аутентификация

```bash
Authorization-Token: your-jwt-token
```

## 📝 Формат запроса

### Headers
```
Content-Type: application/json
Authorization-Token: your-jwt-token
```

### Request Body
```json
{
  "brands": [
    {
      "name": "GLOCK",
      "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAI..."
    },
    {
      "name": "Beretta",
      "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
    }
  ]
}
```

### Query Parameters

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `brands_iblock_id` | integer | 22 | ID инфоблока справочника брендов |
| `similarity_threshold` | float | 0.8 | Порог схожести названий (0.1-1.0) |
| `max_brands_per_request` | integer | 100 | Макс. количество брендов в запросе |
| `max_image_size` | integer | 5242880 | Макс. размер изображения в байтах |
| `image_quality` | integer | 85 | Качество сжатия (10-100) |
| `dry_run` | string | N | Тестовый режим (Y/N) |
| `overwrite_existing` | string | N | Перезаписывать существующие (Y/N) |
| `with_logging` | string | Y | Детальное логирование (Y/N) |

## 🧠 Алгоритм поиска брендов

Система использует многоступенчатый алгоритм поиска:

### 1. Точное совпадение
```
Input: "GLOCK" → Found: "GLOCK" (similarity: 1.0)
```

### 2. Регистронезависимое совпадение
```
Input: "glock" → Found: "GLOCK" (similarity: 1.0)
```

### 3. Нормализованное совпадение
```
Input: "G L O C K" → Found: "GLOCK" (similarity: 1.0)
```

### 4. Вхождение подстроки
```
Input: "Glock" → Found: "Glock Inc." (similarity: 0.85)
```

### 5. Расстояние Левенштейна
```
Input: "Glok" → Found: "GLOCK" (similarity: 0.75)
```

## 📊 Формат ответа

### Успешный ответ (200)
```json
{
  "status": "success",
  "meta": {
    "brands_iblock_id": 22,
    "processed_count": 5,
    "successful_count": 3,
    "failed_count": 2,
    "similarity_threshold": 0.8,
    "dry_run": false,
    "execution_time": 2.45,
    "timestamp": "2025-01-15 15:30:00"
  },
  "results": {
    "successful": [
      {
        "input_name": "GLOCK",
        "found_brand": {
          "id": 8340,
          "name": "GLOCK",
          "code": "glock"
        },
        "match_type": "exact",
        "similarity": 1.0,
        "image_updated": true,
        "old_image_id": 123,
        "new_image_id": 456,
        "file_size": 15420
      }
    ],
    "failed": [
      {
        "input_name": "Unknown Brand",
        "reason": "brand_not_found",
        "attempted_matches": ["GLOCK", "Apple"],
        "best_similarity": 0.2
      }
    ]
  },
  "debug_log": [
    {
      "timestamp": "15:30:01",
      "message": "Обработка бренда GLOCK",
      "data": {"similarity": 1.0, "match_type": "exact"}
    }
  ]
}
```

## 🚨 Коды ошибок

### 400 Bad Request
```json
{"error": "Empty brands array"}
{"error": "Brand #0: missing or empty 'name' field"}
{"error": "Brand #0: invalid base64 image format"}
{"error": "Brand #0: unsupported image format 'image/gif'"}
{"error": "Brand #0: image size (7.2MB) exceeds maximum allowed (5.0MB)"}
```

### 404 Not Found
```json
{"error": "Brands iblock not found or inactive"}
```

### 500 Internal Server Error
```json
{"error": "Failed to process image: invalid file format"}
```

## 📈 Примеры использования

### 1. Базовая загрузка
```bash
curl -X POST "https://shop4shoot.com/api/brand-images" \
  -H "Authorization-Token: jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "brands": [
      {
        "name": "GLOCK",
        "image": "data:image/png;base64,iVBORw0KGgoAAAA..."
      }
    ]
  }'
```

### 2. Тестовый режим
```bash
curl -X POST "https://shop4shoot.com/api/brand-images?dry_run=Y" \
  -H "Authorization-Token: jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "brands": [
      {"name": "glock", "image": "data:image/png;base64,test..."}
    ]
  }'
```

### 3. Нечеткий поиск с перезаписью
```bash
curl -X POST "https://shop4shoot.com/api/brand-images?similarity_threshold=0.6&overwrite_existing=Y" \
  -H "Authorization-Token: jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "brands": [
      {
        "name": "Glock Inc",
        "image": "data:image/webp;base64,UklGRiQAA..."
      }
    ]
  }'
```

## 🎨 Поддерживаемые форматы изображений

- **JPEG** (`image/jpeg`) - универсальный формат
- **PNG** (`image/png`) - с поддержкой прозрачности
- **WebP** (`image/webp`) - современный сжатый формат

## 📏 Ограничения

| Параметр | Ограничение |
|----------|-------------|
| Максимальный размер изображения | 20MB |
| Максимальное количество брендов | 500 за запрос |
| Минимальный порог схожести | 0.1 |
| Поддерживаемые форматы | JPEG, PNG, WebP |

## 🔍 Типы совпадений

| Тип | Описание | Пример |
|-----|----------|--------|
| `exact` | Точное совпадение | "GLOCK" → "GLOCK" |
| `exact_normalized` | Нормализованное совпадение | "G L O C K" → "GLOCK" |
| `contains_input` | Каталог содержит ввод | "Glock" → "Glock Inc." |
| `input_contains` | Ввод содержит каталог | "Glock Corporation" → "Glock" |
| `levenshtein` | По расстоянию Левенштейна | "Glok" → "GLOCK" |

## 🛡️ Безопасность и совместимость с антивирусами

1. **Валидация форматов** - только разрешенные MIME типы
2. **Проверка размеров** - ограничение размера файлов
3. **Декодирование base64** - проверка корректности данных
4. **Без временных файлов** - прямая работа с потоками в памяти
5. **Множественные fallback методы** - обход ограничений антивирусов
6. **Логирование операций** - аудит всех действий

### Метод сохранения:
**Временный файл + CFile::MakeFileArray** (проверенный способ с форума Битрикс)
- Декодирование base64 через `preg_replace` + `base64_decode`
- Создание временного файла через `file_put_contents`
- Использование `CFile::MakeFileArray` для создания массива файла
- Автоматическое удаление временного файла

## 📝 Логирование

Система создает подробные логи в файлах:
- `/local/logs/brand_image_manager.log` - успешные операции
- `/local/logs/brand_image_manager_errors.log` - ошибки

## 🔄 Интеграция с существующей системой

Контроллер использует тот же инфоблок брендов (ID: 22), что и существующий `BrandManager`, обеспечивая полную совместимость с:
- Каталогом товаров
- Системой фильтрации по брендам
- API получения брендов
- Механизмом связывания товаров

## 🚀 Рекомендации по использованию

1. **Начните с тестового режима** для проверки поиска брендов
2. **Используйте пакетную обработку** для больших объемов данных
3. **Настройте порог схожести** под ваши данные (0.6-0.9)
4. **Мониторьте логи** для выявления проблем
5. **Оптимизируйте изображения** перед загрузкой

## 🔧 Решение проблем

### Бренд не найден
- Проверьте точность названия
- Уменьшите `similarity_threshold`
- Используйте `dry_run=Y` для отладки

### Изображение не загружается
- Проверьте формат base64
- Убедитесь в поддержке MIME типа
- Проверьте размер файла

### Медленная работа
- Уменьшите количество брендов за запрос
- Оптимизируйте размеры изображений
- Используйте WebP формат

### Проблемы с антивирусами
Система автоматически использует несколько методов сохранения:

**Простой и проверенный алгоритм:**

```php
// 1. Декодируем base64
$data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64Image));

// 2. Создаем временный файл  
file_put_contents($tempFilePath, $data);

// 3. Используем CFile::MakeFileArray
$arFile = CFile::MakeFileArray($tempFilePath);

// 4. Обновляем элемент
$el->Update($brandId, ['PREVIEW_PICTURE' => $arFile]);

// 5. Удаляем временный файл
unlink($tempFilePath);
```

Этот метод взят с официального форума Битрикс и проверен множеством разработчиков.

**Логи покажут статус операции:**
- `method: temporary_file_forum_method` - успешное сохранение через временный файл
- Детальная информация о создании и удалении временного файла
- Размер файла и путь к временному файлу

Если все методы не работают, проверьте настройки антивируса или временно отключите real-time защиту для тестирования. 