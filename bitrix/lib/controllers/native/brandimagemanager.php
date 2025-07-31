<?php
namespace Artamonov\Rest\Controllers\Native;

use Artamonov\Rest\Controllers\Native\Base\CatalogBase;
use Bitrix\Main\{Loader, Type\Dictionary, Diag\Debug};
use Bitrix\Iblock\PropertyTable;
use CIBlockElement, CIBlock, CModule, CFile;

/**
 * Контроллер для загрузки изображений брендов из base64
 * Умный поиск брендов и обновление изображений
 */
class BrandImageManager extends CatalogBase
{
    // Основные настройки
    private int $brandsIBlockId = 22;
    
    // Алгоритм поиска
    private float $similarityThreshold = 0.8;
    private int $maxBrandsPerRequest = 100;
    
    // Настройки изображений
    private int $maxImageSize = 5242880; // 5MB в байтах
    private array $allowedFormats = ['image/jpeg', 'image/png', 'image/webp'];
    private int $imageQuality = 85;
    
    // Режимы работы
    private bool $dryRun = false;
    private bool $overwriteExisting = false;
    
    // Опции
    private bool $withLogging = true;
    private bool $withReport = true;
    
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
     * POST-метод для загрузки изображений брендов
     */
    public function _post(): void
    {
        try {
            $this->parseRequest();
            $this->validateRequest();
            
            $this->logOperation('start', [
                'brands_iblock_id' => $this->brandsIBlockId,
                'dry_run' => $this->dryRun,
                'overwrite_existing' => $this->overwriteExisting,
                'similarity_threshold' => $this->similarityThreshold
            ]);
            
            $result = $this->processImageUploads();
            
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
     * Парсинг параметров запроса
     */
    private function parseRequest(): void
    {
        $request = request();

        // Основные параметры
        $this->brandsIBlockId = (int)($request->get('brands_iblock_id') ?: 22);
        
        // Опции выполнения
        $this->dryRun = $request->get('dry_run') === 'Y';
        $this->overwriteExisting = $request->get('overwrite_existing') === 'Y';
        $this->withLogging = $request->get('with_logging') !== 'N';
        
        // Настройки алгоритма
        $threshold = $request->get('similarity_threshold');
        if ($threshold && is_numeric($threshold)) {
            $this->similarityThreshold = max(0.1, min(1.0, (float)$threshold));
        }
        
        $maxBrands = $request->get('max_brands_per_request');
        if ($maxBrands && is_numeric($maxBrands)) {
            $this->maxBrandsPerRequest = max(1, min(500, (int)$maxBrands));
        }
        
        // Настройки изображений
        $maxSize = $request->get('max_image_size');
        if ($maxSize && is_numeric($maxSize)) {
            $this->maxImageSize = max(1048576, min(20971520, (int)$maxSize)); // 1MB - 20MB
        }
        
        $quality = $request->get('image_quality');
        if ($quality && is_numeric($quality)) {
            $this->imageQuality = max(10, min(100, (int)$quality));
        }
    }

    /**
     * Валидация параметров запроса
     */
    private function validateRequest(): void
    {
        // Проверяем инфоблок брендов
        if (!$this->validateBrandsIBlock()) {
            $this->errorResponse(404, 'Brands iblock not found or inactive');
        }
        
        // Получаем и валидируем JSON с брендами
        $input = request()->getInput();
        
        if (empty($input)) {
            $this->errorResponse(400, 'Empty request body');
        }
        
        $data = json_decode($input, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->errorResponse(400, 'Invalid JSON: ' . json_last_error_msg());
        }
        
        if (!isset($data['brands']) || !is_array($data['brands'])) {
            $this->errorResponse(400, 'Missing or invalid "brands" array in request');
        }
        
        if (empty($data['brands'])) {
            $this->errorResponse(400, 'Empty brands array');
        }
        
        if (count($data['brands']) > $this->maxBrandsPerRequest) {
            $this->errorResponse(400, "Too many brands. Maximum allowed: {$this->maxBrandsPerRequest}");
        }
        
        // Валидируем каждый бренд
        foreach ($data['brands'] as $index => $brand) {
            $this->validateBrandData($brand, $index);
        }
        
        $this->operationResult['input_brands'] = $data['brands'];
    }

    /**
     * Валидация данных отдельного бренда
     */
    private function validateBrandData(array $brand, int $index): void
    {
        if (!isset($brand['name']) || empty(trim($brand['name']))) {
            $this->errorResponse(400, "Brand #{$index}: missing or empty 'name' field");
        }
        
        if (!isset($brand['image']) || empty($brand['image'])) {
            $this->errorResponse(400, "Brand #{$index}: missing or empty 'image' field");
        }
        
        // Проверяем формат base64
        if (!preg_match('/^data:image\/([a-zA-Z]+);base64,/', $brand['image'], $matches)) {
            $this->errorResponse(400, "Brand #{$index}: invalid base64 image format");
        }
        
        // Проверяем поддерживаемые форматы
        $imageType = 'image/' . strtolower($matches[1]);
        if (!in_array($imageType, $this->allowedFormats)) {
            $allowedList = implode(', ', $this->allowedFormats);
            $this->errorResponse(400, "Brand #{$index}: unsupported image format '{$imageType}'. Allowed: {$allowedList}");
        }
        
        // Проверяем размер декодированного изображения
        $base64Data = preg_replace('/^data:image\/\w+;base64,/', '', $brand['image']);
        $decodedSize = strlen(base64_decode($base64Data, true));
        
        if ($decodedSize > $this->maxImageSize) {
            $maxSizeMB = round($this->maxImageSize / 1048576, 1);
            $actualSizeMB = round($decodedSize / 1048576, 1);
            $this->errorResponse(400, "Brand #{$index}: image size ({$actualSizeMB}MB) exceeds maximum allowed ({$maxSizeMB}MB)");
        }
    }

    /**
     * Основной метод обработки загрузки изображений
     */
    private function processImageUploads(): array
    {
        $brands = $this->operationResult['input_brands'];
        $successful = [];
        $failed = [];
        
        $this->addDebugLog("Начинаем обработку изображений", [
            'total_brands' => count($brands),
            'dry_run' => $this->dryRun,
            'overwrite_existing' => $this->overwriteExisting
        ]);
        
        // Получаем маппинг всех брендов для оптимизации поиска
        $brandMapping = $this->getBrandMapping();
        $this->addDebugLog("Получен маппинг брендов", [
            'total_brands_in_catalog' => count($brandMapping)
        ]);
        
        foreach ($brands as $index => $brandData) {
            try {
                $inputName = trim($brandData['name']);
                $base64Image = $brandData['image'];
                
                $this->addDebugLog("Обработка бренда #{$index}", [
                    'input_name' => $inputName
                ]);
                
                // Поиск бренда в каталоге
                $foundBrand = $this->findBrandInCatalog($inputName, $brandMapping);
                
                if (!$foundBrand) {
                    $failed[] = [
                        'input_name' => $inputName,
                        'reason' => 'brand_not_found',
                        'attempted_matches' => $this->getAttemptedMatches($inputName, $brandMapping),
                        'best_similarity' => $this->getBestSimilarity($inputName, $brandMapping)
                    ];
                    
                    $this->addDebugLog("Бренд не найден", [
                        'input_name' => $inputName,
                        'best_similarity' => $this->getBestSimilarity($inputName, $brandMapping)
                    ]);
                    continue;
                }
                
                // Проверяем, нужно ли обновлять изображение
                if (!$this->shouldUpdateImage($foundBrand['id'])) {
                    $failed[] = [
                        'input_name' => $inputName,
                        'found_brand' => $foundBrand,
                        'reason' => 'image_exists_no_overwrite',
                        'current_image_id' => $this->getCurrentImageId($foundBrand['id'])
                    ];
                    continue;
                }
                
                // Обрабатываем изображение
                if ($this->dryRun) {
                    $successful[] = [
                        'input_name' => $inputName,
                        'found_brand' => $foundBrand,
                        'match_type' => $foundBrand['match_type'],
                        'similarity' => $foundBrand['similarity'],
                        'action' => 'would_update_image',
                        'dry_run' => true
                    ];
                } else {
                    $imageResult = $this->processAndSaveImage($foundBrand['id'], $base64Image);
                    
                    $successful[] = array_merge([
                        'input_name' => $inputName,
                        'found_brand' => $foundBrand,
                        'match_type' => $foundBrand['match_type'],
                        'similarity' => $foundBrand['similarity'],
                        'image_updated' => true
                    ], $imageResult);
                }
                
                $this->addDebugLog("Бренд успешно обработан", [
                    'input_name' => $inputName,
                    'found_brand_id' => $foundBrand['id'],
                    'match_type' => $foundBrand['match_type']
                ]);
                
            } catch (\Exception $e) {
                $failed[] = [
                    'input_name' => $brandData['name'],
                    'reason' => 'processing_error',
                    'error' => $e->getMessage()
                ];
                
                $this->addDebugLog("Ошибка обработки бренда", [
                    'input_name' => $brandData['name'],
                    'error' => $e->getMessage()
                ]);
                
                $this->logError($e, ['brand' => $brandData['name']]);
            }
        }
        
        return [
            'status' => 'success',
            'meta' => [
                'brands_iblock_id' => $this->brandsIBlockId,
                'processed_count' => count($brands),
                'successful_count' => count($successful),
                'failed_count' => count($failed),
                'similarity_threshold' => $this->similarityThreshold
            ],
            'results' => [
                'successful' => $successful,
                'failed' => $failed
            ]
        ];
    }

    /**
     * Получение маппинга всех брендов для оптимизации поиска
     */
    private function getBrandMapping(): array
    {
        $mapping = [];
        
        $this->addDebugLog("Получаем маппинг брендов из инфоблока {$this->brandsIBlockId}");
        
        $res = CIBlockElement::GetList(
            ['NAME' => 'ASC'],
            [
                'IBLOCK_ID' => $this->brandsIBlockId,
                'ACTIVE' => 'Y'
            ],
            false,
            false,
            ['ID', 'NAME', 'CODE', 'PREVIEW_PICTURE']
        );

        $brandCount = 0;
        while ($brand = $res->GetNext()) {
            $brandName = trim($brand['NAME']);
            if (empty($brandName)) continue;
            
            $mapping[] = [
                'id' => (int)$brand['ID'],
                'name' => $brandName,
                'code' => $brand['CODE'],
                'name_lower' => strtolower($brandName),
                'current_image_id' => (int)$brand['PREVIEW_PICTURE']
            ];
            $brandCount++;
        }
        
        $this->addDebugLog("Маппинг брендов создан", [
            'total_brands' => $brandCount
        ]);
        
        return $mapping;
    }

    /**
     * Умный поиск бренда в каталоге
     */
    private function findBrandInCatalog(string $inputName, array $brandMapping): ?array
    {
        $inputLower = strtolower(trim($inputName));
        $inputNormalized = $this->normalizeBrandName($inputName);
        
        $bestMatch = null;
        $bestSimilarity = 0;
        $matchType = '';
        
        foreach ($brandMapping as $brand) {
            $brandLower = $brand['name_lower'];
            $brandNormalized = $this->normalizeBrandName($brand['name']);
            
            // 1. Точное совпадение (регистронезависимо)
            if ($inputLower === $brandLower) {
                return [
                    'id' => $brand['id'],
                    'name' => $brand['name'],
                    'code' => $brand['code'],
                    'match_type' => 'exact',
                    'similarity' => 1.0
                ];
            }
            
            // 2. Точное совпадение нормализованных названий
            if ($inputNormalized === $brandNormalized) {
                return [
                    'id' => $brand['id'],
                    'name' => $brand['name'],
                    'code' => $brand['code'],
                    'match_type' => 'exact_normalized',
                    'similarity' => 1.0
                ];
            }
            
            // 3. Проверка вхождения одного в другой
            if (strlen($inputLower) > 2 && strlen($brandLower) > 2) {
                if (strpos($brandLower, $inputLower) !== false) {
                    $similarity = strlen($inputLower) / strlen($brandLower);
                    if ($similarity > $bestSimilarity) {
                        $bestMatch = $brand;
                        $bestSimilarity = $similarity;
                        $matchType = 'contains_input';
                    }
                } elseif (strpos($inputLower, $brandLower) !== false) {
                    $similarity = strlen($brandLower) / strlen($inputLower);
                    if ($similarity > $bestSimilarity) {
                        $bestMatch = $brand;
                        $bestSimilarity = $similarity;
                        $matchType = 'input_contains';
                    }
                }
            }
            
            // 4. Схожесть по расстоянию Левенштейна
            if (strlen($inputLower) > 2 && strlen($brandLower) > 2) {
                $distance = levenshtein($inputLower, $brandLower);
                $maxLength = max(strlen($inputLower), strlen($brandLower));
                $similarity = 1 - ($distance / $maxLength);
                
                if ($similarity > $bestSimilarity && $similarity > 0.5) {
                    $bestMatch = $brand;
                    $bestSimilarity = $similarity;
                    $matchType = 'levenshtein';
                }
            }
        }
        
        // Возвращаем лучшее совпадение, если оно превышает порог
        if ($bestMatch && $bestSimilarity >= $this->similarityThreshold) {
            return [
                'id' => $bestMatch['id'],
                'name' => $bestMatch['name'],
                'code' => $bestMatch['code'],
                'match_type' => $matchType,
                'similarity' => round($bestSimilarity, 3)
            ];
        }
        
        return null;
    }

    /**
     * Нормализация названия бренда
     */
    private function normalizeBrandName(string $name): string
    {
        // Убираем лишние пробелы, знаки препинания
        $normalized = trim($name);
        $normalized = preg_replace('/\s+/', ' ', $normalized);
        $normalized = preg_replace('/[^\w\s\-]/', '', $normalized);
        return strtolower($normalized);
    }

    /**
     * Получение попыток совпадений для отчета
     */
    private function getAttemptedMatches(string $inputName, array $brandMapping): array
    {
        $inputLower = strtolower(trim($inputName));
        $matches = [];
        
        foreach ($brandMapping as $brand) {
            $brandLower = $brand['name_lower'];
            
            // Частичные совпадения
            if (strlen($inputLower) > 2 && strlen($brandLower) > 2) {
                if (strpos($brandLower, $inputLower) !== false || 
                    strpos($inputLower, $brandLower) !== false) {
                    $matches[] = $brand['name'];
                    if (count($matches) >= 5) break; // Ограничиваем количество
                }
            }
        }
        
        return $matches;
    }

    /**
     * Получение лучшей схожести для отчета
     */
    private function getBestSimilarity(string $inputName, array $brandMapping): float
    {
        $inputLower = strtolower(trim($inputName));
        $bestSimilarity = 0;
        
        foreach ($brandMapping as $brand) {
            $brandLower = $brand['name_lower'];
            
            if (strlen($inputLower) > 2 && strlen($brandLower) > 2) {
                $distance = levenshtein($inputLower, $brandLower);
                $maxLength = max(strlen($inputLower), strlen($brandLower));
                $similarity = 1 - ($distance / $maxLength);
                
                if ($similarity > $bestSimilarity) {
                    $bestSimilarity = $similarity;
                }
            }
        }
        
        return round($bestSimilarity, 3);
    }

    /**
     * Проверка, нужно ли обновлять изображение
     */
    private function shouldUpdateImage(int $brandId): bool
    {
        if ($this->overwriteExisting) {
            return true;
        }
        
        $currentImageId = $this->getCurrentImageId($brandId);
        return empty($currentImageId);
    }

    /**
     * Получение текущего ID изображения бренда
     */
    private function getCurrentImageId(int $brandId): ?int
    {
        $res = CIBlockElement::GetByID($brandId);
        if ($element = $res->GetNext()) {
            return (int)$element['PREVIEW_PICTURE'] ?: null;
        }
        return null;
    }

    /**
     * Обработка и сохранение изображения (проверенный способ с форума Битрикс)
     */
    private function processAndSaveImage(int $brandId, string $base64Image): array
    {
        $oldImageId = $this->getCurrentImageId($brandId);
        
        // Используем проверенный метод с форума Битрикс
        return $this->processImageViaTemporaryFile($brandId, $base64Image, $oldImageId);
    }



    /**
     * Проверенный метод с форума Битрикс - временный файл + CFile::MakeFileArray
     */
    private function processImageViaTemporaryFile(int $brandId, string $base64Image, ?int $oldImageId): array
    {
        // Декодируем base64 (как на форуме)
        $data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $base64Image));
        
        if ($data === false) {
            throw new \Exception('Failed to decode base64 image data');
        }
        
        // Определяем расширение из MIME типа
        $extension = $this->getExtensionFromBase64($base64Image);
        
        // Создаем временный файл (как в примере с форума)
        $tempFileName = 'brand_temp_' . time() . '_' . rand(1000, 9999) . '.' . $extension;
        $tempFilePath = $_SERVER["DOCUMENT_ROOT"] . '/upload/tmp/' . $tempFileName;
        
        // Создаем папку tmp если не существует
        $tmpDir = $_SERVER["DOCUMENT_ROOT"] . '/upload/tmp/';
        if (!is_dir($tmpDir)) {
            mkdir($tmpDir, 0755, true);
        }
        
        try {
            // Создаем временный файл (как в примере)
            file_put_contents($tempFilePath, $data);
            
            $this->addDebugLog("Создан временный файл", [
                'temp_file' => $tempFilePath,
                'file_size' => strlen($data)
            ]);
            
            // Используем CFile::MakeFileArray как на форуме
            $arFile = CFile::MakeFileArray($tempFilePath);
            
            if (!$arFile) {
                throw new \Exception('Failed to create file array from temporary file');
            }
            
            // Обновляем элемент бренда (как в примере)
            $arUpdateValues = ['PREVIEW_PICTURE' => $arFile];
            $el = new CIBlockElement;
            $result = $el->Update($brandId, $arUpdateValues);
            
            if (!$result) {
                throw new \Exception('Failed to update brand element: ' . $el->LAST_ERROR);
            }
            
            // Получаем новый ID изображения
            $newImageId = $this->getCurrentImageId($brandId);
            
            $this->addDebugLog("Изображение успешно загружено", [
                'brand_id' => $brandId,
                'old_image_id' => $oldImageId,
                'new_image_id' => $newImageId,
                'method' => 'temporary_file_forum_method',
                'temp_file' => $tempFilePath
            ]);
            
            return [
                'old_image_id' => $oldImageId,
                'new_image_id' => $newImageId,
                'file_size' => strlen($data)
            ];
            
        } finally {
            // Всегда удаляем временный файл (как в примере)
            if (file_exists($tempFilePath)) {
                unlink($tempFilePath);
                $this->addDebugLog("Временный файл удален", [
                    'temp_file' => $tempFilePath
                ]);
            }
        }
    }

    /**
     * Определение расширения файла из base64 строки
     */
    private function getExtensionFromBase64(string $base64Image): string
    {
        // Извлекаем MIME тип из data URI
        if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $matches)) {
            $imageType = strtolower($matches[1]);
            
            // Конвертируем MIME тип в расширение
            switch ($imageType) {
                case 'jpeg':
                case 'jpg':
                    return 'jpg';
                case 'png':
                    return 'png';
                case 'webp':
                    return 'webp';
                case 'gif':
                    return 'gif';
                default:
                    return 'jpg'; // По умолчанию
            }
        }
        
        return 'jpg'; // Fallback
    }





    // === МЕТОДЫ ВАЛИДАЦИИ ===

    private function validateBrandsIBlock(): bool
    {
        $dbIBlock = CIBlock::GetList([], ['ID' => $this->brandsIBlockId, 'ACTIVE' => 'Y']);
        return (bool)$dbIBlock->Fetch();
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
            'dry_run' => $this->dryRun,
            'data' => $data
        ];

        Debug::writeToFile(
            $logData,
            'Brand Image Manager Operation',
            '/local/logs/brand_image_manager.log'
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
            'request_params' => request()->getInput()
        ];

        Debug::writeToFile(
            $logData,
            'Brand Image Manager Error',
            '/local/logs/brand_image_manager_errors.log'
        );
    }
} 