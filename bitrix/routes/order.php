<?php

return [
    'POST' => [
        'order' => [
            'description' => 'Создание нового заказа из корзины пользователя',
            'controller' => '\Artamonov\Rest\Controllers\Native\OrderNew@_post',
            'security' => [
                'auth' => ['required' => false, 'type' => 'session'],
            ],
            'parameters' => [
                'fuser_id' => [
                    'type' => 'integer',
                    'required' => true,
                    'description' => 'ID корзины пользователя (FUSER_ID)'
                ],
                'customer_name' => [
                    'type' => 'string',
                    'required' => true,
                    'description' => 'Имя покупателя'
                ],
                'customer_lastname' => [
                    'type' => 'string',
                    'required' => true,
                    'description' => 'Фамилия покупателя'
                ],
                'customer_middlename' => [
                    'type' => 'string',
                    'required' => false,
                    'description' => 'Отчество покупателя'
                ],
                'customer_phone' => [
                    'type' => 'string',
                    'required' => true,
                    'description' => 'Телефон покупателя'
                ],
                'customer_email' => [
                    'type' => 'string',
                    'required' => true,
                    'description' => 'Email покупателя'
                ],
                'cdek_code' => [
                    'type' => 'string',
                    'required' => true,
                    'description' => 'Код ПВЗ СДЭК (например: MSK2339)'
                ],
                'delivery_address' => [
                    'type' => 'string',
                    'required' => true,
                    'description' => 'Адрес ПВЗ СДЭК'
                ],
                'payment_system_id' => [
                    'type' => 'integer',
                    'required' => false,
                    'description' => 'ID способа оплаты (по умолчанию: 3 - Робокасса)'
                ],
                'comment' => [
                    'type' => 'string',
                    'required' => false,
                    'description' => 'Комментарий к заказу'
                ],
                'clear_basket' => [
                    'type' => 'string',
                    'possibleValue' => ['Y', 'N'],
                    'description' => 'Очистить корзину после создания заказа (по умолчанию: Y)'
                ]
            ]
        ]
    ],
    'GET' => [
        'order' => [
            'description' => 'Получение информации о заказе',
            'controller' => '\Artamonov\Rest\Controllers\Native\OrderNew@_get',
            'security' => [
                'auth' => ['required' => false, 'type' => 'session'],
            ],
            'parameters' => [
                'action' => [
                    'type' => 'string',
                    'possibleValue' => ['get_status', 'get_payment_form'],
                    'description' => 'Тип операции'
                ],
                'order_id' => [
                    'type' => 'integer',
                    'required' => true,
                    'description' => 'ID заказа'
                ]
            ]
        ]
    ]
]; 