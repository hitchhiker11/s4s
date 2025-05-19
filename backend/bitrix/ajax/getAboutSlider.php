<?php
/**
 * Обработчик AJAX-запроса для получения данных слайдера в разделе About
 * 
 * Данный файл должен быть размещен на сервере Bitrix в директории /bitrix/ajax/
 */

// Подключаем ядро Bitrix
require_once($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php');

// Устанавливаем заголовок JSON
header('Content-Type: application/json');

// Проверяем, является ли запрос AJAX-запросом
if(!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
    echo json_encode([
        'success' => false,
        'message' => 'Доступ запрещен'
    ]);
    die();
}

// Инициализируем переменные для хранения данных
$result = [
    'success' => true,
    'data' => []
];

try {
    // Подключаем необходимые модули Bitrix
    if (!CModule::IncludeModule('iblock')) {
        throw new Exception('Не удалось подключить модуль iblock');
    }
    
    // ID инфоблока с данными слайдера
    $iblockId = 10; // Измените на ID вашего инфоблока
    
    // Получаем элементы инфоблока
    $arFilter = [
        'IBLOCK_ID' => $iblockId,
        'ACTIVE' => 'Y',
    ];
    
    $arSelect = [
        'ID',
        'NAME',
        'PREVIEW_PICTURE',
        'PROPERTY_BRAND',
        'PROPERTY_BRAND_LOGO',
    ];
    
    $rsElements = CIBlockElement::GetList(
        ['SORT' => 'ASC'],
        $arFilter,
        false,
        false,
        $arSelect
    );
    
    // Собираем данные для ответа
    while ($arElement = $rsElements->GetNext()) {
        $sliderId = $arElement['ID'];
        $sliderName = $arElement['NAME'];
        
        // Получаем изображение слайда
        $sliderImage = '';
        if (!empty($arElement['PREVIEW_PICTURE'])) {
            $sliderImage = CFile::GetPath($arElement['PREVIEW_PICTURE']);
        }
        
        // Получаем данные о бренде
        $brandName = $arElement['PROPERTY_BRAND_VALUE'];
        
        // Получаем логотип бренда (предполагается, что это множественное свойство типа "Файл")
        $brandLogo = [];
        if (!empty($arElement['PROPERTY_BRAND_LOGO_VALUE']) && is_array($arElement['PROPERTY_BRAND_LOGO_VALUE'])) {
            foreach ($arElement['PROPERTY_BRAND_LOGO_VALUE'] as $logoId) {
                $brandLogo[] = CFile::GetPath($logoId);
            }
        }
        
        // Формируем данные для текущего слайда
        $result['data'][] = [
            'id' => $sliderId,
            'title' => $sliderName,
            'image' => $sliderImage,
            'brand' => $brandName,
            'brandLogo' => $brandLogo
        ];
    }
    
    // Если нет данных, возвращаем заготовленные мок-данные для разработки
    if (empty($result['data'])) {
        $result['data'] = [
            [
                'id' => 1,
                'title' => 'Лучшее предложение',
                'image' => '/images/slider/slider-image-1.svg',
                'brand' => 'Recover Tactical',
                'brandLogo' => [
                    '/images/slider/logo-vector-1.svg',
                    '/images/slider/logo-vector-2.svg',
                    '/images/slider/logo-vector-3.svg',
                    '/images/slider/logo-vector-4.svg'
                ]
            ],
            [
                'id' => 2,
                'title' => 'Премиум качество',
                'image' => '/images/slider/slider-image-1.svg',
                'brand' => 'Recover Tactical',
                'brandLogo' => [
                    '/images/slider/logo-vector-1.svg',
                    '/images/slider/logo-vector-2.svg',
                    '/images/slider/logo-vector-3.svg',
                    '/images/slider/logo-vector-4.svg'
                ]
            ],
            [
                'id' => 3,
                'title' => 'Профессиональное снаряжение',
                'image' => '/images/slider/slider-image-1.svg',
                'brand' => 'Recover Tactical',
                'brandLogo' => [
                    '/images/slider/logo-vector-1.svg',
                    '/images/slider/logo-vector-2.svg',
                    '/images/slider/logo-vector-3.svg',
                    '/images/slider/logo-vector-4.svg'
                ]
            ],
            [
                'id' => 4,
                'title' => 'Эксклюзивные модели',
                'image' => '/images/slider/slider-image-1.svg',
                'brand' => 'Recover Tactical',
                'brandLogo' => [
                    '/images/slider/logo-vector-1.svg',
                    '/images/slider/logo-vector-2.svg',
                    '/images/slider/logo-vector-3.svg',
                    '/images/slider/logo-vector-4.svg'
                ]
            ],
        ];
    }
    
} catch (Exception $e) {
    $result = [
        'success' => false,
        'message' => $e->getMessage()
    ];
}

// Возвращаем результат
echo json_encode($result);
require_once($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/epilog_after.php'); 