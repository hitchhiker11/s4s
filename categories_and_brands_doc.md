```markdown
# REST API Документация: Разделы и Бренды

## Sections API

### Endpoint
`GET /sections`

### Параметры запроса

#### Основные параметры
| Параметр       | Тип     | Обязательный | Значения               | Описание                          |
|----------------|---------|--------------|------------------------|-----------------------------------|
| `iblock_id`    | integer | Да           |                        | ID инфоблока                     |
| `section_id`   | integer | Нет          |                        | ID родительского раздела          |
| `parent_section`| string  | Нет          | `root`, `all`          | `root` - корневые разделы          |

#### Управление глубиной
| Параметр    | Тип     | Описание                              |
|-------------|---------|---------------------------------------|
| `depth`     | integer | Глубина вложенности (1-5, по умолч. 1)|
| `max_depth` | integer | Макс. глубина рекурсии                |
| `tree_mode` | string  | `flat` (список) / `nested` (дерево)   |

#### Фильтрация
| Параметр         | Тип     | Описание                          |
|------------------|---------|-----------------------------------|
| `active`         | string  | `Y`, `N`, `all` - активность      |
| `global_active`  | string  | Глобальная активность             |
| `name`           | string  | Поиск по названию (LIKE %value%)  |
| `code`           | string  | Фильтр по символьному коду        |

#### Подсчет элементов
| Параметр               | Тип     | Описание                          |
|------------------------|---------|-----------------------------------|
| `with_element_count`   | string  | `Y` - кол-во элементов в разделе  |
| `count_active_only`    | string  | `Y` - считать только активные     |
| `with_subsection_count`| string  | `Y` - кол-во подразделов          |

#### Настройки вывода
| Параметр          | Тип     | Описание                          |
|-------------------|---------|-----------------------------------|
| `select`          | array   | Доп. поля (напр., `['CODE', ...]`)|
| `format`          | string  | `full`, `compact`, `minimal`      |
| `with_seo`        | string  | `Y` - включить SEO данные         |
| `with_properties` | string  | `Y` - свойства разделов           |

#### Бренды
| Параметр            | Тип     | Описание                          |
|---------------------|---------|-----------------------------------|
| `brands_from_elements` | string | `Y` - бренды из элементов        |
| `brand_property`    | string  | Код свойства бренда (по умолч. `BRAND`)|

### Пример запроса
```bash
# Дерево разделов с глубиной 3
GET /sections?iblock_id=21&tree_mode=nested&depth=3

# Разделы с количеством элементов
GET /sections?iblock_id=21&with_element_count=Y
```

### Пример ответа
```json
{
  "meta": {
    "iblock_id": 21,
    "depth": 3,
    "total_count": 15
  },
  "data": [
    {
      "id": 100,
      "name": "Электроника",
      "element_count": 42,
      "children": [...]
    }
  ]
}
```

---

## Brands API

### Endpoint
`GET /brands`

### Параметры запроса
| Параметр             | Тип     | Описание                          |
|----------------------|---------|-----------------------------------|
| `iblock_id`          | integer | Да - ID инфоблока                |
| `section_id`         | integer | Нет - фильтр по разделу           |
| `include_subsections`| string  | `Y` - включить подразделы         |
| `with_product_count` | string  | `Y` - кол-во товаров              |
| `with_products`      | string  | `Y` - список товаров              |
| `products_limit`     | integer | Лимит товаров (по умолч. 10)      |

### Пример запроса
```bash
# Бренды с количеством товаров
GET /brands?iblock_id=21&with_product_count=Y

# Бренды с товарами из раздела
GET /brands?iblock_id=21&section_id=420&include_subsections=Y
```

### Пример ответа
```json
{
  "meta": {
    "iblock_id": 21,
    "total_brands": 8
  },
  "data": [
    {
      "brand": "Samsung",
      "product_count": 15,
      "products": [
        {"id": 501, "name": "Galaxy S20"}
      ]
    }
  ]
}
```

---

[Полная документация и поддержка](https://api.example.com/docs)
```
