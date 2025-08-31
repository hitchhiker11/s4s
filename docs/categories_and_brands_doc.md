# 📚 Документация REST API: Sections и Brands

## 🏗️ Endpoints Sections

### `GET /api/sections`

Получение разделов каталога с расширенными возможностями фильтрации, сортировки и форматирования.

#### 🔐 Безопасность
- **Аутентификация**: Не требуется
- **Тип токена**: Bearer (опционально)
- **Проверка истечения**: Да

#### 📋 Основные параметры

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `iblock_id` | integer | ✅ | ID инфоблока каталога |
| `section_id` | integer | ❌ | ID родительского раздела для получения дочерних |
| `parent_section_id` | integer | ❌ | ID родительского раздела (приоритет над section_id) |
| `parent_section` | string | ❌ | `root` - только корневые, `all` - все разделы |

> ⚠️ **Важно**: При использовании `parent_section_id` или `section_id` для получения дочерних элементов, необходимо использовать `tree_mode=flat`. Режим `nested` предназначен для построения полного дерева категорий.

#### 🌳 Управление структурой

| Параметр | Тип | Возможные значения | Описание |
|----------|-----|-------------------|----------|
| `depth` | integer | 1-5 | Глубина вложенности (по умолчанию: 1) |
| `max_depth` | integer | любое | Максимальная глубина рекурсии |
| `tree_mode` | string | `flat`, `nested` | Режим вывода данных |

**Режимы работы:**
- `flat` - плоский список разделов (рекомендуется для получения дочерних элементов)
- `nested` - иерархическое дерево разделов (для полной структуры каталога)

#### 🔍 Параметры фильтрации

| Параметр | Тип | Возможные значения | Описание |
|----------|-----|-------------------|----------|
| `active` | string | `Y`, `N`, `all` | Активность разделов |
| `global_active` | string | `Y`, `N`, `all` | Глобальная активность |
| `name` | string | любая строка | Поиск по названию (LIKE %value%) |
| `code` | string | любая строка | Фильтр по символьному коду |
| `external_id` | string | любая строка | Фильтр по внешнему ID |

#### 📊 Подсчет элементов

| Параметр | Тип | Возможные значения | Описание |
|----------|-----|-------------------|----------|
| `with_element_count` | string | `Y`, `N` | Добавить количество элементов в разделе |
| `count_active_only` | string | `Y`, `N` | Считать только активные элементы |
| `with_subsection_count` | string | `Y`, `N` | Добавить количество подразделов |

#### ⚙️ Настройки вывода

| Параметр | Тип | Возможные значения | Описание |
|----------|-----|-------------------|----------|
| `format` | string | `full`, `compact`, `minimal` | Формат ответа |
| `select` | array | поля БД | Дополнительные поля для выборки |
| `exclude_fields` | array | названия полей | Исключить конкретные поля |
| `fields_only` | array | названия полей | Оставить только указанные поля |
| `sort` | string | `field:direction` | Сортировка (например: `sort:asc,name:desc`) |

#### 📈 Дополнительные данные

| Параметр | Тип | Возможные значения | Описание |
|----------|-----|-------------------|----------|
| `with_seo` | string | `Y`, `N` | Включить SEO-данные |
| `with_properties` | string | `Y`, `N` | Включить свойства разделов |

#### 🏷️ Работа с брендами

| Параметр | Тип | Возможные значения | Описание |
|----------|-----|-------------------|----------|
| `brands_from_elements` | string | `Y`, `N` | Получить бренды из элементов разделов |
| `brand_property` | string | код свойства | Код свойства бренда (по умолчанию: BRAND) |
| `unique_brands_only` | string | `Y`, `N` | Только уникальные бренды |

### 📤 Примеры запросов

#### Получение корневых разделов
```bash
GET /api/sections?iblock_id=21&parent_section=root&tree_mode=flat
```

#### Получение дочерних разделов категории
```bash
GET /api/sections?iblock_id=21&parent_section_id=15&tree_mode=flat
```

#### Получение полного дерева каталога
```bash
GET /api/sections?iblock_id=21&tree_mode=nested&max_depth=3
```

#### Поиск разделов с подсчетом элементов
```bash
GET /api/sections?iblock_id=21&name=Телефоны&with_element_count=Y&with_seo=Y
```

### 📄 Структура ответа

#### Плоский список (`tree_mode=flat`)
```json
{
  "meta": {
    "iblock_id": 21,
    "section_id": null,
    "parent_section_id": 15,
    "parent_section": "all",
    "depth": 1,
    "tree_mode": "flat",
    "total_count": 5,
    "format": "full",
    "request_time": "2025-01-15 10:30:45"
  },
  "data": [
    {
      "id": 16,
      "name": "Смартфоны",
      "fields": {
        "ID": 16,
        "NAME": "Смартфоны",
        "CODE": "smartphones",
        "SECTION_PAGE_URL": "/catalog/phones/smartphones/",
        "PICTURE": "123",
        "DESCRIPTION": "Современные смартфоны",
        "IBLOCK_SECTION_ID": 15,
        "DEPTH_LEVEL": 2
      },
      "element_count": 45,
      "subsection_count": 3,
      "seo": {
        "meta_title": "Смартфоны - купить в интернет-магазине",
        "meta_description": "Большой выбор смартфонов...",
        "meta_keywords": "смартфон, телефон, мобильный"
      }
    }
  ]
}
```

#### Дерево (`tree_mode=nested`)
```json
{
  "meta": {
    "iblock_id": 21,
    "tree_mode": "nested",
    "total_count": 12,
    "format": "full",
    "request_time": "2025-01-15 10:30:45"
  },
  "data": [
    {
      "id": 15,
      "name": "Телефоны",
      "fields": {
        "ID": 15,
        "NAME": "Телефоны",
        "CODE": "phones"
      },
      "children": [
        {
          "id": 16,
          "name": "Смартфоны",
          "fields": {
            "ID": 16,
            "NAME": "Смартфоны",
            "CODE": "smartphones"
          },
          "children": []
        }
      ]
    }
  ]
}
```

---

## 🏷️ Endpoints Brands

### `GET /api/catalog?action=brands`

Получение брендов из инфоблока брендов (ID 22) с полной информацией, изображениями и подсчетом товаров.

#### 🔐 Безопасность
- **Аутентификация**: Требуется JWT токен
- **Тип токена**: Bearer
- **Проверка истечения**: Да

#### 📋 Основные параметры

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `action` | string | ✅ | **brands** - для получения списка брендов |
| `iblock_id` | integer | ✅ | ID инфоблока каталога |
| `brands_iblock_id` | integer | ❌ | ID инфоблока брендов (по умолчанию: 22) |

#### 🔍 Параметры фильтрации

| Параметр | Тип | Возможные значения | Описание |
|----------|-----|-------------------|----------|
| `search` | string | любая строка | Поиск брендов по названию (LIKE %value%) |
| `with_products` | string | `Y`, `N` | Показать только бренды с товарами |
| `sort` | string | `name:asc`, `sort:asc` | Сортировка брендов |

#### 📊 Дополнительные данные

| Параметр | Тип | Возможные значения | Описание |
|----------|-----|-------------------|----------|
| `with_products_count` | string | `Y`, `N` | Подсчет товаров для каждого бренда |
| `with_properties` | string | `Y`, `N` | Включить свойства брендов из инфоблока |

#### 🖼️ Настройки изображений

| Параметр | Тип | Возможные значения | Описание |
|----------|-----|-------------------|----------|
| `image_resize` | string | `300x300`, `150x150` | Автоматический ресайз изображений |

### 📤 Примеры запросов

#### Получение всех брендов с подсчетом товаров
```bash
GET /api/catalog?iblock_id=21&action=brands&with_products_count=Y
```

#### Поиск брендов с изображениями
```bash
GET /api/catalog?iblock_id=21&action=brands&search=glock&image_resize=150x150
```

#### Бренды только с товарами
```bash
GET /api/catalog?iblock_id=21&action=brands&with_products=Y&with_products_count=Y
```

#### Полная информация с свойствами
```bash
GET /api/catalog?iblock_id=21&action=brands&with_properties=Y&sort=name:asc
```

### 📄 Структура ответа

```json
{
  "meta": {
    "action": "brands",
    "brands_iblock_id": 22,
    "total_count": 164,
    "with_products_only": false,
    "with_products_count": true,
    "with_properties": false,
    "search_applied": false,
    "request_time": "2025-01-15 10:30:45"
  },
  "data": [
    {
      "id": 8340,
      "name": "GLOCK",
      "code": "glock",
      "sort": 500,
      "preview_text": "Австрийский производитель пистолетов",
      "detail_text": "GLOCK - ведущий производитель служебного и спортивного оружия",
      "preview_picture": {
        "id": 123,
        "src": "https://example.com/upload/iblock/abc/glock-logo.jpg",
        "width": 300,
        "height": 200,
        "file_size": 15420,
        "alt": "GLOCK",
        "title": "GLOCK logo",
        "resized": {
          "src": "https://example.com/upload/resize_cache/iblock/abc/150_150_1/glock-logo.jpg",
          "width": 150,
          "height": 150
        }
      },
      "detail_picture": {
        "id": 124,
        "src": "https://example.com/upload/iblock/def/glock-detail.jpg",
        "width": 800,
        "height": 600,
        "file_size": 85420,
        "alt": "GLOCK detail",
        "title": "GLOCK подробное изображение"
      },
      "date_create": "2024-01-15 10:00:00",
      "date_modified": "2024-12-20 15:30:00",
      "products_count": 96
    }
  ]
}
```

## 🛒 Фильтрация товаров по брендам

### `GET /api/catalog?brand_id=ID`

Получение товаров конкретного бренда с полной информацией о бренде.

#### 📋 Параметры для фильтрации товаров по брендам

| Параметр | Тип | Возможные значения | Описание |
|----------|-----|-------------------|----------|
| `brand_id` | integer | любое число | ID бренда из инфоблока брендов |
| `brand_category` | integer | 1, 2, 3... | Порядковый номер бренда |
| `include_subbrands` | string | `Y`, `N` | Включить подбренды первого уровня |
| `deep_subbrands` | string | `Y`, `N` | Глубокий поиск по всем подбрендам |

#### 🔄 Совместимость с разделами

Фильтрация по брендам полностью совместима с фильтрацией по разделам:

```bash
# Товары бренда из конкретного раздела
GET /api/catalog?iblock_id=21&section_id=156&brand_id=8340

# Товары бренда из раздела с подразделами
GET /api/catalog?iblock_id=21&section_id=156&include_subsections=Y&brand_id=8340

# Товары бренда из глубокого дерева разделов
GET /api/catalog?iblock_id=21&section_id=156&deep_subsections=Y&brand_id=8340
```

### 📄 Мета-информация о бренде в ответе

При фильтрации по `brand_id` в мета-данные добавляется блок `brand_info`:

```json
{
  "meta": {
    "iblock_id": 21,
    "brands_iblock_id": 22,
    "brand_id": 8340,
    "brand_info": {
      "main_brand": {
        "id": 8340,
        "name": "GLOCK",
        "code": "glock",
        "preview_picture": {
          "id": 123,
          "src": "https://example.com/upload/iblock/abc/glock-logo.jpg",
          "width": 300,
          "height": 200
        },
        "detail_picture": {
          "id": 124,
          "src": "https://example.com/upload/iblock/def/glock-detail.jpg",
          "width": 800,
          "height": 600
        },
        "preview_text": "Австрийский производитель пистолетов",
        "detail_text": "GLOCK - ведущий производитель служебного и спортивного оружия"
      },
      "mode": "exact",
      "included_brands_count": 1
    }
  },
  "data": [
    // товары бренда GLOCK
  ]
}
```

### 🔧 Детальное описание полей бренда

#### Основные поля
- **id**: ID элемента из инфоблока брендов
- **name**: Название бренда
- **code**: Символьный код (генерируется автоматически)
- **sort**: Сортировка элемента

#### Описания
- **preview_text**: Краткое описание бренда
- **detail_text**: Подробное описание бренда

#### Изображения
Каждое изображение содержит:
- **id**: ID файла
- **src**: Полный URL изображения  
- **width/height**: Размеры изображения
- **file_size**: Размер файла в байтах
- **alt/title**: Alt и title атрибуты
- **resized**: Ресайзнутая версия (если указан `image_resize`)

#### Системные поля
- **date_create**: Дата создания элемента
- **date_modified**: Дата последнего изменения
- **products_count**: Количество товаров бренда (если указан `with_products_count=Y`)

### ⚡ Оптимизация производительности

#### Рекомендации:
1. **Используйте `brand_id`** вместо `brand=название` для точной фильтрации
2. **Кешируйте список брендов** на стороне клиента
3. **Используйте `with_products=Y`** только когда необходимо
4. **Ограничивайте `image_resize`** разумными размерами

#### Оптимизированные запросы:
```bash
# Быстрый запрос списка брендов для селекта
GET /api/catalog?iblock_id=21&action=brands

# Эффективная фильтрация товаров по бренду
GET /api/catalog?iblock_id=21&brand_id=8340&limit=20

# Бренды только с товарами и минимальными изображениями
GET /api/catalog?iblock_id=21&action=brands&with_products=Y&image_resize=100x100
```

### 🚨 Обработка ошибок

| Код | Описание | Решение |
|-----|----------|---------|
| 400 | Неверный action | Используйте `action=brands` |
| 400 | Неверный iblock_id | Проверьте ID инфоблока каталога |
| 404 | Brand not found | Проверьте существование бренда с указанным ID |
| 500 | Ошибка получения брендов | Проверьте доступность инфоблока брендов |

### 📞 Примеры использования в коде

#### JavaScript (Fetch API)
```javascript
// Получение списка всех брендов
const brands = await fetch('/api/catalog?iblock_id=21&action=brands')
  .then(r => r.json());

// Получение товаров конкретного бренда
const brandProducts = await fetch('/api/catalog?iblock_id=21&brand_id=8340&limit=20')
  .then(r => r.json());

// Поиск брендов
const searchBrands = await fetch('/api/catalog?iblock_id=21&action=brands&search=glock')
  .then(r => r.json());
```

#### PHP (cURL)
```php
// Получение брендов с изображениями
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://example.com/api/catalog?iblock_id=21&action=brands&image_resize=150x150");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization-Token: ' . $token,
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$data = json_decode($response, true);
curl_close($ch);
```

---

