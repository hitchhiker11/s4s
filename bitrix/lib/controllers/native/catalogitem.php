<?php
namespace Artamonov\Rest\Controllers\Native;

use Artamonov\Rest\Controllers\Native\Base\CatalogBase;
use CIBlockElement;

/**
 * Контроллер для получения единичного товара каталога
 */
class CatalogItem extends CatalogBase
{
    private int $elementId = 0;
    private ?string $elementCode = null;
    private array $select = [
        'ID', 'IBLOCK_ID', 'NAME', 
		'CATALOG_QUANTITY', 'CATALOG_QUANTITY_RESERVED', 'CATALOG_QUANTITY_TRACE', 'CATALOG_QUANTITY_TRACE_ORIG', 
		'DATE_ACTIVE_FROM', 'DATE_ACTIVE_TO', 
        'DETAIL_PAGE_URL', 'PREVIEW_PICTURE', 'DETAIL_PICTURE',
        'PREVIEW_TEXT', 'PREVIEW_TEXT_TYPE', 'DETAIL_TEXT', 'DETAIL_TEXT_TYPE',
        'CODE', 'EXTERNAL_ID', 'TAGS', 'IBLOCK_SECTION_ID',
        'DATE_CREATE', 'CREATED_BY', 'TIMESTAMP_X', 'MODIFIED_BY'
    ];
    
    // Дополнительные возможности для единичного товара
    private bool $withRelated = false;        // Похожие товары
    private bool $withReviews = false;        // Отзывы 
    private bool $withOffers = false;         // Торговые предложения
    private bool $withAvailability = false;   // Детальная информация о наличии
    private bool $withSimilarSections = false; // Товары из того же раздела

    public function _get(): void
    {
        try {
            $this->parseRequest();
            $this->validateRequest();
            
            $element = $this->getCatalogElement();
            
            if (!$element) {
                $this->errorResponse(404, 'Element not found');
            }

            $response = $this->buildResponse($element);
            response()->json($response);

        } catch (\Exception $e) {
            \Bitrix\Main\Diag\Debug::writeToFile(
                [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                    'request_params' => request()->getInput()
                ],
                'CatalogItem API Error',
                '/local/logs/rest_api.log'
            );
            
            $this->errorResponse(500, $e->getMessage());
        }
    }

    private function parseRequest(): void
    {
        // Парсим базовые параметры
        $this->parseBaseRequest();
        
        $request = request();

        // ID или CODE элемента
        $this->elementId = (int)$request->get('id');
        $this->elementCode = $request->get('code');

        // Дополнительные данные для единичного товара
        $this->withRelated = $request->get('with_related') === 'Y';
        $this->withReviews = $request->get('with_reviews') === 'Y';
        $this->withOffers = $request->get('with_offers') === 'Y';
        $this->withAvailability = $request->get('with_availability') === 'Y';
        $this->withSimilarSections = $request->get('with_similar') === 'Y';

        // Дополнительные поля для выборки
        if ($selectParam = $request->get('select')) {
            if (is_array($selectParam)) {
                $this->select = array_merge($this->select, $selectParam);
                $this->select = array_unique($this->select);
            }
        }
    }

    private function validateRequest(): void
    {
        $this->validateIBlock();

        if (!$this->elementId && !$this->elementCode) {
            $this->errorResponse(400, 'Element ID or CODE is required');
        }

        if (!in_array($this->format, ['full', 'compact', 'minimal'])) {
            $this->errorResponse(400, 'Invalid format parameter');
        }
    }

    private function getCatalogElement(): ?array
    {
        $filter = ['IBLOCK_ID' => $this->iBlockId];
        
        if ($this->elementId) {
            $filter['ID'] = $this->elementId;
        } elseif ($this->elementCode) {
            $filter['CODE'] = $this->elementCode;
        }

        $res = CIBlockElement::GetList(
            [],
            $filter,
            false,
            false,
            $this->select
        );

        if ($elementObj = $res->GetNextElement()) {
            $fields = $elementObj->GetFields();
            $properties = $elementObj->GetProperties();

            $item = $this->formatElement($fields, $properties);
            
            // Добавляем дополнительную информацию
            $this->enrichWithAdditionalData($item, $fields);
            
            return $item;
        }

        return null;
    }

    /**
     * Обогащение единичного товара дополнительной информацией
     */
    private function enrichWithAdditionalData(array &$item, array $fields): void
    {
        $elementId = (int)$fields['ID'];

        // Торговые предложения (SKU)
        if ($this->withOffers && \CModule::IncludeModule('catalog')) {
            $item['offers'] = $this->getOffers($elementId);
        }

        // Детальная информация о наличии
        if ($this->withAvailability) {
            $item['availability'] = $this->getDetailedAvailability($elementId);
        }

        // Похожие товары
        if ($this->withRelated) {
            $item['related'] = $this->getRelatedProducts($elementId);
        }

        // Отзывы (если есть соответствующий модуль или инфоблок)
        if ($this->withReviews) {
            $item['reviews'] = $this->getReviews($elementId);
        }

        // Товары из того же раздела
        if ($this->withSimilarSections && !empty($fields['IBLOCK_SECTION_ID'])) {
            $item['similar_in_section'] = $this->getSimilarInSection($elementId, (int)$fields['IBLOCK_SECTION_ID']);
        }
    }

    /**
     * Получение торговых предложений
     */
    private function getOffers(int $elementId): array
    {
        if (!\CModule::IncludeModule('catalog')) {
            return [];
        }

        $offers = [];
        
        // Получаем инфоблок торговых предложений
        $catalog = \CCatalog::GetByID($this->iBlockId);
        if (!$catalog || !$catalog['OFFERS_IBLOCK_ID']) {
            return [];
        }

        $offersIBlockId = $catalog['OFFERS_IBLOCK_ID'];
        
        $res = CIBlockElement::GetList(
            ['SORT' => 'ASC'],
            [
                'IBLOCK_ID' => $offersIBlockId,
                'PROPERTY_CML2_LINK' => $elementId,
                'ACTIVE' => 'Y'
            ],
            false,
            false,
            [
                'ID', 'NAME', 'XML_ID', 'DETAIL_PICTURE', 'PREVIEW_PICTURE'
            ]
        );

        while ($offerObj = $res->GetNextElement()) {
            $offerFields = $offerObj->GetFields();
            $offerProperties = $offerObj->GetProperties();
            
            $offer = $this->formatElement($offerFields, $offerProperties);
            $offers[] = $offer;
        }

        return $offers;
    }

    /**
     * Получение детальной информации о наличии
     */
    private function getDetailedAvailability(int $elementId): array
    {
        if (!\CModule::IncludeModule('catalog')) {
            return [];
        }

        $product = \CCatalogProduct::GetByID($elementId);
        if (!$product) {
            return [];
        }

        return [
            'quantity' => floatval($product['QUANTITY']),
            'available' => $product['AVAILABLE'] === 'Y',
            'can_buy_zero' => $product['CAN_BUY_ZERO'] === 'Y',
            'negative_amount_trace' => $product['NEGATIVE_AMOUNT_TRACE'] === 'Y',
            'quantity_trace' => $product['QUANTITY_TRACE'] === 'Y',
            'measure' => $this->getMeasure($product['MEASURE']),
            'weight' => floatval($product['WEIGHT']),
            'width' => floatval($product['WIDTH']),
            'length' => floatval($product['LENGTH']),
            'height' => floatval($product['HEIGHT'])
        ];
    }

    /**
     * Получение единицы измерения
     */
    private function getMeasure(int $measureId): ?array
    {
        if (!\CModule::IncludeModule('catalog') || !$measureId) {
            return null;
        }

        $measure = \CCatalogMeasure::GetByID($measureId);
        return $measure ?: null;
    }

    /**
     * Получение похожих товаров
     */
    private function getRelatedProducts(int $elementId): array
    {
        // Здесь может быть логика поиска похожих товаров
        // по тегам, свойствам, разделу и т.д.
        return [];
    }

    /**
     * Получение отзывов
     */
    private function getReviews(int $elementId): array
    {
        // Здесь может быть логика получения отзывов
        // из отдельного инфоблока или модуля отзывов
        return [];
    }

    /**
     * Получение товаров из того же раздела
     */
    private function getSimilarInSection(int $elementId, int $sectionId): array
    {
        $similar = [];
        
        $res = CIBlockElement::GetList(
            ['RAND' => 'ASC'],
            [
                'IBLOCK_ID' => $this->iBlockId,
                'SECTION_ID' => $sectionId,
                '!ID' => $elementId,
                'ACTIVE' => 'Y'
            ],
            false,
            ['nTopCount' => 6], // Лимит на 6 товаров
            ['ID', 'NAME', 'PREVIEW_PICTURE', 'DETAIL_PAGE_URL']
        );

        while ($element = $res->GetNextElement()) {
            $fields = $element->GetFields();
            $properties = $element->GetProperties();
            
            $similar[] = $this->formatElement($fields, $properties);
        }

        return $similar;
    }

    private function buildResponse(array $element): array
    {
        return [
            'meta' => [
                'iblock_id' => $this->iBlockId,
                'element_id' => $this->elementId,
                'element_code' => $this->elementCode,
                'format' => $this->format,
                'request_time' => date('Y-m-d H:i:s'),
                'additional_data' => [
                    'with_offers' => $this->withOffers,
                    'with_related' => $this->withRelated,
                    'with_reviews' => $this->withReviews,
                    'with_availability' => $this->withAvailability,
                    'with_similar' => $this->withSimilarSections
                ]
            ],
            'data' => $element
        ];
    }
}
