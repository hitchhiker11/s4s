<?php

return [
    'GET' => [
        'catalog_item' => [
            'description' => 'Получение единичного элемента каталога с детальной информацией',
            'controller' => '\Artamonov\Rest\Controllers\Native\CatalogItem@_get',
            'security' => [
                'auth' => [
                    'required' => false,
                    'type' => 'token'
                ],
                'token' => [
                    'checkExpire' => true
                ]
            ],
            'parameters' => [
                'separator:basic' => [
                    'title' => 'Основные параметры'
                ],
                'iblock_id' => [
                    'type' => 'integer',
                    'required' => true,
                    'description' => 'ID инфоблока каталога'
                ],
                'id' => [
                    'type' => 'integer',
                    'description' => 'ID элемента (обязателен если не указан code)'
                ],
                'code' => [
                    'type' => 'string',
                    'description' => 'Символьный код элемента (обязателен если не указан id)'
                ],
                
                'separator:additional_data' => [
                    'title' => 'Дополнительные данные'
                ],
                'with_offers' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Включить торговые предложения (SKU)'
                ],
                'with_related' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Включить информацию о похожих товарах'
                ],
                'with_reviews' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Включить отзывы о товаре'
                ],
                'with_availability' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Детальная информация о наличии и характеристиках'
                ],
                'with_similar' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Товары из того же раздела'
                ],

                'separator:output_options' => [
                    'title' => 'Опции вывода (наследуются от базового контроллера)'
                ],
                'format' => [
                    'type' => 'string',
                    'possibleValue' => ['full', 'compact', 'minimal'],
                    'description' => 'Формат ответа (по умолчанию: full)'
                ],
                'with_seo' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Включить SEO-данные'
                ],
                'with_sections' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Включить информацию о разделах'
                ],
                'with_images' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Включить обработку изображений'
                ],
                'image_resize' => [
                    'type' => 'string',
                    'description' => 'Размер изображений (300x300)'
                ],
                'image_sizes' => [
                    'type' => 'array',
                    'description' => 'Множественные размеры изображений'
                ],

                // Все остальные параметры из базового контроллера...
                'exclude' => [
                    'type' => 'array',
                    'description' => 'Исключить разделы из ответа (fields, properties, prices, images)'
                ],
                'fields_only' => [
                    'type' => 'array',
                    'description' => 'Оставить только указанные поля'
                ],
                'properties_only' => [
                    'type' => 'array',
                    'description' => 'Оставить только указанные свойства'
                ],
                'exclude_fields' => [
                    'type' => 'array',
                    'description' => 'Исключить конкретные поля'
                ],
                'exclude_properties' => [
                    'type' => 'array',
                    'description' => 'Исключить конкретные свойства'
                ],
                'exclude_empty_properties' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Исключить пустые свойства'
                ],
                'exclude_system_properties' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Исключить системные свойства (CML2_*)'
                ]
            ]
        ]
    ]
];
