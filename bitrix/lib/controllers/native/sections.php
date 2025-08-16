<?php
namespace Artamonov\Rest\Controllers\Native;

use Bitrix\Main\{Loader, Context, Web\Json};
use CIBlockSection, CIBlockElement, CIBlock, CModule;
use Bitrix\Iblock\InheritedProperty\SectionValues;

/**
 * Супер-контроллер для работы с разделами каталога
 */
class Sections
{
    private int $iBlockId = 0;
    private ?int $sectionId = null;
    private string $parentSection = 'all';
	private ?int $parentSectionId = null;
    private int $depth = 1;
    private ?int $maxDepth = null;
    private string $treeMode = 'flat';
    private array $filter = [];
    private array $sort = ['SORT' => 'ASC', 'NAME' => 'ASC'];
    private array $select = ['ID', 'NAME', 'CODE', 'SECTION_PAGE_URL', 'PICTURE', 'DESCRIPTION', 'IBLOCK_SECTION_ID', 'DEPTH_LEVEL'];
    
    // Опции вывода
    private bool $withElementCount = false;
    private bool $countActiveOnly = true;
    private bool $withSubsectionCount = false;
    private bool $withSeo = false;
    private bool $withProperties = false;
    private string $format = 'full';
    private array $excludeFields = [];
    private array $fieldsOnly = [];
    
    // Бренды
    private bool $brandsFromElements = false;
    private string $brandProperty = 'BRAND';
    private bool $uniqueBrandsOnly = true;

    public function __construct()
    {
        if (!config()->get('useNativeRoute')) {
            $this->errorResponse(403, 'Native routes disabled');
        }

        if (!CModule::IncludeModule('iblock')) {
            $this->errorResponse(500, 'IBlock module not installed');
        }
    }

    /**
     * GET-метод для получения разделов
     */
    public function _get(): void
    {
        try {
            $this->parseRequest();
            $this->validateRequest();
            $this->buildFilter();
            
            $sections = $this->getSections();
            
			$response = [
				'meta' => [
					'iblock_id' => $this->iBlockId,
					'section_id' => $this->sectionId,
					'parent_section_id' => $this->parentSectionId,
					'parent_section' => $this->parentSection,
					'depth' => $this->depth,
					'tree_mode' => $this->treeMode,
					'total_count' => $this->getTotalCount($sections),
					'format' => $this->format,
					'request_time' => date('Y-m-d H:i:s')
				],
				'data' => $sections
			];


            response()->json($response);

        } catch (\Exception $e) {
            \Bitrix\Main\Diag\Debug::writeToFile(
                [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                    'request_params' => request()->getInput()
                ],
                'Sections API Error',
                '/local/logs/rest_api.log'
            );
            
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
        $this->iBlockId = (int)$request->get('iblock_id');
        $this->sectionId = $request->get('section_id') ? (int)$request->get('section_id') : null;
        $this->parentSectionId = $request->get('parent_section_id') ? (int)$request->get('parent_section_id') : null;
        $this->parentSection = $request->get('parent_section') ?: 'all';
        
        // Глубина
        $this->depth = max(1, min((int)$request->get('depth') ?: 1, 5));
        $this->maxDepth = $request->get('max_depth') ? (int)$request->get('max_depth') : null;
        $this->treeMode = $request->get('tree_mode') ?: 'flat';
        
        // Опции подсчета
        $this->withElementCount = $request->get('with_element_count') === 'Y';
        $this->countActiveOnly = $request->get('count_active_only') !== 'N';
        $this->withSubsectionCount = $request->get('with_subsection_count') === 'Y';
        
        // Опции вывода
        $this->withSeo = $request->get('with_seo') === 'Y';
        $this->withProperties = $request->get('with_properties') === 'Y';
        $this->format = $request->get('format') ?: 'full';
        
        // Поля
        if ($excludeFields = $request->get('exclude_fields')) {
            $this->excludeFields = is_array($excludeFields) ? $excludeFields : [$excludeFields];
        }
        
        if ($fieldsOnly = $request->get('fields_only')) {
            $this->fieldsOnly = is_array($fieldsOnly) ? $fieldsOnly : [$fieldsOnly];
        }
        
        if ($select = $request->get('select')) {
            if (is_array($select)) {
                $this->select = array_merge($this->select, $select);
                $this->select = array_unique($this->select);
            }
        }
        
        // Сортировка
        if ($sort = $request->get('sort')) {
            $this->sort = $this->parseSortParam($sort);
        }
        
        // Бренды
        $this->brandsFromElements = $request->get('brands_from_elements') === 'Y';
        $this->brandProperty = $request->get('brand_property') ?: 'BRAND';
        $this->uniqueBrandsOnly = $request->get('unique_brands_only') !== 'N';
    }

    /**
     * Построение фильтра
     */
	private function buildFilter(): void
	{
		$request = request();
		
		$this->filter = ['IBLOCK_ID' => $this->iBlockId];
	
		// Активность
		$active = $request->get('active') ?: 'Y';
		if ($active !== 'all') {
			$this->filter['ACTIVE'] = $active;
		}
		
		$globalActive = $request->get('global_active');
		if ($globalActive && $globalActive !== 'all') {
			$this->filter['GLOBAL_ACTIVE'] = $globalActive;
		}
	
		// Приоритет parent_section_id над section_id
		if ($this->parentSectionId) {
			$this->filter['SECTION_ID'] = $this->parentSectionId;
		} elseif ($this->sectionId) {
			$this->filter['SECTION_ID'] = $this->sectionId;
		} elseif ($this->parentSection === 'root') {
			$this->filter['SECTION_ID'] = false;
		}

        // Поиск
        if ($name = $request->get('name')) {
            $this->filter['%NAME'] = $name;
        }

        if ($code = $request->get('code')) {
            $this->filter['CODE'] = $code;
        }

        if ($externalId = $request->get('external_id')) {
            $this->filter['EXTERNAL_ID'] = $externalId;
        }
    }

    /**
     * Получение разделов
     */
    private function getSections(): array
    {
        if ($this->treeMode === 'nested') {
            return $this->getSectionsTree();
        }
        
        return $this->getSectionsFlat();
    }

    /**
     * Батчевая обработка URL изображений разделов с кешированием
     */
    private function processImageUrls(array $sections): array
    {
        if (empty($sections)) {
            return $sections;
        }

        // Извлекаем все ID изображений из разделов
        $pictureIds = [];
        foreach ($sections as $section) {
            if (!empty($section['PICTURE']) && is_numeric($section['PICTURE'])) {
                $pictureIds[] = (int)$section['PICTURE'];
            }
        }

        if (empty($pictureIds)) {
            return $sections;
        }

        // Создаем ключ кеша на основе ID изображений
        $pictureIdsHash = md5(implode(',', array_unique($pictureIds)));
        $cacheKey = "sections_images_{$this->iBlockId}_{$pictureIdsHash}";
        
        $cache = \Bitrix\Main\Data\Cache::createInstance();
        $cacheDir = '/artamonov/rest/sections_images/';
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
                        'Sections Image Processing Error',
                        '/local/logs/rest_api.log'
                    );
                }
            }

            $cache->endDataCache($imageUrls);
        }

        // Дополняем разделы новыми полями с URL изображений
        foreach ($sections as &$section) {
            if (!empty($section['PICTURE']) && is_numeric($section['PICTURE'])) {
                $pictureId = (int)$section['PICTURE'];
                
                if (isset($imageUrls[$pictureId])) {
                    $section['PICTURE_SRC'] = $imageUrls[$pictureId]['original'];
                    $section['PICTURE_PREVIEW_SRC'] = $imageUrls[$pictureId]['preview'];
                } else {
                    $section['PICTURE_SRC'] = '';
                    $section['PICTURE_PREVIEW_SRC'] = '';
                }
            } else {
                $section['PICTURE_SRC'] = '';
                $section['PICTURE_PREVIEW_SRC'] = '';
            }
        }

        return $sections;
    }

    /**
     * Получение разделов в виде плоского списка
     */
    private function getSectionsFlat(): array
    {
        $sections = [];
        $rawSections = [];
        
        $res = CIBlockSection::GetList(
            $this->sort,
            $this->filter,
            false,
            $this->select
        );

        while ($section = $res->GetNext()) {
            $rawSections[] = $section;
        }

        // Обрабатываем изображения батчем
        $processedSections = $this->processImageUrls($rawSections);

        // Форматируем разделы
        foreach ($processedSections as $section) {
            $formattedSection = $this->formatSection($section);
            $sections[] = $formattedSection;
        }

        return $sections;
    }

    /**
     * Получение разделов в виде дерева (ИСПРАВЛЕННАЯ ВЕРСИЯ)
     */
	private function getSectionsTree(): array
	{
		// Получаем все разделы для построения дерева
		$filter = [
			'IBLOCK_ID' => $this->iBlockId,
			'ACTIVE' => 'Y',
			'GLOBAL_ACTIVE' => 'Y'
		];
	
		// Определяем базовый раздел для построения дерева
		$baseSection = null;
		$baseSectionId = $this->parentSectionId ?: $this->sectionId;
		
		if ($baseSectionId) {
			// Получаем информацию о родительском разделе для определения границ
			$baseSection = CIBlockSection::GetByID($baseSectionId)->Fetch();
			if ($baseSection) {
				$filter = array_merge($filter, [
					'>LEFT_MARGIN' => $baseSection['LEFT_MARGIN'],
					'<RIGHT_MARGIN' => $baseSection['RIGHT_MARGIN']
				]);
				
				// Ограничиваем глубину если задано
				if ($this->maxDepth) {
					$filter['<=DEPTH_LEVEL'] = $baseSection['DEPTH_LEVEL'] + $this->maxDepth;
				}
			}
		} elseif ($this->parentSection === 'root') {
			$filter['SECTION_ID'] = false; // Только корневые
		}
	
		// Сортировка для правильного построения дерева
		$sort = ['LEFT_MARGIN' => 'ASC'];
	
		$rawSections = [];
		$allSections = [];
		$res = CIBlockSection::GetList($sort, $filter, false, $this->select);
	
		while ($section = $res->GetNext()) {
			$rawSections[] = $section;
		}

		// Обрабатываем изображения батчем
		$processedSections = $this->processImageUrls($rawSections);

		// Форматируем разделы
		foreach ($processedSections as $section) {
			$formattedSection = $this->formatSection($section);
			$formattedSection['children'] = [];
			$allSections[$formattedSection['id']] = $formattedSection;
		}
	
		// Строим дерево
		$tree = [];
		
		foreach ($allSections as $section) {
			$parentId = isset($section['fields']['IBLOCK_SECTION_ID']) 
				? $section['fields']['IBLOCK_SECTION_ID'] 
				: null;
	
			if (!$parentId) {
				// Корневой раздел
				$tree[] = $section;
			} else {
				// Дочерний раздел
				if (isset($allSections[$parentId])) {
					$allSections[$parentId]['children'][] = $section;
					// Обновляем ссылку в основном массиве
					$allSections[$parentId] = $allSections[$parentId];
				}
			}
		}
	
		// Обновляем ссылки в дереве
		$this->updateTreeReferences($tree, $allSections);
	
		return $tree;
	}
    /**
     * Обновление ссылок в дереве (рекурсивно)
     */
    private function updateTreeReferences(array &$tree, array &$allSections): void
    {
        foreach ($tree as &$section) {
            if (isset($allSections[$section['id']])) {
                $section = $allSections[$section['id']];
            }
            
            if (!empty($section['children'])) {
                $this->updateTreeReferences($section['children'], $allSections);
            }
        }
    }

    /**
     * Подсчет общего количества разделов
     */
    private function getTotalCount(array $sections): int
    {
        if ($this->treeMode === 'nested') {
            return $this->countNestedSections($sections);
        }
        
        return count($sections);
    }

    /**
     * Рекурсивный подсчет разделов в дереве
     */
    private function countNestedSections(array $sections): int
    {
        $count = count($sections);
        
        foreach ($sections as $section) {
            if (!empty($section['children'])) {
                $count += $this->countNestedSections($section['children']);
            }
        }
        
        return $count;
    }

    /**
     * Форматирование раздела
     */
    private function formatSection(array $section): array
    {
        $formatted = [
            'id' => $section['ID'],
            'name' => $section['NAME']
        ];

        // Основные поля
        if ($this->format !== 'minimal') {
            $cleanFields = $this->cleanFields($section);
            $formatted['fields'] = $cleanFields;
        } else {
            $formatted = array_merge($formatted, $this->cleanFields($section));
        }

        // Количество элементов
        if ($this->withElementCount) {
            $formatted['element_count'] = $this->getElementCount((int)$section['ID']);
        }

        // Количество подразделов
        if ($this->withSubsectionCount) {
            $formatted['subsection_count'] = $this->getSubsectionCount((int)$section['ID']);
        }

        // SEO данные
        if ($this->withSeo) {
            $formatted['seo'] = $this->getSeoData((int)$section['ID']);
        }

        // Свойства разделов
        if ($this->withProperties) {
            $formatted['properties'] = $this->getSectionProperties((int)$section['ID']);
        }

        // Бренды из элементов
        if ($this->brandsFromElements) {
            $formatted['brands'] = $this->getBrandsFromElements((int)$section['ID']);
        }

        return $formatted;
    }

    /**
     * Очистка полей
     */
    private function cleanFields(array $fields): array
    {
        $cleaned = [];
        
        foreach ($fields as $key => $value) {
            // Пропускаем служебные поля
            if (str_starts_with($key, '~')) {
                continue;
            }

            // Исключение конкретных полей
            if (in_array($key, $this->excludeFields)) {
                continue;
            }

            $cleaned[$key] = $value;
        }

        // Если указаны только определенные поля
        if (!empty($this->fieldsOnly)) {
            $cleaned = array_intersect_key($cleaned, array_flip($this->fieldsOnly));
        }

        return $cleaned;
    }

    /**
     * Получение количества элементов в разделе
     */
    private function getElementCount(int $sectionId): int
    {
        $filter = [
            'IBLOCK_ID' => $this->iBlockId,
            'SECTION_ID' => $sectionId
        ];

        if ($this->countActiveOnly) {
            $filter['ACTIVE'] = 'Y';
        }

        return CIBlockElement::GetList([], $filter, []);
    }

    /**
     * Получение количества подразделов
     */
    private function getSubsectionCount(int $sectionId): int
    {
        return CIBlockSection::GetList(
            [],
            [
                'IBLOCK_ID' => $this->iBlockId,
                'SECTION_ID' => $sectionId,
                'ACTIVE' => 'Y'
            ],
            []
        );
    }

    /**
     * Получение SEO данных раздела
     */
    private function getSeoData(int $sectionId): array
    {
        $seoValues = (new SectionValues($this->iBlockId, $sectionId))->getValues();
        
        return [
            'meta_title' => $seoValues['SECTION_META_TITLE'] ?? '',
            'meta_description' => $seoValues['SECTION_META_DESCRIPTION'] ?? '',
            'meta_keywords' => $seoValues['SECTION_META_KEYWORDS'] ?? ''
        ];
    }

    /**
     * Получение свойств раздела
     */
    private function getSectionProperties(int $sectionId): array
    {
        $properties = [];
        
        // Если есть пользовательские поля разделов
        $dbSection = CIBlockSection::GetList(
            [],
            ['IBLOCK_ID' => $this->iBlockId, 'ID' => $sectionId],
            false,
            ['UF_*']
        );
        
        if ($section = $dbSection->GetNext()) {
            foreach ($section as $key => $value) {
                if (str_starts_with($key, 'UF_') && $value) {
                    $properties[$key] = $value;
                }
            }
        }
        
        return $properties;
    }

    /**
     * Получение брендов из элементов раздела
     */
    private function getBrandsFromElements(int $sectionId): array
    {
        $brands = [];
        
        $res = CIBlockElement::GetList(
            [],
            [
                'IBLOCK_ID' => $this->iBlockId,
                'SECTION_ID' => $sectionId,
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
            
            if ($brandValue) {
                if ($this->uniqueBrandsOnly) {
                    $brands[] = $brandValue;
                } else {
                    $brands[] = [
                        'element_id' => $fields['ID'],
                        'brand' => $brandValue
                    ];
                }
            }
        }

        return $this->uniqueBrandsOnly ? array_unique($brands) : $brands;
    }

    /**
     * Парсинг сортировки
     */
    private function parseSortParam(string $sort): array
    {
        $result = [];
        $sortPairs = explode(',', $sort);

        foreach ($sortPairs as $pair) {
            $parts = explode(':', trim($pair));
            if (count($parts) === 2) {
                $field = trim($parts[0]);
                $order = strtoupper(trim($parts[1])) === 'DESC' ? 'DESC' : 'ASC';
                $result[$field] = $order;
            }
        }

        return !empty($result) ? $result : $this->sort;
    }

    private function validateRequest(): void
    {
        if ($this->iBlockId <= 0) {
            $this->errorResponse(400, 'Invalid iblock_id parameter');
        }

        if (!in_array($this->format, ['full', 'compact', 'minimal'])) {
            $this->errorResponse(400, 'Invalid format parameter');
        }

        if (!in_array($this->treeMode, ['flat', 'nested'])) {
            $this->errorResponse(400, 'Invalid tree_mode parameter');
        }
    }

    private function errorResponse(int $code, string $message): void
    {
        response()
            ->json(['error' => $message], $code)
            ->send();
        exit;
    }
}
