<?php

return [
    'GET' => [
        'brands' => [
            'description' => 'Получение брендов из каталога',
            'controller' => '\Artamonov\Rest\Controllers\Native\Brands@_get',
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
                'iblock_id' => [
                    'type' => 'integer',
                    'required' => true,
                    'description' => 'ID инфоблока каталога'
                ],
                'brand_property' => [
                    'type' => 'string',
                    'description' => 'Код свойства бренда (по умолчанию: BRAND)'
                ],
                'section_id' => [
                    'type' => 'integer',
                    'description' => 'Фильтр по разделу'
                ],
                'include_subsections' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Включить подразделы'
                ],
                'with_product_count' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Добавить количество товаров по бренду'
                ],
                'with_products' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Добавить список товаров бренда'
                ],
                'products_limit' => [
                    'type' => 'integer',
                    'description' => 'Лимит товаров в списке (по умолчанию: 10)'
                ],
                'active_only' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Только активные элементы'
                ],
				'separator:output' => [
					'title' => 'Настройки вывода'
				],
				'format' => [
					'type' => 'string',
					'possibleValue' => ['full', 'compact', 'minimal'],
					'description' => 'Формат ответа'
				],
				'with_brand_details' => [
					'type' => 'string',
					'possibleValue' => ['Y', 'N'],
					'description' => 'Включить детальную информацию о бренде'
				],
				'with_seo' => [
					'type' => 'string',
					'possibleValue' => ['Y', 'N'],
					'description' => 'Включить SEO-данные'
				],
				'sort' => [
					'type' => 'string',
					'description' => 'Сортировка (name:asc, id:desc)'
				],
				'exclude_fields' => [
					'type' => 'array',
					'description' => 'Исключить поля из ответа'
				],
				'fields_only' => [
					'type' => 'array',
					'description' => 'Оставить только указанные поля'
				]

            ]
        ]
    ]
];
