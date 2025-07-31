<?php

return [
    'POST' => [
        'brand-manager' => [
            'description' => 'Управление брендами - создание и синхронизация каталога с справочником брендов',
            'controller' => '\Artamonov\Rest\Controllers\Native\BrandManager@_post',
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
                'action' => [
                    'type' => 'string',
                    'possibleValue' => ['sync', 'create', 'update', 'check'],
                    'description' => 'Тип операции: sync - полная синхронизация, create - только создание брендов, update - обновление существующих, check - проверка консистентности'
                ],
                'catalog_iblock_id' => [
                    'type' => 'integer',
                    'description' => 'ID инфоблока каталога товаров (по умолчанию: 21)'
                ],
                'brands_iblock_id' => [
                    'type' => 'integer',
                    'description' => 'ID инфоблока справочника брендов (по умолчанию: 22)'
                ],
                
                'separator:properties' => [
                    'title' => 'Настройки свойств'
                ],
                'brand_property' => [
                    'type' => 'string',
                    'description' => 'Код свойства бренда в каталоге (по умолчанию: BREND)'
                ],
                'brand_element_property' => [
                    'type' => 'string',
                    'description' => 'Код свойства связи с элементом бренда (по умолчанию: BRAND_ELEMENT)'
                ],
                
                'separator:options' => [
                    'title' => 'Опции выполнения'
                ],
                'force_update' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Принудительное обновление существующих брендов (по умолчанию: N)'
                ],
                'dry_run' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Тестовый режим без выполнения изменений (по умолчанию: N)'
                ],
                'link_products' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Связывать товары с созданными брендами (по умолчанию: Y)'
                ],
                'with_logging' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Включить детальное логирование операций (по умолчанию: Y)'
                ],
                'batch_size' => [
                    'type' => 'integer',
                    'description' => 'Размер пакета для обработки товаров (по умолчанию: 100, максимум: 1000)'
                ]
            ]
        ]
    ],
    
    'GET' => [
        'brand-manager/status' => [
            'description' => 'Получение текущего статуса системы брендов и проверка работоспособности',
            'controller' => '\Artamonov\Rest\Controllers\Native\BrandManager@_get',
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
                'catalog_iblock_id' => [
                    'type' => 'integer',
                    'description' => 'ID инфоблока каталога товаров (по умолчанию: 21)'
                ],
                'brands_iblock_id' => [
                    'type' => 'integer',
                    'description' => 'ID инфоблока справочника брендов (по умолчанию: 22)'
                ],
                'brand_property' => [
                    'type' => 'string',
                    'description' => 'Код свойства бренда в каталоге (по умолчанию: BREND)'
                ],
                'brand_element_property' => [
                    'type' => 'string',
                    'description' => 'Код свойства связи с элементом бренда (по умолчанию: BRAND_ELEMENT)'
                ]
            ]
        ],
        
        'brand-manager/report' => [
            'description' => 'Получение отчета о последней выполненной операции управления брендами',
            'controller' => '\Artamonov\Rest\Controllers\Native\BrandManager@getReport',
            'security' => [
                'auth' => [
                    'required' => false,
                    'type' => 'token'
                ],
                'token' => [
                    'checkExpire' => false
                ]
            ],
            'parameters' => []
        ]
    ],
    
    'DELETE' => [
        'brand-manager/cleanup' => [
            'description' => 'Очистка несвязанных брендов (брендов без товаров)',
            'controller' => '\Artamonov\Rest\Controllers\Native\BrandManager@_delete',
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
                'brands_iblock_id' => [
                    'type' => 'integer',
                    'description' => 'ID инфоблока справочника брендов (по умолчанию: 22)'
                ],
                'catalog_iblock_id' => [
                    'type' => 'integer',
                    'description' => 'ID инфоблока каталога товаров (по умолчанию: 21)'
                ],
                'brand_element_property' => [
                    'type' => 'string',
                    'description' => 'Код свойства связи с элементом бренда (по умолчанию: BRAND_ELEMENT)'
                ],
                'dry_run' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Тестовый режим без выполнения удаления (по умолчанию: N)'
                ]
            ]
        ]
    ]
]; 