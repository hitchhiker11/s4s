# 📋 API: Получение единичного товара

## 🎯 Endpoint
```http
GET /api/catalog_item
``` 

## 📥 Обязательные параметры 
| Параметр | Тип | Описание |
|----------|-----|----------|
| `iblock_id` | integer | ID инфоблока каталога |
| `id` или `code` | integer/string | ID товара **ИЛИ** его символьный код |

## ⚙️ Основные параметры
| Параметр | Значения | Описание |
|----------|----------|----------|
| `format` | `full`, `compact`, `minimal` | Формат ответа |
| `with_images` | `Y`, `N` | Включить изображения |
| `with_seo` | `Y`, `N` | SEO-данные |
| `with_sections` | `Y`, `N` | Информация о разделах |

## 🔧 Дополнительные данные
| Параметр | Описание |
|----------|----------|
| `with_offers` | Торговые предложения (SKU) |
| `with_related` | Похожие товары |
| `with_reviews` | Отзывы о товаре |
| `with_availability` | Детальная информация о наличии |
| `with_similar` | Товары из того же раздела |

## 🖼️ Параметры изображений
| Параметр | Пример | Описание |
|----------|---------|----------|
| `image_resize` | `300x300` | Одиночный размер |
| `image_sizes[]` | `150x150`, `600x600` | Множественные размеры |

## 🚫 Исключения
| Параметр | Пример | Описание |
|----------|---------|----------|
| `exclude[]` | `fields`, `properties` | Исключить разделы |
| `exclude_fields[]` | `LANG_DIR`, `LID` | Конкретные поля |
| `exclude_properties[]` | `CML2_BAR_CODE` | Конкретные свойства |
| `exclude_empty_properties` | `Y` | Пустые свойства |
| `exclude_system_properties` | `Y` | Системные свойства |

## 📤 Примеры запросов

### Базовый запрос по ID
```http
GET /api/catalog_item?iblock_id=21&id=1234
```

### По символьному коду
```http
GET /api/catalog_item?iblock_id=21&code=iphone-15-pro
```

### С дополнительными данными
```http
GET /api/catalog_item?iblock_id=21&id=1234&with_offers=Y&with_related=Y&with_availability=Y
```

### С кастомными размерами изображений
```http
GET /api/catalog_item?iblock_id=21&id=1234&image_sizes[]=150x150&image_sizes[]=600x600
```

### Минимальный ответ без лишних данных
```http
GET /api/catalog_item?iblock_id=21&id=1234&format=minimal&exclude[]=properties&exclude_system_properties=Y
```

## 📋 Структура ответа
```json
{
  "meta": {
    "iblock_id": 21,
    "element_id": 1234,
    "format": "full",
    "additional_data": {
      "with_offers": true,
      "with_related": false
    }
  },
  "data": {
    "id": 1234,
    "name": "iPhone 15 Pro",
    "fields": { /* поля элемента */ },
    "properties": { /* свойства */ },
    "images": {
      "preview": { /* превью */ },
      "detail": { /* детальное */ },
      "gallery": [ /* галерея */ ],
      "all": [ /* все изображения */ ]
    },
    "prices": [ /* цены */ ],
    "offers": [ /* торг.предложения */ ],
    "availability": { /* наличие */ },
    "related": [ /* похожие */ ]
  }
}
```

## ⚠️ Коды ошибок
- `400` - Не указан ID или CODE
- `404` - Товар не найден
- `404` - Инфоблок не найден

---
*Все параметры фильтрации и форматирования наследуются от базового каталога*
