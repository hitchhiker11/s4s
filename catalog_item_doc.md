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
## Пример полного ответа с реального севера
```
{
    "meta": {
        "iblock_id": 21,
        "element_id": 7769,
        "element_code": null,
        "format": "full",
        "request_time": "2025-05-28 19:57:59",
        "additional_data": {
            "with_offers": false,
            "with_related": false,
            "with_reviews": false,
            "with_availability": false,
            "with_similar": false
        }
    },
    "data": {
        "id": "7769",
        "name": "Подсумок FMA  Alpha-Xip (white)",
        "fields": {
            "ID": "7769",
            "IBLOCK_ID": "21",
            "NAME": "Подсумок FMA  Alpha-Xip (white)",
            "DATE_ACTIVE_FROM": null,
            "DATE_ACTIVE_TO": null,
            "DETAIL_PAGE_URL": "/detail/podsumok_fma_alpha_xip_white/",
            "PREVIEW_PICTURE": 531877,
            "DETAIL_PICTURE": 531878,
            "PREVIEW_TEXT": "",
            "PREVIEW_TEXT_TYPE": "text",
            "DETAIL_TEXT": "",
            "DETAIL_TEXT_TYPE": "text",
            "CODE": "podsumok_fma_alpha_xip_white",
            "EXTERNAL_ID": "QAaVcvA8irBPB80vzeCcp1",
            "TAGS": null,
            "IBLOCK_SECTION_ID": "465",
            "DATE_CREATE": "17.12.2024 13:31:32",
            "CREATED_BY": "1",
            "TIMESTAMP_X": "28.05.2025 19:48:36",
            "MODIFIED_BY": "1",
            "LANG_DIR": "/",
            "IBLOCK_TYPE_ID": "catalog",
            "IBLOCK_CODE": "test_catalog",
            "IBLOCK_EXTERNAL_ID": "test",
            "LID": "s1"
        },
        "properties": {
            "GOAT": {
                "NAME": "Лучший товар",
                "CODE": "GOAT",
                "VALUE": "",
                "DESCRIPTION": "",
                "PROPERTY_TYPE": "L"
            },
            "BRAND": {
                "NAME": "Бренд",
                "CODE": "BRAND",
                "VALUE": "",
                "DESCRIPTION": "",
                "PROPERTY_TYPE": "S"
            },
            "ISNEW": {
                "NAME": "Новинка",
                "CODE": "ISNEW",
                "VALUE": "",
                "DESCRIPTION": "",
                "PROPERTY_TYPE": "L"
            },
            "MONTHLY": {
                "NAME": "Товар месяца",
                "CODE": "MONTHLY",
                "VALUE": "",
                "DESCRIPTION": "",
                "PROPERTY_TYPE": "L"
            },
            "ARTICLE": {
                "NAME": "Артикул",
                "CODE": "ARTICLE",
                "VALUE": "",
                "DESCRIPTION": "",
                "PROPERTY_TYPE": "S"
            },
            "CML2_BAR_CODE": {
                "NAME": "ШтрихКод",
                "CODE": "CML2_BAR_CODE",
                "VALUE": "",
                "DESCRIPTION": "",
                "PROPERTY_TYPE": "S"
            },
            "CML2_ARTICLE": {
                "NAME": "Артикул",
                "CODE": "CML2_ARTICLE",
                "VALUE": "TB416-WH",
                "DESCRIPTION": null,
                "PROPERTY_TYPE": "S"
            },
            "CML2_ATTRIBUTES": {
                "NAME": "Характеристики",
                "CODE": "CML2_ATTRIBUTES",
                "VALUE": false,
                "DESCRIPTION": false,
                "PROPERTY_TYPE": "S"
            },
            "CML2_TRAITS": {
                "NAME": "Реквизиты",
                "CODE": "CML2_TRAITS",
                "VALUE": [
                    "Товар",
                    "Товар"
                ],
                "DESCRIPTION": [
                    "ВидНоменклатуры",
                    "ТипНоменклатуры"
                ],
                "PROPERTY_TYPE": "S"
            },
            "CML2_BASE_UNIT": {
                "NAME": "Базовая единица",
                "CODE": "CML2_BASE_UNIT",
                "VALUE": "шт",
                "DESCRIPTION": "5",
                "PROPERTY_TYPE": "S"
            },
            "CML2_TAXES": {
                "NAME": "Ставки налогов",
                "CODE": "CML2_TAXES",
                "VALUE": false,
                "DESCRIPTION": false,
                "PROPERTY_TYPE": "S"
            },
            "MORE_PHOTO": {
                "NAME": "Картинки товара",
                "CODE": "MORE_PHOTO",
                "VALUE": [
                    "531879",
                    "531880"
                ],
                "DESCRIPTION": [
                    null,
                    null
                ],
                "PROPERTY_TYPE": "F"
            },
            "FILES": {
                "NAME": "Файлы",
                "CODE": "FILES",
                "VALUE": false,
                "DESCRIPTION": false,
                "PROPERTY_TYPE": "F"
            },
            "CML2_MANUFACTURER": {
                "NAME": "Производитель",
                "CODE": "CML2_MANUFACTURER",
                "VALUE": "",
                "DESCRIPTION": "",
                "PROPERTY_TYPE": "L"
            },
            "NOVINKA": {
                "NAME": "Новинка",
                "CODE": "NOVINKA",
                "VALUE": "",
                "DESCRIPTION": "",
                "PROPERTY_TYPE": "S"
            }
        },
        "images": {
            "preview": {
                "id": 531877,
                "name": "638cdf66-ccba-4e22-8b05-5507cb348f69_imageid.resize1.jpg",
                "size": 21263,
                "width": 400,
                "height": 400,
                "src": "/upload/iblock/b34/kb1doi9p8odb86l9w91f4hthavjfm9qg.jpg",
                "type": "preview",
                "mime_type": "image/jpeg",
                "standard_sizes": {
                    "thumb": {
                        "src": "/upload/resize_cache/iblock/b34/150_150_1/kb1doi9p8odb86l9w91f4hthavjfm9qg.jpg",
                        "width": 150,
                        "height": 150,
                        "size": 5645
                    },
                    "medium": {
                        "src": "/upload/resize_cache/iblock/b34/300_300_1/kb1doi9p8odb86l9w91f4hthavjfm9qg.jpg",
                        "width": 300,
                        "height": 300,
                        "size": 17058
                    },
                    "large": {
                        "src": "/upload/iblock/b34/kb1doi9p8odb86l9w91f4hthavjfm9qg.jpg",
                        "width": 400,
                        "height": 400,
                        "size": "21263"
                    }
                }
            },
            "detail": {
                "id": 531878,
                "name": "638cdf66-ccba-4e22-8b05-5507cb348f69_imageid.jpg",
                "size": 152241,
                "width": 800,
                "height": 800,
                "src": "/upload/iblock/75c/nuz1ma85rns5f75cw189tlr5v98l80ro.jpg",
                "type": "detail",
                "mime_type": "image/jpeg",
                "standard_sizes": {
                    "thumb": {
                        "src": "/upload/resize_cache/iblock/75c/150_150_1/nuz1ma85rns5f75cw189tlr5v98l80ro.jpg",
                        "width": 150,
                        "height": 150,
                        "size": 5613
                    },
                    "medium": {
                        "src": "/upload/resize_cache/iblock/75c/300_300_1/nuz1ma85rns5f75cw189tlr5v98l80ro.jpg",
                        "width": 300,
                        "height": 300,
                        "size": 16956
                    },
                    "large": {
                        "src": "/upload/resize_cache/iblock/75c/600_600_1/nuz1ma85rns5f75cw189tlr5v98l80ro.jpg",
                        "width": 600,
                        "height": 600,
                        "size": 57923
                    }
                }
            },
            "gallery": [
                {
                    "id": 531879,
                    "name": "101ebaf6-d262-4925-8d18-56b7e1cccbf2_imageid.jpg",
                    "size": 155580,
                    "width": 800,
                    "height": 800,
                    "src": "/upload/iblock/9c1/cwri1dkvb4j7bml6iv26aqp53uoh1ojy.jpg",
                    "type": "gallery",
                    "mime_type": "image/jpeg",
                    "index": 0,
                    "standard_sizes": {
                        "thumb": {
                            "src": "/upload/resize_cache/iblock/9c1/150_150_1/cwri1dkvb4j7bml6iv26aqp53uoh1ojy.jpg",
                            "width": 150,
                            "height": 150,
                            "size": 6266
                        },
                        "medium": {
                            "src": "/upload/resize_cache/iblock/9c1/300_300_1/cwri1dkvb4j7bml6iv26aqp53uoh1ojy.jpg",
                            "width": 300,
                            "height": 300,
                            "size": 18316
                        },
                        "large": {
                            "src": "/upload/resize_cache/iblock/9c1/600_600_1/cwri1dkvb4j7bml6iv26aqp53uoh1ojy.jpg",
                            "width": 600,
                            "height": 600,
                            "size": 61231
                        }
                    }
                },
                {
                    "id": 531880,
                    "name": "02523a66-1f18-4ab1-8590-3a8b5066251a_imageid.jpg",
                    "size": 352397,
                    "width": 800,
                    "height": 1200,
                    "src": "/upload/iblock/0c8/ob3ws71drwa6stkmkf28s5wxckyaczjs.jpg",
                    "type": "gallery",
                    "mime_type": "image/jpeg",
                    "index": 1,
                    "standard_sizes": {
                        "thumb": {
                            "src": "/upload/resize_cache/iblock/0c8/150_150_1/ob3ws71drwa6stkmkf28s5wxckyaczjs.jpg",
                            "width": 100,
                            "height": 150,
                            "size": 8427
                        },
                        "medium": {
                            "src": "/upload/resize_cache/iblock/0c8/300_300_1/ob3ws71drwa6stkmkf28s5wxckyaczjs.jpg",
                            "width": 200,
                            "height": 300,
                            "size": 23743
                        },
                        "large": {
                            "src": "/upload/resize_cache/iblock/0c8/600_600_1/ob3ws71drwa6stkmkf28s5wxckyaczjs.jpg",
                            "width": 400,
                            "height": 600,
                            "size": 72659
                        }
                    }
                }
            ],
            "all": [
                {
                    "id": 531877,
                    "name": "638cdf66-ccba-4e22-8b05-5507cb348f69_imageid.resize1.jpg",
                    "size": 21263,
                    "width": 400,
                    "height": 400,
                    "src": "/upload/iblock/b34/kb1doi9p8odb86l9w91f4hthavjfm9qg.jpg",
                    "type": "preview",
                    "mime_type": "image/jpeg",
                    "standard_sizes": {
                        "thumb": {
                            "src": "/upload/resize_cache/iblock/b34/150_150_1/kb1doi9p8odb86l9w91f4hthavjfm9qg.jpg",
                            "width": 150,
                            "height": 150,
                            "size": 5645
                        },
                        "medium": {
                            "src": "/upload/resize_cache/iblock/b34/300_300_1/kb1doi9p8odb86l9w91f4hthavjfm9qg.jpg",
                            "width": 300,
                            "height": 300,
                            "size": 17058
                        },
                        "large": {
                            "src": "/upload/iblock/b34/kb1doi9p8odb86l9w91f4hthavjfm9qg.jpg",
                            "width": 400,
                            "height": 400,
                            "size": "21263"
                        }
                    }
                },
                {
                    "id": 531878,
                    "name": "638cdf66-ccba-4e22-8b05-5507cb348f69_imageid.jpg",
                    "size": 152241,
                    "width": 800,
                    "height": 800,
                    "src": "/upload/iblock/75c/nuz1ma85rns5f75cw189tlr5v98l80ro.jpg",
                    "type": "detail",
                    "mime_type": "image/jpeg",
                    "standard_sizes": {
                        "thumb": {
                            "src": "/upload/resize_cache/iblock/75c/150_150_1/nuz1ma85rns5f75cw189tlr5v98l80ro.jpg",
                            "width": 150,
                            "height": 150,
                            "size": 5613
                        },
                        "medium": {
                            "src": "/upload/resize_cache/iblock/75c/300_300_1/nuz1ma85rns5f75cw189tlr5v98l80ro.jpg",
                            "width": 300,
                            "height": 300,
                            "size": 16956
                        },
                        "large": {
                            "src": "/upload/resize_cache/iblock/75c/600_600_1/nuz1ma85rns5f75cw189tlr5v98l80ro.jpg",
                            "width": 600,
                            "height": 600,
                            "size": 57923
                        }
                    }
                },
                {
                    "id": 531879,
                    "name": "101ebaf6-d262-4925-8d18-56b7e1cccbf2_imageid.jpg",
                    "size": 155580,
                    "width": 800,
                    "height": 800,
                    "src": "/upload/iblock/9c1/cwri1dkvb4j7bml6iv26aqp53uoh1ojy.jpg",
                    "type": "gallery",
                    "mime_type": "image/jpeg",
                    "index": 0,
                    "standard_sizes": {
                        "thumb": {
                            "src": "/upload/resize_cache/iblock/9c1/150_150_1/cwri1dkvb4j7bml6iv26aqp53uoh1ojy.jpg",
                            "width": 150,
                            "height": 150,
                            "size": 6266
                        },
                        "medium": {
                            "src": "/upload/resize_cache/iblock/9c1/300_300_1/cwri1dkvb4j7bml6iv26aqp53uoh1ojy.jpg",
                            "width": 300,
                            "height": 300,
                            "size": 18316
                        },
                        "large": {
                            "src": "/upload/resize_cache/iblock/9c1/600_600_1/cwri1dkvb4j7bml6iv26aqp53uoh1ojy.jpg",
                            "width": 600,
                            "height": 600,
                            "size": 61231
                        }
                    }
                },
                {
                    "id": 531880,
                    "name": "02523a66-1f18-4ab1-8590-3a8b5066251a_imageid.jpg",
                    "size": 352397,
                    "width": 800,
                    "height": 1200,
                    "src": "/upload/iblock/0c8/ob3ws71drwa6stkmkf28s5wxckyaczjs.jpg",
                    "type": "gallery",
                    "mime_type": "image/jpeg",
                    "index": 1,
                    "standard_sizes": {
                        "thumb": {
                            "src": "/upload/resize_cache/iblock/0c8/150_150_1/ob3ws71drwa6stkmkf28s5wxckyaczjs.jpg",
                            "width": 100,
                            "height": 150,
                            "size": 8427
                        },
                        "medium": {
                            "src": "/upload/resize_cache/iblock/0c8/300_300_1/ob3ws71drwa6stkmkf28s5wxckyaczjs.jpg",
                            "width": 200,
                            "height": 300,
                            "size": 23743
                        },
                        "large": {
                            "src": "/upload/resize_cache/iblock/0c8/600_600_1/ob3ws71drwa6stkmkf28s5wxckyaczjs.jpg",
                            "width": 400,
                            "height": 600,
                            "size": 72659
                        }
                    }
                }
            ]
        },
        "prices": [
            {
                "price_type_id": "1",
                "price_type_name": "Базовая",
                "price": 0,
                "currency": "RUB",
                "base": true
            }
        ]
    }
}
```

## ⚠️ Коды ошибок
- `400` - Не указан ID или CODE
- `404` - Товар не найден
- `404` - Инфоблок не найден

---
*Все параметры фильтрации и форматирования наследуются от базового каталога*
