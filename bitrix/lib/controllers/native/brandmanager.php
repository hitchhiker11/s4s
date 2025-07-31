<?php
namespace Artamonov\Rest\Controllers\Native;

use Artamonov\Rest\Controllers\Native\Base\CatalogBase;
use Bitrix\Main\{Loader, Type\Dictionary, Diag\Debug};
use Bitrix\Iblock\{PropertyEnumerationTable, Elements\ElementTable, PropertyTable};
use CIBlockElement, CIBlockSection, CIBlock, CModule;

/**
 * Контроллер для управления брендами каталога
 * Создание, синхронизация и связывание товаров с брендами
 */
class BrandManager extends CatalogBase
{
    // Основные настройки
    private int $catalogIBlockId = 21;
    private int $brandsIBlockId = 22;
    private string $brandProperty = 'BREND';
    private string $brandElementProperty = 'BRAND_ELEMENT';
    
    // Режимы работы
    private string $action = 'sync';
    private bool $forceUpdate = false;
    private bool $dryRun = false;
    private bool $linkProducts = true;
    
    // Опции
    private bool $withLogging = true;
    private bool $withReport = true;
    private int $batchSize = 100;
    
    // Результаты выполнения
    private array $operationResult = [];
    private array $errors = [];
    private array $debugLog = [];
    private float $startTime = 0;

    public function __construct()
    {
        parent::__construct();
        $this->startTime = microtime(true);
    }

    /**
     * POST-метод для управления брендами
     */
    public function _post(): void
    {
        try {
            $this->parseRequest();
            $this->validateRequest();
            
            $this->logOperation('start', [
                'action' => $this->action,
                'dry_run' => $this->dryRun,
                'catalog_iblock_id' => $this->catalogIBlockId,
                'brands_iblock_id' => $this->brandsIBlockId
            ]);
            
            switch ($this->action) {
                case 'sync':
                    $result = $this->performFullSync();
                    break;
                case 'create':
                    $result = $this->createBrandsOnly();
                    break;
                case 'update':
                    $result = $this->updateExistingBrands();
                    break;
                case 'check':
                    $result = $this->checkBrandConsistency();
                    break;
                default:
                    throw new \InvalidArgumentException('Unknown action: ' . $this->action);
            }
            
            $executionTime = microtime(true) - $this->startTime;
            $result['meta']['execution_time'] = round($executionTime, 3);
            $result['meta']['timestamp'] = date('Y-m-d H:i:s');
            $result['meta']['dry_run'] = $this->dryRun;
            
            // Добавляем debug лог в ответ
            if (!empty($this->debugLog)) {
                $result['debug_log'] = $this->debugLog;
            }
            
            $this->logOperation('complete', $result);
            response()->json($result);
            
        } catch (\Exception $e) {
            $this->logError($e);
            $this->errorResponse(500, $e->getMessage());
        }
    }

    /**
     * GET-метод для получения статуса системы брендов
     */
    public function _get(): void
    {
        try {
            $this->parseRequest();
            $this->validateRequest();
            
            $status = $this->getSystemStatus();
            
            // Добавляем debug лог в ответ
            if (!empty($this->debugLog)) {
                $status['debug_log'] = $this->debugLog;
            }
            
            response()->json($status);
            
        } catch (\Exception $e) {
            $this->logError($e);
            $this->errorResponse(500, $e->getMessage());
        }
    }

    /**
     * DELETE-метод для очистки несвязанных брендов
     */
    public function _delete(): void
    {
        try {
            $this->parseRequest();
            $this->validateRequest();
            
            $result = $this->cleanupOrphanedBrands();
            response()->json($result);
            
        } catch (\Exception $e) {
            $this->logError($e);
            $this->errorResponse(500, $e->getMessage());
        }
    }

    /**
     * Получение отчета о последней операции
     */
    public function getReport(): void
    {
        try {
            $report = $this->getLastOperationReport();
            response()->json($report);
            
        } catch (\Exception $e) {
            $this->errorResponse(500, $e->getMessage());
        }
    }

    /**
     * Парсинг параметров запроса
     */
    private function parseRequest(): void
    {
        $request = request();

        // Основные параметры
        $this->action = $request->get('action') ?: 'sync';
        $this->catalogIBlockId = (int)($request->get('catalog_iblock_id') ?: 21);
        $this->brandsIBlockId = (int)($request->get('brands_iblock_id') ?: 22);
        
        // Настройки свойств
        $this->brandProperty = $request->get('brand_property') ?: 'BREND';
        $this->brandElementProperty = $request->get('brand_element_property') ?: 'BRAND_ELEMENT';
        
        // Опции выполнения
        $this->forceUpdate = $request->get('force_update') === 'Y';
        $this->dryRun = $request->get('dry_run') === 'Y';
        $this->linkProducts = $request->get('link_products') !== 'N';
        $this->withLogging = $request->get('with_logging') !== 'N';
        $this->batchSize = max(10, min((int)($request->get('batch_size') ?: 100), 1000));
    }

    /**
     * Валидация параметров запроса
     */
    private function validateRequest(): void
    {
        // Проверяем инфоблок каталога
        $this->iBlockId = $this->catalogIBlockId;
        $this->validateIBlock();
        
        // Проверяем инфоблок брендов
        if (!$this->validateBrandsIBlock()) {
            $this->errorResponse(404, 'Brands iblock not found or inactive');
        }
        
        // Проверяем действие
        if (!in_array($this->action, ['sync', 'create', 'update', 'check'])) {
            $this->errorResponse(400, 'Invalid action parameter');
        }
        
        // Проверяем свойства
        if (!$this->validateBrandProperty()) {
            $this->errorResponse(400, "Brand property '{$this->brandProperty}' not found in catalog");
        }
        
        if (!$this->validateBrandElementProperty()) {
            $this->errorResponse(400, "Brand element property '{$this->brandElementProperty}' not found in catalog");
        }
    }

    /**
     * Полная синхронизация брендов
     */
    private function performFullSync(): array
    {
        $result = [
            'status' => 'success',
            'action' => 'sync',
            'meta' => [
                'catalog_iblock_id' => $this->catalogIBlockId,
                'brands_iblock_id' => $this->brandsIBlockId
            ],
            'results' => [
                'brands' => [],
                'products' => []
            ]
        ];

        // Создаем/обновляем бренды
        $this->addDebugLog("Начинаем создание брендов");
        $brandsResult = $this->createBrandsFromCatalog();
        $result['results']['brands'] = $brandsResult;
        $this->addDebugLog("Создание брендов завершено", [
            'created' => $brandsResult['created'],
            'errors' => $brandsResult['errors_count']
        ]);

        // Связываем товары с брендами
        if ($this->linkProducts && $brandsResult['errors_count'] === 0) {
            $this->addDebugLog("Начинаем связывание товаров с брендами");
            $productsResult = $this->linkProductsToBrands();
            $result['results']['products'] = $productsResult;
            $this->addDebugLog("Связывание товаров завершено", [
                'linked' => $productsResult['linked'],
                'errors' => $productsResult['errors']
            ]);
            
            // Если есть несвязанные товары, пытаемся создать недостающие алиасы
            if (!empty($productsResult['missing_brands_stats'])) {
                $this->addDebugLog("Пытаемся создать алиасы для недостающих брендов");
                $aliasResult = $this->createMissingBrandAliases($productsResult['missing_brands_stats']);
                $result['results']['brand_aliases'] = $aliasResult;
                
                // Повторно связываем товары после создания алиасов
                if ($aliasResult['created'] > 0) {
                    $this->addDebugLog("Повторное связывание после создания алиасов");
                    $secondLinkResult = $this->linkProductsToBrands();
                    $result['results']['products_second_pass'] = $secondLinkResult;
                }
            }
        } else {
            $this->addDebugLog("Связывание пропущено", [
                'link_products' => $this->linkProducts,
                'brand_errors' => $brandsResult['errors_count']
            ]);
        }

        // Добавляем рекомендации
        $result['recommendations'] = $this->getRecommendations($brandsResult, $result['results']['products'] ?? []);

        return $result;
    }

    /**
     * Создание брендов из каталога
     */
    private function createBrandsFromCatalog(): array
    {
        $brandValues = $this->extractUniqueBrandValues();
        $created = [];
        $updated = [];
        $skipped = [];
        $errors = [];

        foreach ($brandValues as $index => $brandData) {
            try {
                // Логирование для первых 5 брендов
                if ($index < 5) {
                    $this->addDebugLog("Обработка бренда #{$index}", [
                        'name' => $brandData['name'],
                        'code' => $brandData['code'],
                        'dry_run' => $this->dryRun
                    ]);
                }
                
                if ($this->dryRun) {
                    $created[] = $brandData['name'];
                    continue;
                }

                // Проверяем существование
                $existingBrand = $this->findBrandByName($brandData['name']);

                if ($existingBrand && !$this->forceUpdate) {
                    $skipped[] = $brandData['name'];
                    if ($index < 5) {
                        $this->addDebugLog("Бренд пропущен (уже существует)", [
                            'name' => $brandData['name'],
                            'existing_id' => $existingBrand['ID']
                        ]);
                    }
                    continue;
                }

                if ($existingBrand && $this->forceUpdate) {
                    $result = $this->updateBrand($existingBrand['ID'], $brandData);
                    $updated[] = $result;
                    if ($index < 5) {
                        $this->addDebugLog("Бренд обновлен", $result);
                    }
                } else {
                    $result = $this->createBrand($brandData);
                    $created[] = $result;
                    if ($index < 5) {
                        $this->addDebugLog("Бренд создан", $result);
                    }
                }

            } catch (\Exception $e) {
                $errors[] = [
                    'brand' => $brandData['name'],
                    'error' => $e->getMessage()
                ];
                $this->addDebugLog("Ошибка при создании/обновлении бренда", [
                    'brand' => $brandData['name'],
                    'error' => $e->getMessage()
                ]);
                $this->logError($e, ['brand' => $brandData['name']]);
            }
        }

        return [
            'total_processed' => count($brandValues),
            'created' => count($created),
            'updated' => count($updated),
            'skipped' => count($skipped),
            'errors_count' => count($errors),
            'details' => [
                'created' => $created,
                'updated' => $updated,
                'skipped' => $skipped,
                'errors' => $errors
            ]
        ];
    }

    /**
     * Извлечение уникальных значений брендов из каталога
     */
    private function extractUniqueBrandValues(): array
    {
        $brandValues = [];
        
        // Получаем информацию о свойстве
        $propertyInfo = $this->getBrandPropertyInfo();
        
        if (!$propertyInfo) {
            $this->addDebugLog("Свойство {$this->brandProperty} не найдено в инфоблоке {$this->catalogIBlockId}");
            return [];
        }
        
        $this->addDebugLog("Найдено свойство бренда", [
            'property_id' => $propertyInfo['ID'],
            'property_type' => $propertyInfo['PROPERTY_TYPE'],
            'property_code' => $propertyInfo['CODE']
        ]);

        // В зависимости от типа свойства извлекаем значения
        switch ($propertyInfo['PROPERTY_TYPE']) {
            case 'L': // Список
                $brandValues = $this->extractBrandsFromList($propertyInfo['ID']);
                break;
            case 'S': // Строка
            case 'N': // Число
                $brandValues = $this->extractBrandsFromElements($propertyInfo['ID']);
                break;
            default:
                $this->addDebugLog("Неподдерживаемый тип свойства: {$propertyInfo['PROPERTY_TYPE']}");
                return [];
        }

        $this->addDebugLog("Извлечено уникальных брендов: " . count($brandValues), [
            'brands' => array_slice(array_column($brandValues, 'name'), 0, 10) // первые 10 для лога
        ]);

        $this->logOperation('extracted_brands', [
            'count' => count($brandValues),
            'property_type' => $propertyInfo['PROPERTY_TYPE'],
            'brands' => array_column($brandValues, 'name')
        ]);

        return $brandValues;
    }

    /**
     * Получение информации о свойстве бренда
     */
    private function getBrandPropertyInfo(): ?array
    {
        $dbProperty = PropertyTable::getList([
            'filter' => [
                'IBLOCK_ID' => $this->catalogIBlockId,
                'CODE' => $this->brandProperty,
                'ACTIVE' => 'Y'
            ],
            'select' => ['ID', 'CODE', 'PROPERTY_TYPE', 'NAME']
        ]);
        
        return $dbProperty->fetch() ?: null;
    }

    /**
     * Извлечение брендов из списка (тип L)
     */
    private function extractBrandsFromList(int $propertyId): array
    {
        $brandValues = [];
        
        $propertyEnums = PropertyEnumerationTable::getList([
            'select' => ['ID', 'VALUE', 'SORT'],
            'filter' => ['PROPERTY_ID' => $propertyId],
            'order' => ['VALUE' => 'ASC']
        ]);

        while ($enumFields = $propertyEnums->fetch()) {
            if (empty(trim($enumFields['VALUE']))) {
                continue;
            }

            $translitCode = $this->generateBrandCode($enumFields['VALUE']);
            
            $brandValues[] = [
                'name' => trim($enumFields['VALUE']),
                'code' => $translitCode,
                'sort' => $enumFields['SORT'] ?: 500,
                'enum_id' => $enumFields['ID']
            ];
        }

        $this->addDebugLog("Извлечено из списка", ['count' => count($brandValues)]);
        return $brandValues;
    }

    /**
     * Извлечение брендов из значений элементов (тип S, N)
     */
    private function extractBrandsFromElements(int $propertyId): array
    {
        $brandValues = [];
        $uniqueBrands = [];
        
        // Получаем уникальные значения свойства из элементов
        $res = CIBlockElement::GetList(
            [],
            [
                'IBLOCK_ID' => $this->catalogIBlockId,
                'ACTIVE' => 'Y',
                "!PROPERTY_{$this->brandProperty}" => false
            ],
            false,
            false,
            ['ID', "PROPERTY_{$this->brandProperty}"]
        );

        $processedCount = 0;
        while ($element = $res->GetNextElement()) {
            $fields = $element->GetFields();
            $brandValue = $fields["PROPERTY_{$this->brandProperty}_VALUE"];
            
            $processedCount++;
            
            if (!$brandValue || empty(trim($brandValue))) {
                continue;
            }
            
            $brandValue = trim($brandValue);
            
            // Добавляем только уникальные значения
            if (!isset($uniqueBrands[$brandValue])) {
                $uniqueBrands[$brandValue] = true;
                
                $translitCode = $this->generateBrandCode($brandValue);
                
                $brandValues[] = [
                    'name' => $brandValue,
                    'code' => $translitCode,
                    'sort' => 500,
                    'source' => 'element_property'
                ];
            }
        }

        $this->addDebugLog("Обработано элементов: {$processedCount}, найдено уникальных брендов: " . count($brandValues));
        return $brandValues;
    }

    /**
     * Создание элемента бренда
     */
    private function createBrand(array $brandData): array
    {
        $el = new CIBlockElement;
        
        $arLoadProductArray = [
            'IBLOCK_ID' => $this->brandsIBlockId,
            'NAME' => $brandData['name'],
            'ACTIVE' => 'Y',
            'CODE' => $brandData['code'],
            'SORT' => $brandData['sort'],
            'PREVIEW_TEXT' => "Бренд {$brandData['name']}",
            'DETAIL_TEXT' => "Товары бренда {$brandData['name']}",
        ];

        $brandId = $el->Add($arLoadProductArray);
        
        if (!$brandId) {
            throw new \Exception("Failed to create brand: " . $el->LAST_ERROR);
        }

        $result = [
            'id' => $brandId,
            'name' => $brandData['name'],
            'code' => $brandData['code'],
            'action' => 'created'
        ];

        $this->logOperation('brand_created', $result);
        
        return $result;
    }

    /**
     * Обновление существующего бренда
     */
    private function updateBrand(int $brandId, array $brandData): array
    {
        $el = new CIBlockElement;
        
        $arLoadProductArray = [
            'NAME' => $brandData['name'],
            'CODE' => $brandData['code'],
            'SORT' => $brandData['sort'],
            'PREVIEW_TEXT' => "Бренд {$brandData['name']}",
            'DETAIL_TEXT' => "Товары бренда {$brandData['name']}",
        ];

        $result = $el->Update($brandId, $arLoadProductArray);
        
        if (!$result) {
            throw new \Exception("Failed to update brand: " . $el->LAST_ERROR);
        }

        $resultData = [
            'id' => $brandId,
            'name' => $brandData['name'],
            'code' => $brandData['code'],
            'action' => 'updated'
        ];

        $this->logOperation('brand_updated', $resultData);
        
        return $resultData;
    }

    /**
     * Связывание товаров с брендами
     */
    private function linkProductsToBrands(): array
    {
        $linkedCount = 0;
        $alreadyLinkedCount = 0;
        $errorCount = 0;
        $processedCount = 0;
        $skippedCount = 0;
        $brandMapping = $this->getBrandMapping();
        
        // Детальное логирование
        $this->addDebugLog("Получен маппинг брендов", [
            'total_brands_in_mapping' => count($brandMapping),
            'brand_names' => array_keys($brandMapping)
        ]);

        $unlinkedProducts = [];
        $brandNotFoundStats = [];

        $res = CIBlockElement::GetList(
            [],
            [
                'IBLOCK_ID' => $this->catalogIBlockId,
                'ACTIVE' => 'Y',
                "!PROPERTY_{$this->brandProperty}" => false
            ],
            false,
            false,
            ['ID', 'NAME', "PROPERTY_{$this->brandProperty}", "PROPERTY_{$this->brandElementProperty}"]
        );

        while ($element = $res->GetNextElement()) {
            $fields = $element->GetFields();
            $processedCount++;
            
            $brandName = $fields["PROPERTY_{$this->brandProperty}_VALUE"];
            $currentBrandElementId = $fields["PROPERTY_{$this->brandElementProperty}_VALUE"];
            $elementId = $fields['ID'];
            $elementName = $fields['NAME'];
            
            // Логирование для первых 5 элементов
            if ($processedCount <= 5) {
                $this->addDebugLog("Обработка товара #{$processedCount}", [
                    'element_id' => $elementId,
                    'element_name' => $elementName,
                    'brand_value' => $brandName,
                    'current_brand_element_id' => $currentBrandElementId,
                    'brand_exists_in_mapping' => isset($brandMapping[$brandName])
                ]);
            }
            
            // Если у товара нет бренда
            if (!$brandName || empty(trim($brandName))) {
                $skippedCount++;
                $unlinkedProducts[] = [
                    'id' => $elementId,
                    'name' => $elementName,
                    'reason' => 'empty_brand',
                    'brand_value' => $brandName
                ];
                continue;
            }
            
            // Если бренд не найден в маппинге
            if (!isset($brandMapping[$brandName])) {
                $skippedCount++;
                $unlinkedProducts[] = [
                    'id' => $elementId,
                    'name' => $elementName,
                    'reason' => 'brand_not_found_in_mapping',
                    'brand_value' => $brandName
                ];
                
                // Статистика по несуществующим брендам
                if (!isset($brandNotFoundStats[$brandName])) {
                    $brandNotFoundStats[$brandName] = 0;
                }
                $brandNotFoundStats[$brandName]++;
                continue;
            }

            $targetBrandId = $brandMapping[$brandName];

            // Проверяем, не связан ли уже товар с правильным брендом
            if ($currentBrandElementId == $targetBrandId) {
                $alreadyLinkedCount++;
                continue;
            }

            try {
                if (!$this->dryRun) {
                    CIBlockElement::SetPropertyValueCode(
                        $elementId,
                        $this->brandElementProperty,
                        $targetBrandId
                    );
                }
                $linkedCount++;
                
                // Логирование успешных связываний
                if ($linkedCount <= 5) {
                    $this->addDebugLog("Успешно связан товар", [
                        'element_id' => $elementId,
                        'element_name' => $elementName,
                        'brand_name' => $brandName,
                        'brand_id' => $targetBrandId
                    ]);
                }

            } catch (\Exception $e) {
                $errorCount++;
                $unlinkedProducts[] = [
                    'id' => $elementId,
                    'name' => $elementName,
                    'reason' => 'linking_error',
                    'brand_value' => $brandName,
                    'error' => $e->getMessage()
                ];
                
                $this->logError($e, [
                    'element_id' => $elementId,
                    'brand_name' => $brandName,
                    'target_brand_id' => $targetBrandId
                ]);
            }

            // Обработка по пакетам для производительности
            if ($processedCount % $this->batchSize === 0) {
                $this->addDebugLog("Обработано {$processedCount} товаров", [
                    'linked' => $linkedCount,
                    'already_linked' => $alreadyLinkedCount,
                    'skipped' => $skippedCount,
                    'errors' => $errorCount
                ]);
                
                $this->logOperation('batch_processed', [
                    'processed' => $processedCount,
                    'linked' => $linkedCount,
                    'errors' => $errorCount
                ]);
            }
        }

        // Финальное логирование
        $this->addDebugLog("Связывание завершено", [
            'total_processed' => $processedCount,
            'linked' => $linkedCount,
            'already_linked' => $alreadyLinkedCount,
            'skipped' => $skippedCount,
            'errors' => $errorCount,
            'unlinked_count' => count($unlinkedProducts)
        ]);

        if (!empty($brandNotFoundStats)) {
            $this->addDebugLog("Бренды не найденные в маппинге", [
                'missing_brands' => $brandNotFoundStats,
                'total_missing_brands' => count($brandNotFoundStats)
            ]);
        }

        if (!empty($unlinkedProducts)) {
            $this->addDebugLog("Первые 10 несвязанных товаров", [
                'unlinked_products' => array_slice($unlinkedProducts, 0, 10)
            ]);
        }

        return [
            'total_processed' => $processedCount,
            'linked' => $linkedCount,
            'already_linked' => $alreadyLinkedCount,
            'errors' => $errorCount,
            'skipped' => $skippedCount,
            'unlinked' => count($unlinkedProducts),
            'unlinked_products' => $unlinkedProducts,
            'missing_brands_stats' => $brandNotFoundStats
        ];
    }

    /**
     * Получение маппинга брендов название => ID элемента
     */
    private function getBrandMapping(): array
    {
        $mapping = [];
        $caseInsensitiveMapping = [];
        
        $this->addDebugLog("Начинаем получение маппинга брендов из инфоблока {$this->brandsIBlockId}");
        
        $res = CIBlockElement::GetList(
            [],
            [
                'IBLOCK_ID' => $this->brandsIBlockId,
                'ACTIVE' => 'Y'
            ],
            false,
            false,
            ['ID', 'NAME']
        );

        $brandCount = 0;
        $duplicates = [];
        
        while ($brand = $res->GetNext()) {
            $brandName = $brand['NAME'];
            $brandId = $brand['ID'];
            
            // Точное соответствие
            $mapping[$brandName] = $brandId;
            
            // Регистронезависимое соответствие
            $lowerName = strtolower(trim($brandName));
            
            if (isset($caseInsensitiveMapping[$lowerName])) {
                $duplicates[] = [
                    'existing' => $caseInsensitiveMapping[$lowerName],
                    'duplicate' => ['name' => $brandName, 'id' => $brandId]
                ];
            }
            
            $caseInsensitiveMapping[$lowerName] = [
                'name' => $brandName,
                'id' => $brandId
            ];
            
            $brandCount++;
            
            // Логируем первые 10 брендов
            if ($brandCount <= 10) {
                $this->addDebugLog("Бренд #{$brandCount} в маппинге", [
                    'id' => $brandId,
                    'name' => $brandName,
                    'lower_key' => $lowerName
                ]);
            }
        }

        // Логируем найденные дубликаты
        if (!empty($duplicates)) {
            $this->addDebugLog("Найдены дубликаты брендов", [
                'duplicates' => $duplicates,
                'count' => count($duplicates)
            ]);
        }

        // Создаем расширенный маппинг с учетом регистра
        $extendedMapping = $mapping;
        
        foreach ($caseInsensitiveMapping as $lowerKey => $brandInfo) {
            // Добавляем все возможные варианты написания
            $variations = [
                $lowerKey,                    // glock
                ucfirst($lowerKey),          // Glock  
                strtoupper($lowerKey),       // GLOCK
                ucwords($lowerKey),          // Glock (для составных имен)
            ];
            
            foreach ($variations as $variation) {
                if (!isset($extendedMapping[$variation])) {
                    $extendedMapping[$variation] = $brandInfo['id'];
                }
            }
        }

        $this->addDebugLog("Маппинг брендов создан", [
            'total_brands' => $brandCount,
            'exact_mapping_size' => count($mapping),
            'extended_mapping_size' => count($extendedMapping),
            'duplicates_found' => count($duplicates)
        ]);

        return $extendedMapping;
    }

    /**
     * Поиск бренда по названию
     */
    private function findBrandByName(string $name): ?array
    {
        $res = CIBlockElement::GetList(
            [],
            [
                'IBLOCK_ID' => $this->brandsIBlockId,
                'NAME' => $name
            ],
            false,
            ['nTopCount' => 1],
            ['ID', 'NAME', 'CODE']
        );

        if ($brand = $res->GetNext()) {
            return $brand;
        }

        return null;
    }

    /**
     * Генерация символьного кода для бренда
     */
    private function generateBrandCode(string $brandName): string
    {
        // Используем встроенную функцию Битрикса для транслитерации
        if (class_exists('CUtil')) {
            $arParams = [
                "max_len" => 100,
                "change_case" => "L",
                "replace_space" => "_",
                "replace_other" => "_"
            ];
            $code = \CUtil::translit($brandName, "ru", $arParams);
        } else {
            // Fallback для случаев, когда CUtil недоступен
            $code = $this->customTranslit($brandName);
        }
        
        // Очистка и нормализация
        $code = strtolower($code);
        $code = preg_replace('/[^a-z0-9\-_]/', '-', $code);
        $code = preg_replace('/[\-_]+/', '-', $code);
        $code = trim($code, '-');
        
        return $code ?: 'brand-' . time();
    }

    /**
     * Простая транслитерация как fallback
     */
    private function customTranslit(string $text): string
    {
        $translitMap = [
            'а' => 'a', 'б' => 'b', 'в' => 'v', 'г' => 'g', 'д' => 'd',
            'е' => 'e', 'ё' => 'yo', 'ж' => 'zh', 'з' => 'z', 'и' => 'i',
            'й' => 'y', 'к' => 'k', 'л' => 'l', 'м' => 'm', 'н' => 'n',
            'о' => 'o', 'п' => 'p', 'р' => 'r', 'с' => 's', 'т' => 't',
            'у' => 'u', 'ф' => 'f', 'х' => 'h', 'ц' => 'ts', 'ч' => 'ch',
            'ш' => 'sh', 'щ' => 'sch', 'ъ' => '', 'ы' => 'y', 'ь' => '',
            'э' => 'e', 'ю' => 'yu', 'я' => 'ya',
            'А' => 'A', 'Б' => 'B', 'В' => 'V', 'Г' => 'G', 'Д' => 'D',
            'Е' => 'E', 'Ё' => 'YO', 'Ж' => 'ZH', 'З' => 'Z', 'И' => 'I',
            'Й' => 'Y', 'К' => 'K', 'Л' => 'L', 'М' => 'M', 'Н' => 'N',
            'О' => 'O', 'П' => 'P', 'Р' => 'R', 'С' => 'S', 'Т' => 'T',
            'У' => 'U', 'Ф' => 'F', 'Х' => 'H', 'Ц' => 'TS', 'Ч' => 'CH',
            'Ш' => 'SH', 'Щ' => 'SCH', 'Ъ' => '', 'Ы' => 'Y', 'Ь' => '',
            'Э' => 'E', 'Ю' => 'YU', 'Я' => 'YA',
            ' ' => '-', '/' => '-', '\\' => '-', '+' => '-'
        ];
        
        return strtr($text, $translitMap);
    }

    /**
     * Создание только брендов без связывания
     */
    private function createBrandsOnly(): array
    {
        $result = [
            'status' => 'success',
            'action' => 'create',
            'meta' => [
                'catalog_iblock_id' => $this->catalogIBlockId,
                'brands_iblock_id' => $this->brandsIBlockId
            ]
        ];

        $brandsResult = $this->createBrandsFromCatalog();
        $result['results'] = ['brands' => $brandsResult];

        return $result;
    }

    /**
     * Обновление существующих брендов
     */
    private function updateExistingBrands(): array
    {
        $this->forceUpdate = true;
        
        $result = [
            'status' => 'success',
            'action' => 'update',
            'meta' => [
                'catalog_iblock_id' => $this->catalogIBlockId,
                'brands_iblock_id' => $this->brandsIBlockId
            ]
        ];

        $brandsResult = $this->createBrandsFromCatalog();
        $result['results'] = ['brands' => $brandsResult];

        return $result;
    }

    /**
     * Проверка консистентности системы брендов
     */
    private function checkBrandConsistency(): array
    {
        $this->addDebugLog("Проверка консистентности системы брендов");
        
        $catalogProducts = $this->getProductsCount();
        $uniqueBrands = $this->getUniqueBrandCount();
        $brandsInDirectory = $this->getBrandsInDirectoryCount();
        $linkedProducts = $this->getLinkedProductsCount();
        $unlinkedProducts = $this->getUnlinkedProductsCount();
        $orphanedBrands = $this->getOrphanedBrandsCount();
        $consistencyScore = $this->calculateConsistencyScore();
        
        $this->addDebugLog("Результаты проверки консистентности", [
            'catalog_products' => $catalogProducts,
            'unique_brands_in_catalog' => $uniqueBrands,
            'brands_in_directory' => $brandsInDirectory,
            'linked_products' => $linkedProducts,
            'unlinked_products' => $unlinkedProducts,
            'orphaned_brands' => $orphanedBrands,
            'consistency_score' => $consistencyScore
        ]);
        
        return [
            'status' => 'success',
            'action' => 'check',
            'meta' => [
                'catalog_iblock_id' => $this->catalogIBlockId,
                'brands_iblock_id' => $this->brandsIBlockId
            ],
            'statistics' => [
                'catalog_products' => $catalogProducts,
                'unique_brands_in_catalog' => $uniqueBrands,
                'brands_in_directory' => $brandsInDirectory,
                'linked_products' => $linkedProducts,
                'unlinked_products' => $unlinkedProducts,
                'orphaned_brands' => $orphanedBrands,
                'consistency_score' => $consistencyScore
            ],
            'recommendations' => $this->getSystemRecommendations()
        ];
    }

    /**
     * Получение статуса системы
     */
    private function getSystemStatus(): array
    {
        $this->addDebugLog("Начинаем проверку статуса системы");
        
        $catalogProducts = $this->getProductsCount();
        $uniqueBrands = $this->getUniqueBrandCount();
        $brandsInDirectory = $this->getBrandsInDirectoryCount();
        $linkedProducts = $this->getLinkedProductsCount();
        
        $this->addDebugLog("Статистика системы", [
            'catalog_products' => $catalogProducts,
            'unique_brands_in_catalog' => $uniqueBrands,
            'brands_in_directory' => $brandsInDirectory,
            'linked_products' => $linkedProducts
        ]);
        
        // Проверяем свойство бренда
        $propertyInfo = $this->getBrandPropertyInfo();
        if ($propertyInfo) {
            $this->addDebugLog("Информация о свойстве бренда", [
                'property_type' => $propertyInfo['PROPERTY_TYPE'],
                'property_name' => $propertyInfo['NAME']
            ]);
        }
        
        return [
            'status' => 'success',
            'system_info' => [
                'catalog_iblock_id' => $this->catalogIBlockId,
                'brands_iblock_id' => $this->brandsIBlockId,
                'brand_property' => $this->brandProperty,
                'brand_element_property' => $this->brandElementProperty
            ],
            'statistics' => [
                'catalog_products' => $catalogProducts,
                'brands_in_directory' => $brandsInDirectory,
                'linked_products' => $linkedProducts,
                'consistency_score' => $this->calculateConsistencyScore()
            ],
            'health_check' => [
                'catalog_iblock_exists' => $this->validateCatalogIBlock(),
                'brands_iblock_exists' => $this->validateBrandsIBlock(),
                'brand_property_exists' => $this->validateBrandProperty(),
                'brand_element_property_exists' => $this->validateBrandElementProperty()
            ]
        ];
    }

    /**
     * Очистка несвязанных брендов
     */
    private function cleanupOrphanedBrands(): array
    {
        $orphanedBrands = $this->getOrphanedBrands();
        $deletedCount = 0;
        $errors = [];

        foreach ($orphanedBrands as $brand) {
            try {
                if (!$this->dryRun) {
                    CIBlockElement::Delete($brand['ID']);
                }
                $deletedCount++;
            } catch (\Exception $e) {
                $errors[] = [
                    'brand_id' => $brand['ID'],
                    'brand_name' => $brand['NAME'],
                    'error' => $e->getMessage()
                ];
            }
        }

        return [
            'status' => 'success',
            'action' => 'cleanup',
            'results' => [
                'orphaned_found' => count($orphanedBrands),
                'deleted' => $deletedCount,
                'errors' => count($errors)
            ],
            'details' => [
                'deleted_brands' => array_slice($orphanedBrands, 0, $deletedCount),
                'errors' => $errors
            ]
        ];
    }

    /**
     * Создание алиасов для недостающих брендов
     */
    private function createMissingBrandAliases(array $missingBrandsStats): array
    {
        $created = [];
        $errors = [];
        $skipped = [];
        
        $this->addDebugLog("Анализ недостающих брендов", [
            'missing_brands' => array_keys($missingBrandsStats)
        ]);
        
        foreach ($missingBrandsStats as $missingBrand => $count) {
            try {
                // Ищем похожий бренд (регистронезависимо)
                $similarBrand = $this->findSimilarBrand($missingBrand);
                
                if ($similarBrand) {
                    // Создаем алиас (дубликат) существующего бренда
                    if (!$this->dryRun) {
                        $aliasResult = $this->createBrandAlias($missingBrand, $similarBrand);
                        $created[] = $aliasResult;
                    } else {
                        $created[] = [
                            'missing_name' => $missingBrand,
                            'similar_brand' => $similarBrand,
                            'action' => 'would_create_alias'
                        ];
                    }
                    
                    $this->addDebugLog("Создан алиас бренда", [
                        'missing' => $missingBrand,
                        'similar' => $similarBrand['NAME'],
                        'products_count' => $count
                    ]);
                } else {
                    // Создаем новый бренд
                    if (!$this->dryRun) {
                        $newBrandResult = $this->createBrand([
                            'name' => $missingBrand,
                            'code' => $this->generateBrandCode($missingBrand),
                            'sort' => 500
                        ]);
                        $created[] = $newBrandResult;
                    } else {
                        $created[] = [
                            'name' => $missingBrand,
                            'action' => 'would_create_new'
                        ];
                    }
                    
                    $this->addDebugLog("Создан новый бренд", [
                        'name' => $missingBrand,
                        'products_count' => $count
                    ]);
                }
                
            } catch (\Exception $e) {
                $errors[] = [
                    'brand' => $missingBrand,
                    'error' => $e->getMessage()
                ];
                $this->addDebugLog("Ошибка создания алиаса", [
                    'brand' => $missingBrand,
                    'error' => $e->getMessage()
                ]);
            }
        }
        
        return [
            'created' => count($created),
            'errors' => count($errors),
            'details' => [
                'created' => $created,
                'errors' => $errors
            ]
        ];
    }

    /**
     * Поиск похожего бренда (регистронезависимо)
     */
    private function findSimilarBrand(string $missingBrand): ?array
    {
        $lowerMissing = strtolower(trim($missingBrand));
        
        $res = CIBlockElement::GetList(
            [],
            [
                'IBLOCK_ID' => $this->brandsIBlockId,
                'ACTIVE' => 'Y'
            ],
            false,
            false,
            ['ID', 'NAME']
        );

        while ($brand = $res->GetNext()) {
            $lowerExisting = strtolower(trim($brand['NAME']));
            
            // Точное совпадение (регистронезависимо)
            if ($lowerMissing === $lowerExisting) {
                return $brand;
            }
            
            // Похожие названия (для составных брендов)
            if (strlen($lowerMissing) > 3 && strlen($lowerExisting) > 3) {
                // Проверяем вхождение одного в другой
                if (strpos($lowerExisting, $lowerMissing) !== false || 
                    strpos($lowerMissing, $lowerExisting) !== false) {
                    return $brand;
                }
                
                // Схожесть по расстоянию Левенштейна
                $distance = levenshtein($lowerMissing, $lowerExisting);
                $maxLength = max(strlen($lowerMissing), strlen($lowerExisting));
                $similarity = 1 - ($distance / $maxLength);
                
                if ($similarity > 0.8) { // 80% схожести
                    return $brand;
                }
            }
        }

        return null;
    }

    /**
     * Создание алиаса (дубликата) бренда
     */
    private function createBrandAlias(string $aliasName, array $originalBrand): array
    {
        $el = new CIBlockElement;
        
        $arLoadProductArray = [
            'IBLOCK_ID' => $this->brandsIBlockId,
            'NAME' => $aliasName,
            'ACTIVE' => 'Y',
            'CODE' => $this->generateBrandCode($aliasName),
            'SORT' => 500,
            'PREVIEW_TEXT' => "Алиас для бренда {$originalBrand['NAME']}",
            'DETAIL_TEXT' => "Автоматически созданный алиас для бренда {$originalBrand['NAME']} (ID: {$originalBrand['ID']})",
        ];

        $aliasId = $el->Add($arLoadProductArray);
        
        if (!$aliasId) {
            throw new \Exception("Failed to create brand alias: " . $el->LAST_ERROR);
        }

        return [
            'id' => $aliasId,
            'alias_name' => $aliasName,
            'original_brand' => $originalBrand,
            'action' => 'alias_created'
        ];
    }

    // === ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ВАЛИДАЦИИ ===

    private function validateBrandsIBlock(): bool
    {
        $dbIBlock = CIBlock::GetList([], ['ID' => $this->brandsIBlockId, 'ACTIVE' => 'Y']);
        return (bool)$dbIBlock->Fetch();
    }

    private function validateCatalogIBlock(): bool
    {
        $dbIBlock = CIBlock::GetList([], ['ID' => $this->catalogIBlockId, 'ACTIVE' => 'Y']);
        return (bool)$dbIBlock->Fetch();
    }

    private function validateBrandProperty(): bool
    {
        $dbProperty = PropertyTable::getList([
            'filter' => [
                'IBLOCK_ID' => $this->catalogIBlockId,
                'CODE' => $this->brandProperty,
                'ACTIVE' => 'Y'
            ],
            'select' => ['ID']
        ]);
        
        return (bool)$dbProperty->fetch();
    }

    private function validateBrandElementProperty(): bool
    {
        $dbProperty = PropertyTable::getList([
            'filter' => [
                'IBLOCK_ID' => $this->catalogIBlockId,
                'CODE' => $this->brandElementProperty,
                'ACTIVE' => 'Y'
            ],
            'select' => ['ID']
        ]);
        
        return (bool)$dbProperty->fetch();
    }

    // === МЕТОДЫ ПОЛУЧЕНИЯ СТАТИСТИКИ ===

    private function getProductsCount(): int
    {
        return CIBlockElement::GetList([], ['IBLOCK_ID' => $this->catalogIBlockId], []);
    }

    private function getUniqueBrandCount(): int
    {
        $propertyInfo = $this->getBrandPropertyInfo();
        
        if (!$propertyInfo) {
            return 0;
        }
        
        switch ($propertyInfo['PROPERTY_TYPE']) {
            case 'L': // Список
                return PropertyEnumerationTable::getList([
                    'filter' => ['PROPERTY_ID' => $propertyInfo['ID']]
                ])->getSelectedRowsCount();
                
            case 'S': // Строка
            case 'N': // Число
                // Подсчитываем уникальные значения из элементов
                $uniqueBrands = [];
                $res = CIBlockElement::GetList(
                    [],
                    [
                        'IBLOCK_ID' => $this->catalogIBlockId,
                        'ACTIVE' => 'Y',
                        "!PROPERTY_{$this->brandProperty}" => false
                    ],
                    false,
                    false,
                    ['ID', "PROPERTY_{$this->brandProperty}"]
                );
                
                while ($element = $res->GetNextElement()) {
                    $fields = $element->GetFields();
                    $brandValue = $fields["PROPERTY_{$this->brandProperty}_VALUE"];
                    
                    if ($brandValue && !empty(trim($brandValue))) {
                        $uniqueBrands[trim($brandValue)] = true;
                    }
                }
                
                return count($uniqueBrands);
                
            default:
                return 0;
        }
    }

    private function getBrandsInDirectoryCount(): int
    {
        return CIBlockElement::GetList([], ['IBLOCK_ID' => $this->brandsIBlockId], []);
    }

    private function getLinkedProductsCount(): int
    {
        return CIBlockElement::GetList(
            [],
            [
                'IBLOCK_ID' => $this->catalogIBlockId,
                "!PROPERTY_{$this->brandElementProperty}" => false
            ],
            []
        );
    }

    private function getUnlinkedProductsCount(): int
    {
        return CIBlockElement::GetList(
            [],
            [
                'IBLOCK_ID' => $this->catalogIBlockId,
                "!PROPERTY_{$this->brandProperty}" => false,
                "PROPERTY_{$this->brandElementProperty}" => false
            ],
            []
        );
    }

    private function getOrphanedBrandsCount(): int
    {
        return count($this->getOrphanedBrands());
    }

    private function getOrphanedBrands(): array
    {
        $orphaned = [];
        $brandMapping = array_flip($this->getBrandMapping());
        
        $res = CIBlockElement::GetList(
            [],
            ['IBLOCK_ID' => $this->brandsIBlockId],
            false,
            false,
            ['ID', 'NAME']
        );

        while ($brand = $res->GetNext()) {
            $linkedCount = CIBlockElement::GetList(
                [],
                [
                    'IBLOCK_ID' => $this->catalogIBlockId,
                    "PROPERTY_{$this->brandElementProperty}" => $brand['ID']
                ],
                []
            );

            if ($linkedCount === 0) {
                $orphaned[] = $brand;
            }
        }

        return $orphaned;
    }

    private function calculateConsistencyScore(): float
    {
        $totalProducts = $this->getProductsCount();
        if ($totalProducts === 0) return 100.0;
        
        $linkedProducts = $this->getLinkedProductsCount();
        return round(($linkedProducts / $totalProducts) * 100, 2);
    }

    // === МЕТОДЫ РЕКОМЕНДАЦИЙ ===

    private function getRecommendations(array $brandsResult, array $productsResult): array
    {
        $recommendations = [];

        if ($brandsResult['errors_count'] > 0) {
            $recommendations[] = "Обнаружены ошибки при создании {$brandsResult['errors_count']} брендов";
        }

        if (!empty($productsResult['errors'])) {
            $recommendations[] = "{$productsResult['errors']} товаров не удалось связать с брендами";
        }

        if (!empty($productsResult['unlinked'])) {
            $recommendations[] = "{$productsResult['unlinked']} товаров остались без связи с брендами";
        }

        $consistencyScore = $this->calculateConsistencyScore();
        if ($consistencyScore < 90) {
            $recommendations[] = "Консистентность системы: {$consistencyScore}%. Рекомендуется повторная синхронизация";
        }

        return $recommendations ?: ["Синхронизация прошла успешно"];
    }

    private function getSystemRecommendations(): array
    {
        $recommendations = [];
        $score = $this->calculateConsistencyScore();

        if ($score < 50) {
            $recommendations[] = "Критическая несогласованность данных. Требуется полная синхронизация";
        } elseif ($score < 80) {
            $recommendations[] = "Обнаружены проблемы со связыванием. Рекомендуется синхронизация";
        } elseif ($score < 95) {
            $recommendations[] = "Незначительные проблемы. Можно выполнить частичную синхронизацию";
        } else {
            $recommendations[] = "Система работает корректно";
        }

        $orphanedCount = $this->getOrphanedBrandsCount();
        if ($orphanedCount > 0) {
            $recommendations[] = "Найдено {$orphanedCount} неиспользуемых брендов. Рекомендуется очистка";
        }

        return $recommendations;
    }

    private function getLastOperationReport(): array
    {
        // Здесь можно реализовать чтение последнего лога операции
        return [
            'message' => 'Report functionality not implemented yet',
            'suggestion' => 'Check logs at /local/logs/brand_manager.log'
        ];
    }

    // === МЕТОДЫ ЛОГИРОВАНИЯ ===

    private function addDebugLog(string $message, array $data = []): void
    {
        $this->debugLog[] = [
            'timestamp' => date('H:i:s'),
            'message' => $message,
            'data' => $data
        ];
    }

    private function logOperation(string $type, array $data): void
    {
        if (!$this->withLogging) return;

        $logData = [
            'timestamp' => date('Y-m-d H:i:s'),
            'type' => $type,
            'action' => $this->action,
            'dry_run' => $this->dryRun,
            'data' => $data
        ];

        Debug::writeToFile(
            $logData,
            'Brand Manager Operation',
            '/local/logs/brand_manager.log'
        );
    }

    private function logError(\Exception $e, array $context = []): void
    {
        $logData = [
            'timestamp' => date('Y-m-d H:i:s'),
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString(),
            'context' => $context,
            'action' => $this->action,
            'request_params' => request()->getInput()
        ];

        Debug::writeToFile(
            $logData,
            'Brand Manager Error',
            '/local/logs/brand_manager_errors.log'
        );
    }
} 