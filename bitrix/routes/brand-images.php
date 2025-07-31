<?php

return [
    'POST' => [
        'brand-images' => [
            'description' => 'Загрузка изображений брендов из base64 - умный поиск брендов и обновление изображений',
            'controller' => '\Artamonov\Rest\Controllers\Native\BrandImageManager@_post',
            'security' => [
                'auth' => [
                    'required' => false,
                    'type' => 'token'
                ],
                'token' => [
                    'checkExpire' => false
                ]
            ],
            'parameters' => [
                'separator:main' => [
                    'title' => 'Основные параметры'
                ],
                'brands_iblock_id' => [
                    'type' => 'integer',
                    'description' => 'ID инфоблока справочника брендов (по умолчанию: 22)'
                ],
                
                'separator:search' => [
                    'title' => 'Настройки поиска брендов'
                ],
                'similarity_threshold' => [
                    'type' => 'float',
                    'description' => 'Порог схожести названий брендов от 0.1 до 1.0 (по умолчанию: 0.8)',
                    'minimum' => 0.1,
                    'maximum' => 1.0
                ],
                'max_brands_per_request' => [
                    'type' => 'integer',
                    'description' => 'Максимальное количество брендов в одном запросе (по умолчанию: 100, максимум: 500)',
                    'minimum' => 1,
                    'maximum' => 500
                ],
                
                'separator:images' => [
                    'title' => 'Настройки изображений'
                ],
                'max_image_size' => [
                    'type' => 'integer',
                    'description' => 'Максимальный размер изображения в байтах (по умолчанию: 5242880 = 5MB, максимум: 20MB)',
                    'minimum' => 1048576,
                    'maximum' => 20971520
                ],
                'image_quality' => [
                    'type' => 'integer',
                    'description' => 'Качество сжатия изображений от 10 до 100 (по умолчанию: 85)',
                    'minimum' => 10,
                    'maximum' => 100
                ],
                
                'separator:options' => [
                    'title' => 'Опции выполнения'
                ],
                'dry_run' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Тестовый режим без сохранения изображений (по умолчанию: N)'
                ],
                'overwrite_existing' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Перезаписывать существующие изображения (по умолчанию: N)'
                ],
                'with_logging' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Включить детальное логирование операций (по умолчанию: Y)'
                ]
            ],
            'request_body' => [
                'content_type' => 'application/json',
                'schema' => [
                    'type' => 'object',
                    'required' => ['brands'],
                    'properties' => [
                        'brands' => [
                            'type' => 'array',
                            'description' => 'Массив брендов с изображениями',
                            'items' => [
                                'type' => 'object',
                                'required' => ['name', 'image'],
                                'properties' => [
                                    'name' => [
                                        'type' => 'string',
                                        'description' => 'Название бренда для поиска в каталоге',
                                        'example' => 'GLOCK'
                                    ],
                                    'image' => [
                                        'type' => 'string',
                                        'description' => 'Base64 изображение в формате data:image/[type];base64,[data]',
                                        'example' => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAI...'
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ],
            'examples' => [
                'basic_upload' => [
                    'title' => 'Базовая загрузка изображений',
                    'description' => 'Загрузка изображений для двух брендов',
                    'request' => [
                        'method' => 'POST',
                        'url' => '/api/brand-images',
                        'headers' => [
                            'Content-Type: application/json',
                            'Authorization-Token: your-jwt-token'
                        ],
                        'body' => [
                            'brands' => [
                                [
                                    'name' => 'GLOCK',
                                    'image' => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAI...'
                                ],
                                [
                                    'name' => 'Beretta',
                                    'image' => 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...'
                                ]
                            ]
                        ]
                    ]
                ],
                'dry_run_test' => [
                    'title' => 'Тестовый режим',
                    'description' => 'Проверка поиска брендов без сохранения изображений',
                    'request' => [
                        'method' => 'POST',
                        'url' => '/api/brand-images?dry_run=Y',
                        'headers' => [
                            'Content-Type: application/json',
                            'Authorization-Token: your-jwt-token'
                        ],
                        'body' => [
                            'brands' => [
                                [
                                    'name' => 'glock',
                                    'image' => 'data:image/png;base64,test...'
                                ]
                            ]
                        ]
                    ]
                ],
                'fuzzy_search' => [
                    'title' => 'Нечеткий поиск с настройками',
                    'description' => 'Поиск брендов с пониженным порогом схожести',
                    'request' => [
                        'method' => 'POST',
                        'url' => '/api/brand-images?similarity_threshold=0.6&overwrite_existing=Y',
                        'headers' => [
                            'Content-Type: application/json',
                            'Authorization-Token: your-jwt-token'
                        ],
                        'body' => [
                            'brands' => [
                                [
                                    'name' => 'Glock Inc',
                                    'image' => 'data:image/webp;base64,UklGRiQAA...'
                                ]
                            ]
                        ]
                    ]
                ]
            ],
            'responses' => [
                '200' => [
                    'description' => 'Успешная обработка изображений',
                    'schema' => [
                        'type' => 'object',
                        'properties' => [
                            'status' => ['type' => 'string', 'example' => 'success'],
                            'meta' => [
                                'type' => 'object',
                                'properties' => [
                                    'brands_iblock_id' => ['type' => 'integer', 'example' => 22],
                                    'processed_count' => ['type' => 'integer', 'example' => 5],
                                    'successful_count' => ['type' => 'integer', 'example' => 3],
                                    'failed_count' => ['type' => 'integer', 'example' => 2],
                                    'similarity_threshold' => ['type' => 'float', 'example' => 0.8],
                                    'dry_run' => ['type' => 'boolean', 'example' => false],
                                    'execution_time' => ['type' => 'float', 'example' => 2.45],
                                    'timestamp' => ['type' => 'string', 'example' => '2025-01-15 15:30:00']
                                ]
                            ],
                            'results' => [
                                'type' => 'object',
                                'properties' => [
                                    'successful' => [
                                        'type' => 'array',
                                        'items' => [
                                            'type' => 'object',
                                            'properties' => [
                                                'input_name' => ['type' => 'string', 'example' => 'GLOCK'],
                                                'found_brand' => [
                                                    'type' => 'object',
                                                    'properties' => [
                                                        'id' => ['type' => 'integer', 'example' => 8340],
                                                        'name' => ['type' => 'string', 'example' => 'GLOCK'],
                                                        'code' => ['type' => 'string', 'example' => 'glock']
                                                    ]
                                                ],
                                                'match_type' => ['type' => 'string', 'example' => 'exact'],
                                                'similarity' => ['type' => 'float', 'example' => 1.0],
                                                'image_updated' => ['type' => 'boolean', 'example' => true],
                                                'old_image_id' => ['type' => 'integer', 'example' => 123],
                                                'new_image_id' => ['type' => 'integer', 'example' => 456],
                                                'file_size' => ['type' => 'integer', 'example' => 15420]
                                            ]
                                        ]
                                    ],
                                    'failed' => [
                                        'type' => 'array',
                                        'items' => [
                                            'type' => 'object',
                                            'properties' => [
                                                'input_name' => ['type' => 'string', 'example' => 'Unknown Brand'],
                                                'reason' => ['type' => 'string', 'example' => 'brand_not_found'],
                                                'attempted_matches' => [
                                                    'type' => 'array',
                                                    'items' => ['type' => 'string'],
                                                    'example' => ['GLOCK', 'Apple']
                                                ],
                                                'best_similarity' => ['type' => 'float', 'example' => 0.2]
                                            ]
                                        ]
                                    ]
                                ]
                            ],
                            'debug_log' => [
                                'type' => 'array',
                                'items' => [
                                    'type' => 'object',
                                    'properties' => [
                                        'timestamp' => ['type' => 'string', 'example' => '15:30:01'],
                                        'message' => ['type' => 'string', 'example' => 'Обработка бренда GLOCK'],
                                        'data' => ['type' => 'object']
                                    ]
                                ]
                            ]
                        ]
                    ]
                ],
                '400' => [
                    'description' => 'Ошибка валидации запроса',
                    'examples' => [
                        'empty_brands' => ['error' => 'Empty brands array'],
                        'invalid_json' => ['error' => 'Invalid JSON: Syntax error'],
                        'missing_name' => ['error' => 'Brand #0: missing or empty \'name\' field'],
                        'invalid_image' => ['error' => 'Brand #0: invalid base64 image format'],
                        'unsupported_format' => ['error' => 'Brand #0: unsupported image format \'image/gif\'. Allowed: image/jpeg, image/png, image/webp'],
                        'image_too_large' => ['error' => 'Brand #0: image size (7.2MB) exceeds maximum allowed (5.0MB)']
                    ]
                ],
                '404' => [
                    'description' => 'Инфоблок брендов не найден',
                    'example' => ['error' => 'Brands iblock not found or inactive']
                ],
                '500' => [
                    'description' => 'Внутренняя ошибка сервера',
                    'example' => ['error' => 'Failed to process image: invalid file format']
                ]
            ]
        ]
    ]
]; 