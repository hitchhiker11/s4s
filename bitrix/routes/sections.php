<?php

return [
    'GET' => [
        'sections' => [
            'description' => 'Получение разделов каталога с расширенными возможностями',
            'controller' => '\Artamonov\Rest\Controllers\Native\Sections@_get',
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
                    'description' => 'ID инфоблока'
                ],
                'section_id' => [
                    'type' => 'integer',
                    'description' => 'ID родительского раздела (для получения дочерних)'
                ],
                'parent_section' => [
                    'type' => 'string',
                    'possibleValue' => ['root', 'all'],
                    'description' => 'root - только корневые разделы, all - все разделы'
                ],
				'parent_section_id' => [
					'type' => 'integer',
					'description' => 'ID родительского раздела (приоритет над section_id)'
				],
				
                'separator:depth' => [
                    'title' => 'Управление глубиной'
                ],
                'depth' => [
                    'type' => 'integer',
                    'description' => 'Глубина вложенности (1-5, по умолчанию: 1)'
                ],
                'max_depth' => [
                    'type' => 'integer', 
                    'description' => 'Максимальная глубина рекурсии'
                ],
                'tree_mode' => [
                    'type' => 'string',
                    'possibleValue' => ['flat', 'nested'],
                    'description' => 'Режим вывода: flat - плоский список, nested - дерево'
                ],
                
                'separator:filtering' => [
                    'title' => 'Фильтрация'
                ],
                'active' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N', 'all'],
                    'description' => 'Активность разделов'
                ],
                'global_active' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N', 'all'], 
                    'description' => 'Глобальная активность'
                ],
                'name' => [
                    'type' => 'string',
                    'description' => 'Поиск по названию (LIKE %value%)'
                ],
                'code' => [
                    'type' => 'string',
                    'description' => 'Фильтр по символьному коду'
                ],
                'external_id' => [
                    'type' => 'string',
                    'description' => 'Фильтр по внешнему ID'
                ],
                
                'separator:counting' => [
                    'title' => 'Подсчет элементов'
                ],
                'with_element_count' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Добавить количество элементов в разделе'
                ],
                'count_active_only' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Считать только активные элементы'
                ],
                'with_subsection_count' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Добавить количество подразделов'
                ],
                
                'separator:output' => [
                    'title' => 'Настройки вывода'
                ],
                'select' => [
                    'type' => 'array',
                    'description' => 'Дополнительные поля для выборки'
                ],
                'exclude_fields' => [
                    'type' => 'array',
                    'description' => 'Исключить конкретные поля'
                ],
                'fields_only' => [
                    'type' => 'array', 
                    'description' => 'Оставить только указанные поля'
                ],
                'sort' => [
                    'type' => 'string',
                    'description' => 'Сортировка (sort=sort:asc,name:desc)'
                ],
                'with_seo' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Включить SEO-данные'
                ],
                'with_properties' => [
                    'type' => 'string', 
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Включить свойства разделов'
                ],
                'format' => [
                    'type' => 'string',
                    'possibleValue' => ['full', 'compact', 'minimal'],
                    'description' => 'Формат ответа'
                ],
                
                'separator:brands' => [
                    'title' => 'Работа с брендами' 
                ],
                'brands_from_elements' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Получить бренды из элементов разделов'
                ],
                'brand_property' => [
                    'type' => 'string',
                    'description' => 'Код свойства бренда (по умолчанию: BRAND)'
                ],
                'unique_brands_only' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Только уникальные бренды'
                ]
            ]
        ]
    ]
];
