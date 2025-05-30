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

### `GET /api/brands`

Получение брендов из каталога с расширенной информацией и гибкими настройками вывода.

#### 🔐 Безопасность
- **Аутентификация**: Не требуется
- **Тип токена**: Bearer (опционально)
- **Проверка истечения**: Да

#### 📋 Основные параметры

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| `iblock_id` | integer | ✅ | ID инфоблока каталога |
| `brand_property` | string | ❌ | Код свойства бренда (по умолчанию: BRAND) |
| `section_id` | integer | ❌ | Фильтр по разделу |
| `include_subsections` | string | ❌ | `Y`/`N` - включить подразделы |
| `active_only` | string | ❌ | `Y`/`N` - только активные элементы |

#### 📊 Данные о товарах

| Параметр | Тип | Возможные значения | Описание |
|----------|-----|-------------------|----------|
| `with_product_count` | string | `Y`, `N` | Добавить количество товаров по бренду |
| `with_products` | string | `Y`, `N` | Добавить список товаров бренда |
| `products_limit` | integer | 1-100 | Лимит товаров в списке (по умолчанию: 10) |

#### ⚙️ Настройки вывода

| Параметр | Тип | Возможные значения | Описание |
|----------|-----|-------------------|----------|
| `format` | string | `full`, `compact`, `minimal` | Формат ответа |
| `with_brand_details` | string | `Y`, `N` | Включить детальную информацию о бренде |
| `with_seo` | string | `Y`, `N` | Включить SEO-данные |
| `sort` | string | `field:direction` | Сортировка (например: `name:asc`, `id:desc`) |
| `exclude_fields` | array | названия полей | Исключить поля из ответа |
| `fields_only` | array | названия полей | Оставить только указанные поля |

### 📤 Примеры запросов

#### Получение всех брендов с подсчетом товаров
```bash
GET /api/brands?iblock_id=21&with_product_count=Y
```

#### Получение брендов из конкретного раздела
```bash
GET /api/brands?iblock_id=21&section_id=15&include_subsections=Y
```

#### Минимальный формат для списков
```bash
GET /api/brands?iblock_id=21&format=minimal&sort=name:asc
```

#### Полная информация с товарами и SEO
```bash
GET /api/brands?iblock_id=21&format=full&with_products=Y&with_seo=Y&products_limit=5
```

#### Исключение определенных полей
```bash
GET /api/brands?iblock_id=21&exclude_fields[]=details&exclude_fields[]=seo
```

### 📄 Структура ответа

#### Полный формат (`format=full`)
```json
{
  "meta": {
    "iblock_id": 21,
    "section_id": 15,
    "brand_property": "BRAND",
    "include_subsections": true,
    "format": "full",
    "total_brands": 16,
    "request_time": "2025-01-15 10:30:45"
  },
  "data": [
    {
      "id": "123",
      "name": "Amadini Ghost",
      "code": "amadini-ghost",
      "details": {
        "property_type": "L",
        "property_id": "45",
        "sort": 500,
        "enum_id": "123",
        "enum_xml_id": "AMADINI_GHOST",
        "enum_sort": 100
      },
      "product_count": 15,
      "products": [
        {
          "id": "1001",
          "name": "Amadini Ghost Pro",
          "code": "amadini-ghost-pro",
          "url": "/catalog/phones/amadini-ghost-pro/"
        },
        {
          "id": "1002",
          "name": "Amadini Ghost Lite",
          "code": "amadini-ghost-lite", 
          "url": "/catalog/phones/amadini-ghost-lite/"
        }
      ],
      "seo": {
        "title": "Amadini Ghost",
        "description": "Товары бренда Amadini Ghost",
        "keywords": "Amadini Ghost",
        "h1": "Amadini Ghost"
      }
    }
  ]
}
```

#### Компактный формат (`format=compact`)
```json
{
  "meta": {
    "iblock_id": 21,
    "format": "compact",
    "total_brands": 16,
    "request_time": "2025-01-15 10:30:45"
  },
  "data": [
    {
      "id": "123",
      "name": "Amadini Ghost",
      "code": "amadini-ghost",
      "product_count": 15
    }
  ]
}
```

#### Минимальный формат (`format=minimal`)
```json
{
  "meta": {
    "iblock_id": 21,
    "format": "minimal",
    "total_brands": 16,
    "request_time": "2025-01-15 10:30:45"
  },
  "data": [
    {
      "id": "123",
      "name": "Amadini Ghost"
    }
  ]
}
```

### 🔧 Детальное описание полей ответа

#### Основные поля бренда
- **id**: Уникальный идентификатор бренда (ID значения свойства)
- **name**: Название бренда
- **code**: Символьный код бренда (автоматически генерируется)

#### Блок details (при `with_brand_details=Y`)
- **property_type**: Тип свойства (L - список, S - строка, E - элемент)
- **property_id**: ID свойства в инфоблоке
- **sort**: Сортировка свойства
- **enum_id**: ID значения списка (для типа L)
- **enum_xml_id**: XML_ID значения списка
- **enum_sort**: Сортировка значения списка

#### Блок products (при `with_products=Y`)
Массив товаров бренда с полями:
- **id**: ID товара
- **name**: Название товара
- **code**: Символьный код товара
- **url**: URL детальной страницы

#### Блок seo (при `with_seo=Y`)
- **title**: SEO заголовок
- **description**: SEO описание
- **keywords**: Ключевые слова
- **h1**: Заголовок H1

### ⚡ Оптимизация производительности

#### Рекомендации:
1. **Используйте пагинацию** при большом количестве брендов
2. **Ограничивайте products_limit** для избежания больших ответов
3. **Применяйте фильтры** для уменьшения объема данных
4. **Используйте кеширование** на стороне клиента

#### Примеры оптимизированных запросов:
```bash
# Быстрый запрос для автодополнения
GET /api/brands?iblock_id=21&format=minimal&fields_only[]=id&fields_only[]=name

# Эффективный запрос с фильтрацией
GET /api/brands?iblock_id=21&section_id=15&active_only=Y&format=compact
```

### 🚨 Обработка ошибок

| Код | Описание | Решение |
|-----|----------|---------|
| 400 | Неверный iblock_id | Проверьте корректность ID инфоблока |
| 400 | Неверный format | Используйте: full, compact, minimal |
| 403 | Native routes отключены | Включите useNativeRoute в конфигурации |
| 500 | Модуль iblock недоступен | Проверьте установку модуля |

### 📞 Примеры использования в коде

#### JavaScript (Fetch API)
```javascript
// Получение брендов для селекта
const brands = await fetch('/api/brands?iblock_id=21&format=minimal')
  .then(r => r.json());

// Получение брендов раздела с товарами
const sectionBrands = await fetch(
  '/api/brands?iblock_id=21&section_id=15&with_products=Y&products_limit=3'
).then(r => r.json());
```

#### PHP (cURL)
```php
// Получение полной информации о брендах
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://example.com/api/brands?iblock_id=21&format=full&with_brand_details=Y");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $token,
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$data = json_decode($response, true);
curl_close($ch);
```

---

