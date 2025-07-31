<?php

return [
    'GET' => [
        'catalog' => [
            'description' => 'Получение элементов каталога с расширенными возможностями фильтрации',
            'controller' => '\Artamonov\Rest\Controllers\Native\Catalog@_get',
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
                'action' => [
                    'type' => 'string',
                    'possibleValue' => ['products', 'brands'],
                    'description' => 'Тип действия: products - товары (по умолчанию), brands - список брендов'
                ],
                'iblock_id' => [
                    'type' => 'integer',
                    'required' => true,
                    'description' => 'ID инфоблока каталога'
                ],
                'brands_iblock_id' => [
                    'type' => 'integer',
                    'description' => 'ID инфоблока брендов (по умолчанию: 22)'
                ],
                
                'separator:sections' => [
                    'title' => 'Параметры разделов'
                ],
                'section_id' => [
                    'type' => 'integer',
                    'description' => 'ID раздела для фильтрации'
                ],
                'category' => [
                    'type' => 'integer',
                    'description' => 'Порядковый номер категории (раздела)'
                ],
				'include_subsections' => [
					'type' => 'string',
					'possibleValue' => ['Y', 'N'],
					'description' => 'Включить подразделы первого уровня (по умолчанию: N)'
				],
				'deep_subsections' => [
					'type' => 'string',
					'possibleValue' => ['Y', 'N'],
					'description' => 'Глубокий поиск по всем вложенным подразделам (приоритет над include_subsections)'
				],
				
				'separator:brands' => [
                    'title' => 'Параметры брендов'
                ],
                'brand_id' => [
                    'type' => 'integer',
                    'description' => 'ID бренда для фильтрации товаров'
                ],
                'brand_category' => [
                    'type' => 'integer',
                    'description' => 'Порядковый номер бренда'
                ],
                'include_subbrands' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Включить подбренды первого уровня (по умолчанию: N)'
                ],
                'deep_subbrands' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Глубокий поиск по всем вложенным подбрендам'
                ],
                
                'separator:pagination' => [
                    'title' => 'Пагинация'
                ],
                'limit' => [
                    'type' => 'integer',
                    'description' => 'Количество элементов на странице (по умолчанию: 10, максимум: 100)'
                ],
                'page' => [
                    'type' => 'integer',
                    'description' => 'Номер страницы для пагинации (от 1)'
                ],
                
                'separator:sorting' => [
                    'title' => 'Сортировка и выборка'
                ],
                'sort' => [
                    'type' => 'string',
                    'description' => 'Сортировка (пример: sort=id:asc,name:desc,price:asc)'
                ],
                'select' => [
                    'type' => 'array',
                    'description' => 'Дополнительные поля для выборки'
                ],
                'exclude' => [
                    'type' => 'array',
                    'description' => 'Исключить поля из ответа (fields, properties, prices)'
                ],
                'fields_only' => [
                    'type' => 'array',
                    'description' => 'Оставить только указанные поля в fields'
                ],
                'properties_only' => [
                    'type' => 'array',
                    'description' => 'Оставить только указанные свойства в properties'
                ],
                
                'separator:status_filters' => [
                    'title' => 'Фильтрация по статусам'
                ],
                'active' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N', 'all'],
                    'description' => 'Активность элементов (по умолчанию: Y)'
                ],
                'available' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Доступность для покупки'
                ],
                'in_stock' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Наличие на складе'
                ],
                'has_price' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Наличие цены'
                ],
                'has_photos' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Наличие фотографий'
                ],
                
                'separator:field_filters' => [
                    'title' => 'Фильтрация по полям'
                ],
				'separator:output_options' => [
					'title' => 'Опции вывода'
				],
				'brand' => [
					'type' => 'string|array',
					'description' => 'Фильтр по бренду по названию (один бренд: brand=Apple, несколько: brand[]=Apple&brand[]=Samsung)'
				],
				
				'separator:brands_list' => [
					'title' => 'Параметры для action=brands'
				],
				'search' => [
					'type' => 'string',
					'description' => 'Поиск брендов по названию (только для action=brands)'
				],
				'with_products' => [
					'type' => 'string',
					'possibleValue' => ['Y', 'N'],
					'description' => 'Показать только бренды с товарами (только для action=brands)'
				],
				'with_products_count' => [
					'type' => 'string',
					'possibleValue' => ['Y', 'N'],
					'description' => 'Включить подсчет товаров для каждого бренда (только для action=brands)'
				],
				'with_properties' => [
					'type' => 'string',
					'possibleValue' => ['Y', 'N'],
					'description' => 'Включить свойства брендов (только для action=brands)'
				],

                'name' => [
                    'type' => 'string',
                    'description' => 'Поиск по названию (LIKE %value%)'
                ],
                'code' => [
                    'type' => 'string',
                    'description' => 'Символьный код элемента'
                ],
                'external_id' => [
                    'type' => 'string',
                    'description' => 'Внешний ID элемента'
                ],
                'date_from' => [
                    'type' => 'string',
                    'description' => 'Дата создания от (YYYY-MM-DD)'
                ],
                'date_to' => [
                    'type' => 'string',
                    'description' => 'Дата создания до (YYYY-MM-DD)'
                ],
                'modified_from' => [
                    'type' => 'string',
                    'description' => 'Дата изменения от (YYYY-MM-DD HH:MM:SS)'
                ],
                'modified_to' => [
                    'type' => 'string',
                    'description' => 'Дата изменения до (YYYY-MM-DD HH:MM:SS)'
                ],
                
                'separator:property_filters' => [
                    'title' => 'Фильтрация по свойствам'
                ],
                'property' => [
                    'type' => 'array',
                    'description' => 'Фильтр по свойствам (пример: property[ARTICLE]=123&property[COLOR]=red)'
                ],
                'property_like' => [
                    'type' => 'array',
                    'description' => 'Поиск по свойствам с LIKE (пример: property_like[BRAND]=Apple)'
                ],
                'property_range' => [
                    'type' => 'array',
                    'description' => 'Диапазон для числовых свойств (пример: property_range[PRICE][from]=100&property_range[PRICE][to]=500)'
                ],
                
                'separator:price_filters' => [
                    'title' => 'Фильтрация по ценам'
                ],
                'price_from' => [
                    'type' => 'float',
                    'description' => 'Цена от'
                ],
                'price_to' => [
                    'type' => 'float',
                    'description' => 'Цена до'
                ],
                'price_type' => [
                    'type' => 'integer',
                    'description' => 'ID типа цены для фильтрации'
                ],
                'currency' => [
                    'type' => 'string',
                    'possibleValue' => ['RUB', 'USD', 'EUR'],
                    'description' => 'Валюта для фильтрации цен'
                ],
                
                'separator:output_options' => [
                    'title' => 'Опции вывода'
                ],
                'format' => [
                    'type' => 'string',
                    'possibleValue' => ['full', 'compact', 'minimal'],
                    'description' => 'Формат ответа (по умолчанию: full)'
                ],
                'with_seo' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Включить SEO-данные (meta_title, meta_description)'
                ],
                'with_sections' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Включить информацию о разделах'
                ],
                'image_resize' => [
                    'type' => 'string',
                    'description' => 'Размер изображений (пример: 300x300 или 300x300BX_RESIZE_IMAGE_PROPORTIONAL)'
                ],
				// НОВЫЕ ПАРАМЕТРЫ ДЛЯ ИЗОБРАЖЕНИЙ
				'with_images' => [
					'type' => 'string',
					'possibleValue' => ['Y', 'N'],
					'description' => 'Включить обработку изображений (по умолчанию: Y)'
				],
				'image_sizes' => [
					'type' => 'array',
					'description' => 'Массив размеров для автоматического ресайза (пример: image_sizes[]=300x300&image_sizes[]=150x150)'
				],
				'separator:advanced_exclusion' => [
					'title' => 'Продвинутое исключение полей'
				],
				'exclude_fields' => [
					'type' => 'array',
					'description' => 'Исключить конкретные поля из fields (пример: exclude_fields[]=LANG_DIR&exclude_fields[]=LID)'
				],
				'exclude_properties' => [
					'type' => 'array', 
					'description' => 'Исключить конкретные свойства (пример: exclude_properties[]=CML2_BAR_CODE&exclude_properties[]=CML2_TAXES)'
				],
				'exclude_empty_properties' => [
					'type' => 'string',
					'possibleValue' => ['Y', 'N'],
					'description' => 'Исключить пустые свойства (VALUE = false или "")'
				],
				'exclude_system_properties' => [
					'type' => 'string', 
					'possibleValue' => ['Y', 'N'],
					'description' => 'Исключить системные свойства (с префиксом CML2_)'
				],
				'properties_pattern_exclude' => [
					'type' => 'string',
					'description' => 'Регулярное выражение для исключения свойств по паттерну'
				],
				'fields_pattern_exclude' => [
					'type' => 'string',
					'description' => 'Регулярное выражение для исключения полей по паттерну'
				]
            ]
        ]
    ]
];
