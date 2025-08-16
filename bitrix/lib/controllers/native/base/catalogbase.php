<?php
namespace Artamonov\Rest\Controllers\Native\Base;

use Bitrix\Main\{Loader, Context, Web\Json};
use CIBlockElement, CIBlockSection, CIBlock, CModule, CPrice, CCatalogGroup;
use Bitrix\Iblock\InheritedProperty\ElementValues;
use CFile;

/**
 * Базовый класс для работы с каталогом
 */
abstract class CatalogBase
{
    protected int $iBlockId = 0;
    protected array $excludeFields = [];
    protected array $fieldsOnly = [];
    protected array $propertiesOnly = [];
    protected bool $withSeo = false;
    protected bool $withSections = false;
    protected ?string $imageResize = null;
    
    // Параметры для изображений
    protected bool $withImages = true;
    protected array $imageSizes = [];
    
    // Продвинутое исключение полей
    protected array $excludeFieldsList = [];
    protected array $excludePropertiesList = [];
    protected bool $excludeEmptyProperties = false;
    protected bool $excludeSystemProperties = false;
    protected ?string $propertiesPatternExclude = null;
    protected ?string $fieldsPatternExclude = null;
    
    protected string $format = 'full';

    public function __construct()
    {
        $this->initializeModules();
    }

    protected function initializeModules(): void
    {
        if (!config()->get('useNativeRoute')) {
            $this->errorResponse(403, 'Native routes disabled');
        }

        if (!CModule::IncludeModule('iblock')) {
            $this->errorResponse(500, 'IBlock module not installed');
        }

        if (!CModule::IncludeModule('catalog')) {
            $this->errorResponse(500, 'Catalog module not installed');
        }
    }

    /**
     * Парсинг общих параметров запроса
     */
    protected function parseBaseRequest(): void
    {
        $request = request();

        // Основные параметры
        $this->iBlockId = (int)$request->get('iblock_id');

        // Опции исключения и фильтрации
        if ($exclude = $request->get('exclude')) {
            $this->excludeFields = is_array($exclude) ? $exclude : [$exclude];
        }

        if ($fieldsOnly = $request->get('fields_only')) {
            $this->fieldsOnly = is_array($fieldsOnly) ? $fieldsOnly : [$fieldsOnly];
        }

        if ($propertiesOnly = $request->get('properties_only')) {
            $this->propertiesOnly = is_array($propertiesOnly) ? $propertiesOnly : [$propertiesOnly];
        }

        // Продвинутое исключение
        if ($excludeFields = $request->get('exclude_fields')) {
            $this->excludeFieldsList = is_array($excludeFields) ? $excludeFields : [$excludeFields];
        }
        
        if ($excludeProperties = $request->get('exclude_properties')) {
            $this->excludePropertiesList = is_array($excludeProperties) ? $excludeProperties : [$excludeProperties];
        }
        
        $this->excludeEmptyProperties = $request->get('exclude_empty_properties') === 'Y';
        $this->excludeSystemProperties = $request->get('exclude_system_properties') === 'Y';
        $this->propertiesPatternExclude = $request->get('properties_pattern_exclude');
        $this->fieldsPatternExclude = $request->get('fields_pattern_exclude');

        // Параметры изображений
        $this->withImages = $request->get('with_images') !== 'N';
        $this->imageResize = $request->get('image_resize');
        
        if ($imageSizes = $request->get('image_sizes')) {
            $this->imageSizes = is_array($imageSizes) ? $imageSizes : [$imageSizes];
        }

        // Опции вывода
        $this->format = $request->get('format') ?: 'full';
        $this->withSeo = $request->get('with_seo') === 'Y';
        $this->withSections = $request->get('with_sections') === 'Y';
    }

    /**
     * Форматирование элемента (общая логика)
     */
    protected function formatElement(array $fields, array $properties): array
    {
        $item = [];

        // Базовые поля всегда
        $item['id'] = $fields['ID'];
        $item['name'] = $fields['NAME'];

        // Добавляем поля если не исключены
        if (!in_array('fields', $this->excludeFields)) {
            $cleanFields = $this->cleanFields($fields);
            
            if (!empty($this->fieldsOnly)) {
                $cleanFields = array_intersect_key($cleanFields, array_flip($this->fieldsOnly));
            }
            
            if ($this->format !== 'minimal') {
                $item['fields'] = $cleanFields;
            } else {
                $item = array_merge($item, $cleanFields);
            }
        }

        // Добавляем свойства если не исключены
        if (!in_array('properties', $this->excludeFields) && $this->format !== 'minimal') {
            $cleanProperties = $this->cleanProperties($properties);
            
            if (!empty($this->propertiesOnly)) {
                $cleanProperties = array_intersect_key($cleanProperties, array_flip($this->propertiesOnly));
            }
            
            $item['properties'] = $cleanProperties;
        }

        // Изображения
        if ($this->withImages && !in_array('images', $this->excludeFields)) {
            $item['images'] = $this->collectAllImages($fields, $properties);
        }

        // Цены
        if (!in_array('prices', $this->excludeFields) && $this->format !== 'minimal') {
            if ($prices = $this->getPrices((int)$fields['ID'])) {
                $item['prices'] = $prices;
            }
        }

        // SEO данные
        if ($this->withSeo) {
            $item['seo'] = $this->getSeoData((int)$fields['ID']);
        }

        // Информация о разделах
        if ($this->withSections && !empty($fields['IBLOCK_SECTION_ID'])) {
            $item['sections'] = $this->getSectionInfo((int)$fields['IBLOCK_SECTION_ID']);
        }

        return $item;
    }

    // ===== ВСЕ МЕТОДЫ ОБРАБОТКИ ИЗОБРАЖЕНИЙ (копируем из существующего контроллера) =====

    protected function collectAllImages(array $fields, array $properties): array
    {
        $images = [
            'preview' => null,
            'detail' => null,
            'gallery' => [],
            'all' => []
        ];

        // 1. Анонсовое изображение
        if (!empty($fields['PREVIEW_PICTURE'])) {
            $previewImage = $this->processImage((int)$fields['PREVIEW_PICTURE'], 'preview');
            if ($previewImage) {
                $images['preview'] = $previewImage;
                $images['all'][] = $previewImage;
            }
        }

        // 2. Детальное изображение
        if (!empty($fields['DETAIL_PICTURE'])) {
            $detailImage = $this->processImage((int)$fields['DETAIL_PICTURE'], 'detail');
            if ($detailImage) {
                $images['detail'] = $detailImage;
                $images['all'][] = $detailImage;
            }
        }

        // 3. Галерея изображений
        if (!empty($properties['MORE_PHOTO']) && !empty($properties['MORE_PHOTO']['VALUE'])) {
            $morePhotoIds = $properties['MORE_PHOTO']['VALUE'];
            if (!is_array($morePhotoIds)) {
                $morePhotoIds = [$morePhotoIds];
            }

            foreach ($morePhotoIds as $index => $photoId) {
                if ($photoId) {
                    $galleryImage = $this->processImage((int)$photoId, 'gallery', $index);
                    if ($galleryImage) {
                        $images['gallery'][] = $galleryImage;
                        $images['all'][] = $galleryImage;
                    }
                }
            }
        }

        // 4. Поиск изображений в других файловых свойствах
        foreach ($properties as $propCode => $property) {
            if ($propCode === 'MORE_PHOTO') continue;
            
            if ($property['PROPERTY_TYPE'] === 'F' && !empty($property['VALUE'])) {
                $fileIds = is_array($property['VALUE']) ? $property['VALUE'] : [$property['VALUE']];
                
                foreach ($fileIds as $fileId) {
                    if ($fileId && $this->isImageFile($fileId)) {
                        $image = $this->processImage((int)$fileId, 'property_' . strtolower($propCode));
                        if ($image) {
                            $images['all'][] = $image;
                        }
                    }
                }
            }
        }

        return $images;
    }

    protected function processImage(int $fileId, string $type = 'default', ?int $index = null): ?array
    {
        if (!$fileId) return null;

        $rsFile = \CFile::GetByID($fileId);
        if (!$fileInfo = $rsFile->Fetch()) {
            return null;
        }

        if (!$this->isImage($fileInfo['CONTENT_TYPE'])) {
            return null;
        }

        $image = [
            'id' => (int)$fileInfo['ID'],
            'name' => $fileInfo['ORIGINAL_NAME'],
            'size' => (int)$fileInfo['FILE_SIZE'],
            'width' => (int)$fileInfo['WIDTH'],
            'height' => (int)$fileInfo['HEIGHT'],
            'src' => $fileInfo['SRC'],
            'type' => $type,
            'mime_type' => $fileInfo['CONTENT_TYPE'],
        ];

        if ($index !== null) {
            $image['index'] = $index;
        }

        if (!empty($fileInfo['DESCRIPTION'])) {
            $image['alt'] = $fileInfo['DESCRIPTION'];
        }

        // Ресайз
        if ($this->imageResize) {
            $resized = $this->resizeImage($fileId, $this->imageResize);
            if ($resized) {
                $image['resized'] = $resized;
            }
        }

        if (!empty($this->imageSizes)) {
            $image['sizes'] = [];
            foreach ($this->imageSizes as $size) {
                $resized = $this->resizeImage($fileId, $size);
                if ($resized) {
                    $sizeKey = str_replace('x', '_', $size);
                    $image['sizes'][$sizeKey] = $resized;
                }
            }
        }

        // Стандартные размеры
        $standardSizes = [
            'thumb' => '150x150',
            'medium' => '300x300', 
            'large' => '600x600'
        ];

        $image['standard_sizes'] = [];
        foreach ($standardSizes as $sizeName => $sizeString) {
            $resized = $this->resizeImage($fileId, $sizeString);
            if ($resized) {
                $image['standard_sizes'][$sizeName] = $resized;
            }
        }

        return $image;
    }

    // ===== ОСТАЛЬНЫЕ ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ =====

    protected function cleanFields(array $fields): array
    {
        $cleaned = [];
        
        foreach ($fields as $key => $value) {
            if (str_starts_with($key, '~')) continue;
            if (in_array($key, $this->excludeFieldsList)) continue;
            if ($this->fieldsPatternExclude && preg_match('/' . $this->fieldsPatternExclude . '/i', $key)) continue;

            if (in_array($key, ['PREVIEW_PICTURE', 'DETAIL_PICTURE']) && $value) {
                $cleaned[$key] = (int)$value;
            } else {
                $cleaned[$key] = $value;
            }
        }
        
        return $cleaned;
    }

    protected function cleanProperties(array $properties): array
    {
        $cleaned = [];
        
        foreach ($properties as $code => $property) {
            if (in_array($code, $this->excludePropertiesList)) continue;
            if ($this->excludeSystemProperties && str_starts_with($code, 'CML2_')) continue;

            if ($this->excludeEmptyProperties) {
                $value = $property['~VALUE'];
                if ($value === false || $value === '' || $value === null || 
                    (is_array($value) && empty($value))) {
                    continue;
                }
            }

            if ($this->propertiesPatternExclude && preg_match('/' . $this->propertiesPatternExclude . '/i', $code)) continue;

            $cleanProperty = [
                'NAME' => $property['~NAME'],
                'CODE' => $property['CODE'],
                'VALUE' => $property['~VALUE'],
                'DESCRIPTION' => $property['~DESCRIPTION'] ?? null,
                'PROPERTY_TYPE' => $property['PROPERTY_TYPE']
            ];

            if ($property['PROPERTY_TYPE'] === 'F' && $property['VALUE']) {
                $fileIds = is_array($property['VALUE']) ? $property['VALUE'] : [$property['VALUE']];
                $files = [];
                
                foreach ($fileIds as $fileId) {
                    if ($fileId && !$this->isImageFile($fileId)) {
                        $rsFile = \CFile::GetByID($fileId);
                        if ($fileInfo = $rsFile->Fetch()) {
                            $files[] = [
                                'id' => $fileInfo['ID'],
                                'name' => $fileInfo['ORIGINAL_NAME'],
                                'size' => $fileInfo['FILE_SIZE'],
                                'src' => $fileInfo['SRC'],
                                'mime_type' => $fileInfo['CONTENT_TYPE']
                            ];
                        }
                    }
                }
                
                if (!empty($files)) {
                    $cleanProperty['FILES'] = $files;
                }
            }

            $cleaned[$code] = $cleanProperty;
        }
        
        return $cleaned;
    }

    protected function resizeImage(int $fileId, string $size): ?array
    {
        if (!$fileId) return null;
        
        $sizeParams = explode('x', $size);
        if (count($sizeParams) < 2) return null;
        
        $width = (int)$sizeParams[0];
        $height = (int)$sizeParams[1];
        $type = $sizeParams[2] ?? BX_RESIZE_IMAGE_PROPORTIONAL;
        
        $resized = \CFile::ResizeImageGet(
            $fileId,
            ['width' => $width, 'height' => $height],
            $type,
            true
        );
        
        return $resized ?: null;
    }

    protected function isImage(string $contentType): bool
    {
        return strpos($contentType, 'image/') === 0;
    }

    protected function isImageFile(int $fileId): bool
    {
        $rsFile = \CFile::GetByID($fileId);
        if ($fileInfo = $rsFile->Fetch()) {
            return $this->isImage($fileInfo['CONTENT_TYPE']);
        }
        return false;
    }

    protected function getPrices(int $elementId): array
    {
        $prices = [];
        
        $dbPrices = CPrice::GetList(
            ['CATALOG_GROUP_ID' => 'ASC'],
            ['PRODUCT_ID' => $elementId]
        );

        while ($price = $dbPrices->Fetch()) {
            $prices[] = [
                'price_type_id' => $price['CATALOG_GROUP_ID'],
                'price_type_name' => $price['CATALOG_GROUP_NAME'],
                'price' => floatval($price['PRICE']),
                'currency' => $price['CURRENCY'],
                'base' => $price['BASE'] === 'Y'
            ];
        }

        return $prices;
    }

    protected function getSeoData(int $elementId): array
    {
        $seoValues = (new ElementValues($this->iBlockId, $elementId))->getValues();
        
        return [
            'meta_title' => $seoValues['ELEMENT_META_TITLE'] ?? '',
            'meta_description' => $seoValues['ELEMENT_META_DESCRIPTION'] ?? '',
            'meta_keywords' => $seoValues['ELEMENT_META_KEYWORDS'] ?? ''
        ];
    }

    protected function getSectionInfo(int $sectionId): array
    {
        $section = CIBlockSection::GetByID($sectionId)->Fetch();
        
        if (!$section) return [];
        
        return [
            'id' => $section['ID'],
            'name' => $section['NAME'],
            'code' => $section['CODE'],
            'section_page_url' => $section['SECTION_PAGE_URL']
        ];
    }

    protected function validateIBlock(): void
    {
        if ($this->iBlockId <= 0) {
            $this->errorResponse(400, 'Invalid iblock_id parameter');
        }

        $dbIBlock = CIBlock::GetList([], ['ID' => $this->iBlockId, 'ACTIVE' => 'Y']);
        if (!$dbIBlock->Fetch()) {
            $this->errorResponse(404, 'IBlock not found or inactive');
        }
    }

    /**
     * Батчевая обработка URL изображений с кешированием (универсальный метод)
     */
    protected function processImageUrls(array $items, string $imageField = 'PICTURE', string $cachePrefix = 'batch_images'): array
    {
        if (empty($items)) {
            return $items;
        }

        // Извлекаем все ID изображений из элементов
        $pictureIds = [];
        foreach ($items as $item) {
            if (!empty($item[$imageField]) && is_numeric($item[$imageField])) {
                $pictureIds[] = (int)$item[$imageField];
            }
        }

        if (empty($pictureIds)) {
            return $items;
        }

        // Создаем ключ кеша на основе ID изображений
        $pictureIdsHash = md5(implode(',', array_unique($pictureIds)));
        $cacheKey = "{$cachePrefix}_{$this->iBlockId}_{$pictureIdsHash}";
        
        $cache = \Bitrix\Main\Data\Cache::createInstance();
        $cacheDir = '/artamonov/rest/batch_images/';
        $cacheTtl = 3600; // 1 час

        $imageUrls = [];

        if ($cache->initCache($cacheTtl, $cacheKey, $cacheDir)) {
            $imageUrls = $cache->getVars();
        } else {
            $cache->startDataCache();

            // Получаем базовый URL для формирования полных ссылок
            $baseUrl = 'https://' . $_SERVER['HTTP_HOST'];

            // Батчевая обработка изображений
            foreach (array_unique($pictureIds) as $pictureId) {
                $imageUrls[$pictureId] = [
                    'original' => '',
                    'preview' => ''
                ];

                try {
                    // Получаем путь к оригинальному изображению
                    $originalPath = \CFile::GetPath($pictureId);
                    if ($originalPath) {
                        $imageUrls[$pictureId]['original'] = $baseUrl . $originalPath;
                    }

                    // Создаем превью 300x300 с сохранением пропорций
                    $resizeResult = \CFile::ResizeImageGet(
                        $pictureId,
                        ['width' => 300, 'height' => 300],
                        BX_RESIZE_IMAGE_PROPORTIONAL,
                        true
                    );

                    if ($resizeResult && !empty($resizeResult['src'])) {
                        $imageUrls[$pictureId]['preview'] = $baseUrl . $resizeResult['src'];
                    }
                } catch (\Exception $e) {
                    // В случае ошибки оставляем пустые строки
                    \Bitrix\Main\Diag\Debug::writeToFile(
                        [
                            'error' => 'Failed to process image',
                            'picture_id' => $pictureId,
                            'message' => $e->getMessage()
                        ],
                        'Batch Image Processing Error',
                        '/local/logs/rest_api.log'
                    );
                }
            }

            $cache->endDataCache($imageUrls);
        }

        // Дополняем элементы новыми полями с URL изображений
        foreach ($items as &$item) {
            if (!empty($item[$imageField]) && is_numeric($item[$imageField])) {
                $pictureId = (int)$item[$imageField];
                
                if (isset($imageUrls[$pictureId])) {
                    $item[$imageField . '_SRC'] = $imageUrls[$pictureId]['original'];
                    $item[$imageField . '_PREVIEW_SRC'] = $imageUrls[$pictureId]['preview'];
                } else {
                    $item[$imageField . '_SRC'] = '';
                    $item[$imageField . '_PREVIEW_SRC'] = '';
                }
            } else {
                $item[$imageField . '_SRC'] = '';
                $item[$imageField . '_PREVIEW_SRC'] = '';
            }
        }

        return $items;
    }

    /**
     * Форматирование свойств элемента
     */
    protected function formatProperties(array $properties): array
    {
        $formatted = [];
        
        foreach ($properties as $code => $property) {
            // Пропускаем исключенные свойства
            if (in_array($code, $this->excludePropertiesList)) continue;
            if ($this->excludeSystemProperties && str_starts_with($code, 'CML2_')) continue;

            // Пропускаем пустые если включено исключение
            if ($this->excludeEmptyProperties) {
                $value = $property['~VALUE'];
                if ($value === false || $value === '' || $value === null || 
                    (is_array($value) && empty($value))) {
                    continue;
                }
            }

            // Паттерн исключения
            if ($this->propertiesPatternExclude && preg_match('/' . $this->propertiesPatternExclude . '/i', $code)) continue;

            $formatted[$code] = [
                'NAME' => $property['~NAME'],
                'CODE' => $property['CODE'],
                'VALUE' => $property['~VALUE'],
                'DESCRIPTION' => $property['~DESCRIPTION'] ?? null,
                'PROPERTY_TYPE' => $property['PROPERTY_TYPE']
            ];
        }
        
        return $formatted;
    }

    protected function errorResponse(int $code, string $message): void
    {
        response()
            ->json(['error' => $message], $code)
            ->send();
        exit;
    }
}
