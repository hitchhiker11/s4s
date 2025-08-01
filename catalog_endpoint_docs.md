# 📚 Документация API каталога товаров

## Оглавление
1. [Описание](#описание)
2. [Базовая информация](#базовая-информация)
3. [Аутентификация](#аутентификация)
4. [Основные параметры](#основные-параметры)
5. [Пагинация](#пагинация)
6. [Сортировка и выборка](#сортировка-и-выборка)
7. [Продвинутое исключение полей](#продвинутое-исключение-полей)
8. [Фильтрация по статусам](#фильтрация-по-статусам)
9. [Фильтрация по полям](#фильтрация-по-полям)
10. [Фильтрация по свойствам](#фильтрация-по-свойствам)
11. [Фильтрация по ценам](#фильтрация-по-ценам)
12. [Форматы ответа](#форматы-ответа)
13. [Опции вывода](#опции-вывода)
14. [Примеры запросов](#примеры-запросов)
15. [Коды ошибок](#коды-ошибок)
16. [Лимиты и ограничения](#лимиты-и-ограничения)

## Описание

REST API для получения элементов каталога товаров 1С Битрикс с расширенными возможностями фильтрации, поиска и форматирования ответов. API также поддерживает получение списка брендов из каталога.

**Основные Endpoints:**
- `GET /api/catalog` - получение товаров каталога
- `GET /api/catalog?action=brands` - получение списка брендов

## Базовая информация

- **URL:** `https://yourdomain.com/api/catalog`
- **Метод:** `GET`
- **Формат ответа:** `JSON`
- **Кодировка:** `UTF-8`
- **Максимальное количество элементов за запрос:** `100`
- **Значение по умолчанию для лимита:** `10`

## Аутентификация

API требует обязательной JWT-аутентификации.

### Заголовки запроса
```http
Authorization-Token: your-jwt-token-here
Content-Type: application/json
```

### Пример cURL
```bash
curl -X GET "https://yourdomain.com/api/catalog?iblock_id=21" \
  -H "Authorization-Token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
```

## Основные параметры

### `iblock_id` (обязательный)
- **Тип:** `integer`
- **Описание:** ID инфоблока каталога
- **Пример:** `iblock_id=21`

### `section_id`
- **Тип:** `integer`
- **Описание:** ID раздела для фильтрации по конкретному разделу
- **Пример:** `section_id=156`

### `category`
- **Тип:** `integer`
- **Описание:** Порядковый номер категории (раздела) первого уровня
- **Пример:** `category=3`
- **Примечание:** Нумерация начинается с 1. Используется альтернативно с `section_id`

### `include_subsections`
- **Тип:** `string`
- **Возможные значения:** `Y`, `N`
- **По умолчанию:** `N`
- **Описание:** Включить подразделы при фильтрации по разделу
- **Пример:** `section_id=156&include_subsections=Y`

## Расширенная фильтрация по разделам

### `deep_subsections`
- **Тип:** `string`
- **Возможные значения:** `Y`, `N`
- **По умолчанию:** `N`
- **Описание:** Глубокий поиск по всем вложенным подразделам (включая подподкатегории)
- **Приоритет:** Имеет приоритет над `include_subsections`

### Режимы работы с разделами

| Параметры | Режим | Описание | Применение |
|-----------|-------|----------|------------|
| `section_id=150` | **Точный** | Товары только из раздела 150 | Товары конкретной подкатегории |
| `section_id=150&include_subsections=Y` | **Подразделы** | Товары из раздела 150 + его подразделы первого уровня | Категория + прямые подкатегории |
| `section_id=150&deep_subsections=Y` | **Глубокий** | Все товары из раздела 150 и всех вложенных подразделов | Вся ветка категорий |

### Примеры расширенной фильтрации по разделам

```bash
# Товары только из конкретной подкатегории (стандартное поведение)
GET /catalog?iblock_id=21&section_id=420

# Товары из категории + ее прямые подкатегории
GET /catalog?iblock_id=21&section_id=420&include_subsections=Y

# Все товары из категории и всех вложенных подподкатегорий (НОВОЕ)
GET /catalog?iblock_id=21&section_id=420&deep_subsections=Y

# Комбинация с другими фильтрами
GET /catalog?iblock_id=21&section_id=420&deep_subsections=Y&in_stock=Y&price_from=1000
```

### Структура meta с информацией о разделах

При использовании `include_subsections=Y` или `deep_subsections=Y` в meta добавляется раздел `section_info`:

```json
{
  "meta": {
    "section_id": 420,
    "include_subsections": false,
    "deep_subsections": true,
    "section_info": {
      "main_section": {
        "id": 420,
        "name": "Электроника", 
        "code": "electronics",
        "depth_level": 1
      },
      "mode": "deep",
      "included_sections_count": 15,
      "subsection_ids": [420, 421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434]
    },
    "filter_applied": {
      "section_filter": true,
      "subsections_included": true
    }
  }
}
```

> **💡 Применение:** Используйте `deep_subsections=Y` для получения всех товаров родительских категорий, включая товары из всех дочерних разделов любой вложенности. Это решает проблему отображения товаров при просмотре родительских категорий каталога.

## Пагинация

### `limit`
- **Тип:** `integer`
- **Диапазон:** `1-100`
- **По умолчанию:** `10`
- **Описание:** Количество элементов на странице
- **Пример:** `limit=25`

### `page`
- **Тип:** `integer`
- **Минимум:** `1`
- **По умолчанию:** `1`
- **Описание:** Номер страницы для пагинации
- **Пример:** `page=3`

### Пример пагинации
```
# Получить элементы 21-30 (3 страница по 10 элементов)
GET /catalog?iblock_id=21&page=3&limit=10

# Получить элементы 51-100 (2 страница по 50 элементов)
GET /catalog?iblock_id=21&page=2&limit=50
```

## Сортировка и выборка

### `sort`
- **Тип:** `string`
- **Описание:** Сортировка в формате `поле:направление`
- **Направления:** `asc`, `desc`
- **Множественная сортировка:** разделяется запятыми

#### Поддерживаемые поля сортировки:
- `id` → `ID`
- `name` → `NAME`
- `price` → `CATALOG_PRICE_1`
- `sort` → `SORT`
- `date_create` → `DATE_CREATE`
- `timestamp_x` → `TIMESTAMP_X`

#### Примеры сортировки:
```
# По возрастанию цены
sort=price:asc

# По убыванию названия
sort=name:desc

# Множественная сортировка: сначала по цене (возр.), потом по названию (убыв.)
sort=price:asc,name:desc

# По дате создания и ID
sort=date_create:desc,id:asc
```

### `select`
- **Тип:** `array`
- **Описание:** Дополнительные поля для выборки из инфоблока
- **Базовые поля:** `ID`, `IBLOCK_ID`, `NAME`, `DATE_ACTIVE_FROM`, `DETAIL_PAGE_URL`

#### Часто используемые поля:
```
# Добавить описания
select[]=PREVIEW_TEXT&select[]=DETAIL_TEXT

# Добавить изображения и код
select[]=PREVIEW_PICTURE&select[]=DETAIL_PICTURE&select[]=CODE

# Добавить SEO поля
select[]=META_TITLE&select[]=META_DESCRIPTION&select[]=META_KEYWORDS
```

### `exclude` (базовое исключение)
- **Тип:** `array`
- **Описание:** Исключить разделы из ответа
- **Возможные значения:** `fields`, `properties`, `prices`

#### Примеры базового исключения:
```
# Исключить свойства из ответа
exclude[]=properties

# Исключить цены и поля
exclude[]=prices&exclude[]=fields

# Только базовая информация
exclude[]=properties&exclude[]=prices
```

### `fields_only`
- **Тип:** `array`
- **Описание:** Оставить только указанные поля в разделе `fields`

```
# Только название и цена
fields_only[]=NAME&fields_only[]=PRICE

# Только ID, название, код
fields_only[]=ID&fields_only[]=NAME&fields_only[]=CODE
```

### `properties_only`
- **Тип:** `array`
- **Описание:** Оставить только указанные свойства в разделе `properties`

```
# Только артикул и бренд
properties_only[]=ARTICLE&properties_only[]=BRAND

# Только цена и наличие
properties_only[]=PRICE&properties_only[]=EXIST
```

## Продвинутое исключение полей

### `exclude_fields`
- **Тип:** `array` 
- **Описание:** Исключить конкретные поля из раздела `fields`
- **Пример:** `exclude_fields[]=LANG_DIR&exclude_fields[]=LID&exclude_fields[]=EXTERNAL_ID`

### `exclude_properties`
- **Тип:** `array`
- **Описание:** Исключить конкретные свойства из раздела `properties`
- **Пример:** `exclude_properties[]=CML2_BAR_CODE&exclude_properties[]=CML2_TAXES`

### `exclude_empty_properties`
- **Тип:** `string`
- **Возможные значения:** `Y`, `N`
- **По умолчанию:** `N`
- **Описание:** Исключить пустые свойства (VALUE = false, "", null или пустой массив)

### `exclude_system_properties`
- **Тип:** `string`
- **Возможные значения:** `Y`, `N`
- **По умолчанию:** `N`
- **Описание:** Исключить системные свойства с префиксом `CML2_`

### `properties_pattern_exclude`
- **Тип:** `string`
- **Описание:** Регулярное выражение для исключения свойств по паттерну
- **Пример:** `properties_pattern_exclude=^CML2_` (исключит все свойства начинающиеся с CML2_)

### `fields_pattern_exclude`
- **Тип:** `string`
- **Описание:** Регулярное выражение для исключения полей по паттерну
- **Пример:** `fields_pattern_exclude=IBLOCK` (исключит поля содержащие IBLOCK)

#### Примеры продвинутого исключения:
```bash
# Исключить конкретные поля
GET /catalog?iblock_id=21&exclude_fields[]=LANG_DIR&exclude_fields[]=LID&exclude_fields[]=SORT

# Исключить системные и пустые свойства
GET /catalog?iblock_id=21&exclude_system_properties=Y&exclude_empty_properties=Y

# Исключить свойства по паттерну (все CML2_* и NOVINKA)
GET /catalog?iblock_id=21&properties_pattern_exclude=^(CML2_|NOVINKA)

# Исключить поля содержащие IBLOCK
GET /catalog?iblock_id=21&fields_pattern_exclude=IBLOCK

# Комплексное исключение
GET /catalog?iblock_id=21&exclude_system_properties=Y&exclude_empty_properties=Y&exclude_fields[]=EXTERNAL_ID&exclude_properties[]=MORE_PHOTO&exclude_properties[]=FILES

# Оставить только нужные свойства исключив остальные
GET /catalog?iblock_id=21&exclude_system_properties=Y&properties_only[]=BRAND&properties_only[]=ARTICLE&properties_only[]=PRICE
```

#### Приоритет применения исключений:
1. **exclude_fields / exclude_properties** - конкретные поля/свойства
2. **exclude_system_properties** - системные свойства (CML2_*)  
3. **exclude_empty_properties** - пустые свойства
4. **properties_pattern_exclude / fields_pattern_exclude** - по регулярному выражению
5. **properties_only / fields_only** - финальная фильтрация (оставить только указанные)

## Фильтрация по статусам

### `active`
- **Возможные значения:** `Y`, `N`, `all`
- **По умолчанию:** `Y`
- **Описание:** Активность элементов

### `available`
- **Возможные значения:** `Y`, `N`
- **Описание:** Доступность для покупки (из модуля каталога)

### `in_stock`
- **Возможные значения:** `Y`, `N`
- **Описание:** Наличие на складе (количество > 0)

### `has_price`
- **Возможные значения:** `Y`, `N`
- **Описание:** Наличие цены (базовая цена > 0)

### `has_photos`
- **Возможные значения:** `Y`, `N`
- **Описание:** Наличие фотографий (свойство MORE_PHOTO заполнено)

#### Примеры фильтрации по статусам:
```
# Только активные товары в наличии с ценой
active=Y&in_stock=Y&has_price=Y

# Все товары (включая неактивные) с фотографиями
active=all&has_photos=Y

# Недоступные для покупки товары
available=N
```

## Фильтрация по полям

### `name`
- **Тип:** `string`
- **Описание:** Поиск по названию (LIKE %значение%)
- **Пример:** `name=iPhone` (найдет "iPhone 12", "Apple iPhone", "Чехол для iPhone")

### `code`
- **Тип:** `string`
- **Описание:** Точное совпадение символьного кода
- **Пример:** `code=iphone-12-pro`

### `external_id`
- **Тип:** `string`
- **Описание:** Точное совпадение внешнего ID
- **Пример:** `external_id=GUID-12345`

### Фильтры по датам

#### `date_from` / `date_to`
- **Тип:** `string`
- **Формат:** `YYYY-MM-DD`
- **Описание:** Фильтр по дате создания элемента

```
# Товары созданные в марте 2024
date_from=2024-03-01&date_to=2024-03-31

# Товары созданные после 1 января 2024
date_from=2024-01-01
```

#### `modified_from` / `modified_to`
- **Тип:** `string`
- **Формат:** `YYYY-MM-DD HH:MM:SS`
- **Описание:** Фильтр по дате изменения элемента

```
# Товары измененные за последние сутки
modified_from=2024-04-30 00:00:00

# Товары измененные в определенный период
modified_from=2024-04-01 09:00:00&modified_to=2024-04-30 18:00:00
```

## Фильтрация по свойствам

### `property[КОД_СВОЙСТВА]`
- **Тип:** `array`
- **Описание:** Точное совпадение значения свойства

### `property_like[КОД_СВОЙСТВА]`
- **Тип:** `array`
- **Описание:** Поиск по свойству с LIKE %значение%

### `property_range[КОД_СВОЙСТВА][from/to]`
- **Тип:** `array`
- **Описание:** Диапазон для числовых свойств

### Фильтрация по брендам

#### Новый способ (по ID бренда) - Рекомендуется

**`brand_id`**
- **Тип:** `integer`
- **Описание:** ID бренда из инфоблока брендов для точной фильтрации
- **Пример:** `brand_id=8340`

**`brand_category`**
- **Тип:** `integer`
- **Описание:** Порядковый номер бренда в списке брендов
- **Пример:** `brand_category=5`

**Параметры для работы с подбрендами:**
- `include_subbrands=Y` - включить подбренды первого уровня
- `deep_subbrands=Y` - глубокий поиск по всем подбрендам

#### Старый способ (по названию бренда)

**`brand`**
- **Тип:** `string|array`
- **Описание:** Фильтр по названию бренда (старый способ)
- **Приоритет:** Работает только если не указан `brand_id`

```bash
# НОВЫЙ СПОСОБ - по ID бренда (рекомендуется)
GET /catalog?iblock_id=21&brand_id=8340

# Несколько товаров конкретного бренда
GET /catalog?iblock_id=21&brand_id=8340&limit=20

# Комбинация бренда с разделом
GET /catalog?iblock_id=21&section_id=420&brand_id=8340&in_stock=Y

# СТАРЫЙ СПОСОБ - по названию бренда
GET /catalog?iblock_id=21&brand=Glock

# Несколько брендов по названию
GET /catalog?iblock_id=21&brand[]=Glock&brand[]=Apple&brand[]=Samsung
```

> **💡 Совет:** Используйте новый способ `brand_id` для точной фильтрации по брендам. Он работает быстрее и исключает проблемы с регистром и дубликатами названий.

#### Примеры фильтрации по свойствам:

```
# Товары определенного бренда
property[BRAND]=Apple

# Поиск брендов, содержащих "Sam"
property_like[BRAND]=Sam

# Товары с определенным артикулом
property[ARTICLE]=ABC-123

# Диапазон цен через свойство PRICE
property_range[PRICE][from]=1000&property_range[PRICE][to]=5000

# Определенный цвет и размер
property[COLOR]=red&property[SIZE]=XL

# Новинки определенной категории
property[ISNEW]=Y&property[CATEGORY]=smartphones
```

#### Множественные значения:
```
# Несколько брендов
property[BRAND][]=Apple&property[BRAND][]=Samsung

# Несколько цветов
property[COLOR][]=red&property[COLOR][]=blue&property[COLOR][]=green
```

## Фильтрация по ценам

### `price_from` / `price_to`
- **Тип:** `float`
- **Описание:** Диапазон цен из каталога

### `price_type`
- **Тип:** `integer`
- **По умолчанию:** `1`
- **Описание:** ID типа цены для фильтрации

### `currency`
- **Тип:** `string`
- **Возможные значения:** `RUB`, `USD`, `EUR`
- **По умолчанию:** `RUB`
- **Описание:** Валюта для фильтрации цен

#### Примеры фильтрации по ценам:
```
# Товары от 1000 до 5000 рублей
price_from=1000&price_to=5000

# Товары дороже 10000 рублей
price_from=10000

# Товары дешевле 500 рублей
price_to=500

# По определенному типу цен
price_from=100&price_to=1000&price_type=2

# В долларах
price_from=10&price_to=100&currency=USD
```

## Форматы ответа

### `format`
- **Возможные значения:** `full`, `compact`, `minimal`
- **По умолчанию:** `full`

#### `full` (по умолчанию)
Полная структура с разделами `fields`, `properties`, `prices`:

```json
{
  "meta": {...},
  "data": [
    {
      "id": "123",
      "name": "Товар",
      "fields": {...},
      "properties": {...},
      "prices": [...]
    }
  ]
}
```

#### `compact`
Компактная структура с разделом `items` вместо `data`:

```json
{
  "meta": {...},
  "items": [
    {
      "id": "123",
      "name": "Товар",
      "fields": {...},
      "properties": {...},
      "prices": [...]
    }
  ]
}
```

#### `minimal`
Минимальная структура - поля выводятся на верхний уровень элемента:

```json
{
  "meta": {...},
  "data": [
    {
      "id": "123",
      "name": "Товар",
      "ID": "123",
      "NAME": "Товар",
      "PRICE": "1000"
    }
  ]
}
```

## Опции вывода

### `with_seo`
- **Возможные значения:** `Y`, `N`
- **По умолчанию:** `N`
- **Описание:** Добавить SEO-данные элементов

```json
"seo": {
  "meta_title": "SEO заголовок",
  "meta_description": "SEO описание",
  "meta_keywords": "ключевые, слова"
}
```

### `with_sections`
- **Возможные значения:** `Y`, `N`
- **По умолчанию:** `N`
- **Описание:** Добавить информацию о разделах элемента

```json
"sections": {
  "id": "156",
  "name": "Смартфоны",
  "code": "smartphones",
  "section_page_url": "/catalog/smartphones/"
}
```

### `image_resize`
- **Тип:** `string`
- **Формат:** `ШИРИНАxВЫСОТА` или `ШИРИНАxВЫСОТАТИП`
- **Описание:** Автоматический ресайз изображений

#### Поддерживаемые типы ресайза:
- Без указания типа - пропорциональный ресайз
- `BX_RESIZE_IMAGE_EXACT` - точные размеры
- `BX_RESIZE_IMAGE_PROPORTIONAL` - пропорциональный (по умолчанию)

```
# Ресайз до 300x300 пропорционально
image_resize=300x300

# Точный размер 200x200
image_resize=200x200BX_RESIZE_IMAGE_EXACT
```

## Примеры запросов

### Базовые запросы

```bash
# Простой список товаров
GET /catalog?iblock_id=21

# Первые 20 товаров
GET /catalog?iblock_id=21&limit=20

# Товары из раздела 156
GET /catalog?iblock_id=21&section_id=156

# Третья категория с подразделами
GET /catalog?iblock_id=21&category=3&include_subsections=Y
```

### Продвинутые запросы с исключениями

```bash
# Исключить системные поля и свойства
GET /catalog?iblock_id=21&exclude_system_properties=Y&exclude_fields[]=LANG_DIR&exclude_fields[]=LID

# Только нужные свойства без пустых
GET /catalog?iblock_id=21&properties_only[]=BRAND&properties_only[]=ARTICLE&exclude_empty_properties=Y

# Исключить все CML2_ свойства и файловые свойства  
GET /catalog?iblock_id=21&properties_pattern_exclude=^(CML2_|MORE_PHOTO|FILES)

# Чистый ответ только с важными данными
GET /catalog?iblock_id=21&exclude_system_properties=Y&exclude_empty_properties=Y&exclude_fields[]=EXTERNAL_ID&exclude_fields[]=SORT&exclude_fields[]=IBLOCK_TYPE_ID&exclude_fields[]=IBLOCK_EXTERNAL_ID

# Минимальная структура для каталога
GET /catalog?iblock_id=21&format=minimal&fields_only[]=NAME&fields_only[]=CODE&properties_only[]=ARTICLE&properties_only[]=PRICE
```

### Комплексные запросы

```bash
# Максимально детальный запрос с новой фильтрацией по брендам
GET /catalog?iblock_id=21&section_id=156&include_subsections=Y&brand_id=8340&active=Y&in_stock=Y&has_price=Y&price_from=1000&price_to=10000&property[COLOR]=red&sort=price:asc,name:desc&select[]=PREVIEW_TEXT&select[]=DETAIL_TEXT&with_seo=Y&with_sections=Y&image_resize=400x400&limit=25&page=2&format=full

# Товары бренда из глубокого дерева разделов
GET /catalog?iblock_id=21&section_id=156&deep_subsections=Y&brand_id=8340&in_stock=Y

# Оптимизированный запрос для фронтенда с брендами
GET /catalog?iblock_id=21&exclude_system_properties=Y&exclude_empty_properties=Y&exclude_fields[]=LANG_DIR&exclude_fields[]=LID&exclude_fields[]=EXTERNAL_ID&properties_only[]=BRAND_ELEMENT&properties_only[]=ARTICLE&properties_only[]=PRICE&image_resize=300x300&format=compact

# API для мобильного приложения (минимум данных)
GET /catalog?iblock_id=21&format=minimal&fields_only[]=NAME&properties_only[]=PRICE&properties_only[]=ARTICLE&exclude[]=prices&limit=50

# Получение списка всех брендов
GET /catalog?iblock_id=21&action=brands&with_products_count=Y&image_resize=150x150

# Получение брендов с товарами и описаниями
GET /catalog?iblock_id=21&action=brands&with_products=Y&with_products_count=Y&with_properties=Y&search=glock
```

## Структура ответа с исключениями

### Пример с исключенными полями
```json
{
  "meta": {
    "iblock_id": 21,
    "section_id": 482,
    "page": 1,
    "limit": 10,
    "total_count": 4,
    "total_pages": 1,
    "current_count": 4,
    "format": "full",
    "request_time": "2025-05-27 19:19:40"
  },
  "data": [
    {
      "id": "6657",
      "name": "Коврик Tekmat для чистки CZ SH2",
      "fields": {
        "ID": "6657",
        "IBLOCK_ID": "21",
        "NAME": "Коврик Tekmat для чистки CZ SH2",
        "DATE_ACTIVE_FROM": null,
        "DETAIL_PAGE_URL": "/detail/kovrik_tekmat_dlya_chistki_cz_sh2/",
        "SORT": "400",
        "CODE": "kovrik_tekmat_dlya_chistki_cz_sh2",
        "IBLOCK_SECTION_ID": "482"
        // Исключены: LANG_DIR, LID, EXTERNAL_ID, IBLOCK_TYPE_ID и др.
      },
      "properties": {
        "BRAND": {
          "NAME": "Бренд",
          "CODE": "BRAND",
          "VALUE": "Amadini Ghost",
          "DESCRIPTION": "",
          "PROPERTY_TYPE": "S"
        },
        "ARTICLE": {
          "NAME": "Артикул",
          "CODE": "ARTICLE",
          "VALUE": "71-000139",
          "DESCRIPTION": "",
          "PROPERTY_TYPE": "S"
        }
        // Исключены: CML2_* свойства, пустые свойства
      },
      "prices": [
        {
          "price_type_id": "1",
          "price_type_name": "Базовая",
          "price": 3300,
          "currency": "RUB",
          "base": true
        }
      ]
    }
  ]
}
```

### Мета-информация

| Поле | Описание |
|------|----------|
| `iblock_id` | ID инфоблока |
| `brands_iblock_id` | ID инфоблока брендов |
| `section_id` | ID раздела (если указан) |
| `brand_id` | ID бренда (если указан) |
| `page` | Текущая страница |
| `limit` | Лимит элементов на странице |
| `total_count` | Общее количество найденных элементов |
| `total_pages` | Общее количество страниц |
| `current_count` | Количество элементов в текущем ответе |
| `format` | Формат ответа |
| `request_time` | Время выполнения запроса |

## Получение списка брендов

### `GET /api/catalog?action=brands`

Получение списка всех брендов из каталога с дополнительной информацией и настройками фильтрации.

#### Основные параметры для брендов

| Параметр | Тип | Описание |
|----------|-----|----------|
| `action` | string | **brands** - обязательный параметр для получения брендов |
| `iblock_id` | integer | ID инфоблока каталога (обязательный) |
| `brands_iblock_id` | integer | ID инфоблока брендов (по умолчанию: 22) |

#### Параметры фильтрации брендов

| Параметр | Тип | Возможные значения | Описание |
|----------|-----|-------------------|----------|
| `search` | string | любая строка | Поиск брендов по названию |
| `with_products` | string | `Y`, `N` | Показать только бренды с товарами |
| `with_products_count` | string | `Y`, `N` | Включить подсчет товаров для каждого бренда |
| `with_properties` | string | `Y`, `N` | Включить свойства брендов |
| `sort` | string | `name:asc`, `sort:asc` | Сортировка брендов |
| `image_resize` | string | `300x300` | Ресайз изображений брендов |

#### Примеры запросов брендов

```bash
# Получение всех брендов с подсчетом товаров
GET /catalog?iblock_id=21&action=brands&with_products_count=Y

# Поиск брендов с товарами и изображениями
GET /catalog?iblock_id=21&action=brands&search=glock&with_products=Y&image_resize=150x150

# Бренды с полной информацией и свойствами
GET /catalog?iblock_id=21&action=brands&with_products_count=Y&with_properties=Y&sort=name:asc
```

#### Структура ответа для брендов

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
        "alt": "GLOCK",
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
        "height": 600
      },
      "date_create": "2024-01-15 10:00:00",
      "date_modified": "2024-12-20 15:30:00",
      "products_count": 96
    }
  ]
}
```

### Интеграция брендов с товарами

При получении товаров с фильтрацией по брендам в мета-информации добавляется блок `brand_info`:

```json
{
  "meta": {
    "brand_id": 8340,
    "brand_info": {
      "main_brand": {
        "id": 8340,
        "name": "GLOCK",
        "code": "glock",
        "preview_picture": {...},
        "detail_picture": {...},
        "preview_text": "Австрийский производитель пистолетов",
        "detail_text": "GLOCK - ведущий производитель..."
      },
      "mode": "exact",
      "included_brands_count": 1
    }
  }
}
```

## Коды ошибок

| Код | Описание | Пример ответа |
|-----|----------|---------------|
| `400` | Неверные параметры запроса | `{"error": "Invalid iblock_id parameter"}` |
| `401` | Неавторизован | `{"error": "Invalid token"}` |
| `403` | Доступ запрещен | `{"error": "Native routes disabled"}` |
| `404` | Инфоблок не найден | `{"error": "IBlock not found or inactive"}` |
| `500` | Внутренняя ошибка сервера | `{"error": "Internal server error"}` |

### Типичные ошибки

#### Отсутствует обязательный параметр
```json
{
  "error": "Invalid iblock_id parameter"
}
```

#### Неверный формат
```json
{
  "error": "Invalid format parameter"  
}
```

#### Неверная страница
```json
{
  "error": "Page parameter must be greater than 0"
}
```

## Лимиты и ограничения

### Лимиты запросов
- **Максимальный лимит элементов:** 100
- **Максимальная глубина вложенности фильтров:** 3 уровня
- **Максимальная длина строки поиска:** 255 символов

### Рекомендации по производительности

1. **Используйте пагинацию:** Не запрашивайте больше элементов, чем нужно
2. **Фильтруйте на сервере:** Используйте фильтры вместо обработки на клиенте  
3. **Исключайте ненужные данные:** Активно используйте параметры исключения
4. **Кешируйте запросы:** Дублированные запросы можно кешировать на клиенте

### Оптимальные практики

```bash
# ❌ Неоптимально - запрос всех данных
GET /catalog?iblock_id=21&limit=100

# ✅ Оптимально - только нужные данные с исключениями
GET /catalog?iblock_id=21&limit=20&exclude_system_properties=Y&exclude_empty_properties=Y&properties_only[]=BRAND&properties_only[]=ARTICLE

# ❌ Неоптимально - обработка лишних полей на клиенте
GET /catalog?iblock_id=21&limit=50
# затем фильтрация ненужных полей в JavaScript

# ✅ Оптимально - исключение на сервере
GET /catalog?iblock_id=21&exclude_fields[]=LANG_DIR&exclude_fields[]=LID&properties_pattern_exclude=^CML2_&limit=50

# ✅ Супер-оптимально - минимальный набор для конкретной задачи
GET /catalog?iblock_id=21&format=minimal&fields_only[]=NAME&properties_only[]=PRICE&limit=20
```

### Мониторинг и отладка

API логирует все ошибки в файл `/local/logs/rest_api.log`. При возникновении проблем проверьте лог-файл для получения детальной информации об ошибках.

---

💡 **Совет:** Используйте продвинутые возможности исключения полей для получения минимального объема данных, необходимого для вашей задачи. Это значительно ускорит работу API и снизит нагрузку на сеть.

🚀 **Pro-tip:** Комбинируйте `exclude_system_properties=Y`, `exclude_empty_properties=Y` и `properties_only[]` для получения максимально чистого ответа API.
