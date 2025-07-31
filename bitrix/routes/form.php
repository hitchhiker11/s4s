<?php
return [
    'POST' => [
        // Теперь для POST достаточно писать "callback" (URL: /api/callback)
        'form' => [
            'description'  => 'Создание заявки на обратный звонок (любой формы)',
            'controller'   => '\Artamonov\Rest\Controllers\Native\Callback@create',
            'contentType'  => 'application/json',
            'security'     => [
                // Разрешаем публичную отправку без авторизации
                'auth' => ['required' => false],
            ],
            'parameters'   => [
                'iblock_id' => [
                    'type'        => 'integer',
                    'default'     => 23,
                    'description' => 'ID инфоблока форм (по умолчанию 4)',
                ],
                'fields' => [
                    'required'    => true,
                    'type'        => 'array',
                    'description' => 'Ассоциативный массив «код_свойства => значение» (например `{ "first_name":"Иван", "last_name":"Иванов", "phone_number":"+79991234567" }`)',
                ],
            ],
        ],
    ],
    'GET' => [
        // Для GET тоже используем “callback” (URL: /api/callback)
        'form' => [
            'description' => 'Получение списка заявок (любой формы) из указанного инфоблока',
            'controller'  => '\Artamonov\Rest\Controllers\Native\Callback@list',
            'security'    => [
                // Если хотите, чтобы список выдавался без авторизации, можно заменить required=>false
                'auth'  => ['required' => false, 'type' => 'token'],
                'token' => ['checkExpire' => false],
            ],
            'parameters'  => [
                'iblock_id' => [
                    'type'        => 'integer',
                    'default'     => 23,
                    'description' => 'ID инфоблока форм (по умолчанию 4)',
                ],
                'limit' => [
                    'type'        => 'integer',
                    'default'     => 10,
                    'description' => 'Лимит элементов на страницу',
                ],
                'page' => [
                    'type'        => 'integer',
                    'default'     => 1,
                    'description' => 'Номер страницы (1-based)',
                ],
                'sort' => [
                    'type'        => 'string',
                    'default'     => 'ID:DESC',
                    'description' => 'Сортировка в формате “поле:asc|desc” (например “DATE_CREATE:DESC”)',
                ],
            ],
        ],
    ],
];
