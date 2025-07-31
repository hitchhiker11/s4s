<?php
namespace Artamonov\Rest\Controllers\Native;

use Artamonov\Rest\Controllers\Native\Base\CatalogBase;
use CIBlockElement, CIBlockSection;

/**
 * Контроллер для получения списка товаров каталога
 */
class Catalog extends CatalogBase
{
    private ?int $sectionId = null;
    private ?int $brandId = null;
    private array $sort = ['SORT' => 'ASC'];
    private array $select = ['ID', 'IBLOCK_ID', 'NAME', 'DATE_ACTIVE_FROM', 'DETAIL_PAGE_URL', 'DETAIL_TEXT', 'PREVIEW_PICTURE', 'DETAIL_PICTURE', 'CATALOG_QUANTITY'];
    private array $filter = [];
    private array $navParams = [];
    private ?string $brandFilter = null;
    
    // Настройки подразделов/подбрендов
    private bool $includeSubsections = false;
    private bool $deepSubsections = false;
    
    // Новые настройки для брендов
    private bool $includeSubbrands = false;
    private bool $deepSubbrands = false;
    
    private int $limit = 10;
    private int $page = 1;
    
    // ID инфоблока брендов (по умолчанию)
    private int $brandsIBlockId = 22;


	public function _get(): void
	{
		try {
			$this->parseRequest();
			$this->validateRequest();
			
			// Проверяем, запрашивают ли список брендов
			$request = request();
			if ($request->get('action') === 'brands') {
				$this->getBrandsList();
				return;
			}
			
			$this->buildFilter();
			$this->setupNavigation();
	
			$elements = $this->getCatalogElements();
			$totalCount = $this->getTotalCount();
	
			$response = $this->buildResponse($elements, $totalCount);
			response()->json($response);
	
		} catch (\Exception $e) {
			\Bitrix\Main\Diag\Debug::writeToFile(
				[
					'error' => $e->getMessage(),
					'trace' => $e->getTraceAsString(),
					'request_params' => request()->getInput()
				],
				'Catalog API Error',
				'/local/logs/rest_api.log'
			);
			
			$this->errorResponse(500, $e->getMessage());
		}
	}

    /**
     * Парсинг параметров запроса специфичных для списка товаров
     */


	private function parseRequest(): void
	{
		// Парсим базовые параметры из родительского класса
		$this->parseBaseRequest();
		
		$request = request();
		
		// Проверяем что request существует
		if (!$request) {
			throw new \Exception('Request object not available');
		}
	
		// Специфичные для списка параметры - РАЗДЕЛЫ
		if ($request->get('section_id')) {
			$this->sectionId = (int)$request->get('section_id');
		} elseif ($request->get('category')) {
			$this->sectionId = $this->getSectionByOrder((int)$request->get('category'));
		}
	
		// НОВОЕ: Специфичные для списка параметры - БРЕНДЫ
		if ($request->get('brand_id')) {
			$this->brandId = (int)$request->get('brand_id');
		} elseif ($request->get('brand_category')) {
			$this->brandId = $this->getBrandByOrder((int)$request->get('brand_category'));
		}
		
		// Получаем ID инфоблока брендов из параметров или используем по умолчанию
		if ($request->get('brands_iblock_id')) {
			$this->brandsIBlockId = (int)$request->get('brands_iblock_id');
		}
	
		// Параметры для работы с подразделами
		$this->includeSubsections = $request->get('include_subsections') === 'Y';
		$this->deepSubsections = $request->get('deep_subsections') === 'Y';
		
		// НОВОЕ: Параметры для работы с подбрендами
		$this->includeSubbrands = $request->get('include_subbrands') === 'Y';
		$this->deepSubbrands = $request->get('deep_subbrands') === 'Y';
	
		// Фильтр по бренду (старый способ через название)
		$this->brandFilter = $request->get('brand');
	
		// Пагинация
		$limit = (int)$request->get('limit');
		if ($limit > 0) {
			$this->limit = min($limit, 100);
		}
	
		$page = (int)$request->get('page');
		if ($page > 0) {
			$this->page = $page;
		}
	
		// Сортировка
		if ($sortParam = $request->get('sort')) {
			$this->sort = $this->parseSortParam($sortParam);
		}
	
		// Дополнительные поля для выборки
		if ($selectParam = $request->get('select')) {
			if (is_array($selectParam)) {
				$this->select = array_merge($this->select, $selectParam);
				$this->select = array_unique($this->select);
			}
		}
	}



    /**
     * Валидация параметров запроса
     */
    private function validateRequest(): void
    {
        // Базовая валидация инфоблока
        $this->validateIBlock();

        if ($this->page < 1) {
            $this->errorResponse(400, 'Page parameter must be greater than 0');
        }

        if (!in_array($this->format, ['full', 'compact', 'minimal'])) {
            $this->errorResponse(400, 'Invalid format parameter');
        }
    }

    /**
     * Построение фильтра для выборки элементов
     */
	private function buildFilter(): void
	{
		$request = request();
		
		$this->filter = ['IBLOCK_ID' => $this->iBlockId];
	
		// Фильтр по активности
		$active = $request->get('active') ?: 'Y';
		if ($active !== 'all') {
			$this->filter['ACTIVE'] = $active;
		}
	
		// Фильтр по разделу с поддержкой подразделов
		if ($this->sectionId) {
			$this->applySectionFilter();
		}
		
		// НОВОЕ: Фильтр по бренду с поддержкой подбрендов
		if ($this->brandId) {
			$this->applyBrandFilter();
		}
	
		// Применяем различные типы фильтров
		$this->addFieldFilters($request);
		$this->addPropertyFilters($request);
		$this->addPriceFilters($request);
		$this->addStatusFilters($request);
	}

	/**
	 * Применение фильтра по разделам с учетом подразделов
	 */
	private function applySectionFilter(): void
	{
		if ($this->deepSubsections) {
			// Глубокий поиск - используем LEFT_MARGIN и RIGHT_MARGIN для получения всех товаров из дерева разделов
			$this->applyDeepSectionFilter();
		} elseif ($this->includeSubsections) {
			// Стандартный поиск в подразделах первого уровня
			$this->filter['SECTION_ID'] = $this->sectionId;
			$this->filter['INCLUDE_SUBSECTIONS'] = 'Y';
		} else {
			// Только товары в конкретном разделе (старое поведение)
			$this->filter['SECTION_ID'] = $this->sectionId;
		}
	}

	/**
	 * Глубокий поиск по всему дереву разделов
	 */
	private function applyDeepSectionFilter(): void
	{
		// Получаем информацию о разделе для определения границ в дереве
		$sectionInfo = CIBlockSection::GetByID($this->sectionId)->Fetch();
		
		if (!$sectionInfo) {
			$this->errorResponse(404, 'Section not found');
			return;
		}
	
		// Получаем все ID разделов в поддереве
		$subsectionIds = $this->getAllSubsectionIds($sectionInfo);
		
		if (!empty($subsectionIds)) {
			$this->filter['SECTION_ID'] = $subsectionIds;
		} else {
			// Если нет подразделов, ищем только в указанном разделе
			$this->filter['SECTION_ID'] = $this->sectionId;
		}
	}


	/**
	 * Получение всех ID подразделов включая вложенные
	 */
	private function getAllSubsectionIds(array $sectionInfo): array
	{
		$subsectionIds = [$this->sectionId]; // Включаем сам раздел
		
		// Используем LEFT_MARGIN и RIGHT_MARGIN для эффективного поиска в дереве
		$dbSections = CIBlockSection::GetList(
			[],
			[
				'IBLOCK_ID' => $this->iBlockId,
				'>LEFT_MARGIN' => $sectionInfo['LEFT_MARGIN'],
				'<RIGHT_MARGIN' => $sectionInfo['RIGHT_MARGIN'],
				'ACTIVE' => 'Y',
				'GLOBAL_ACTIVE' => 'Y'
			],
			false,
			['ID']
		);
		
		while ($section = $dbSections->Fetch()) {
			$subsectionIds[] = (int)$section['ID'];
		}
		
		return array_unique($subsectionIds);
	}

	/**
	 * Применение фильтра по брендам с учетом подбрендов
	 */
	private function applyBrandFilter(): void
	{
		if ($this->deepSubbrands) {
			// Глубокий поиск - используем LEFT_MARGIN и RIGHT_MARGIN для получения всех товаров подбрендов
			$this->applyDeepBrandFilter();
		} elseif ($this->includeSubbrands) {
			// Стандартный поиск в подбрендах первого уровня
			$brandIds = $this->getDirectSubbrandIds();
			$this->filter['PROPERTY_BRAND_ELEMENT'] = $brandIds;
		} else {
			// Только товары конкретного бренда
			$this->filter['PROPERTY_BRAND_ELEMENT'] = $this->brandId;
		}
	}

	/**
	 * Глубокий поиск по всему дереву брендов
	 */
	private function applyDeepBrandFilter(): void
	{
		// Получаем информацию о бренде для определения границ в дереве
		$brandInfo = \CIBlockElement::GetByID($this->brandId)->GetNext();
		
		if (!$brandInfo) {
			$this->errorResponse(404, 'Brand not found');
			return;
		}

		// Получаем все ID суббрендов в поддереве
		$subbrandIds = $this->getAllSubbrandIds($brandInfo);
		
		if (!empty($subbrandIds)) {
			$this->filter['PROPERTY_BRAND_ELEMENT'] = $subbrandIds;
		} else {
			// Если нет подбрендов, ищем только товары указанного бренда
			$this->filter['PROPERTY_BRAND_ELEMENT'] = $this->brandId;
		}
	}

	/**
	 * Получение прямых подбрендов (первый уровень)
	 */
	private function getDirectSubbrandIds(): array
	{
		$brandIds = [$this->brandId]; // Включаем сам бренд
		
		// В системе брендов может не быть иерархии как в разделах,
		// но мы можем искать бренды с родителем через свойство или другую логику
		// Пока возвращаем только указанный бренд
		
		return $brandIds;
	}

	/**
	 * Получение всех ID подбрендов включая вложенные
	 */
	private function getAllSubbrandIds(array $brandInfo): array
	{
		$brandIds = [$this->brandId]; // Включаем сам бренд
		
		// Здесь можно реализовать логику поиска подбрендов
		// если в системе брендов будет иерархия
		// Пока возвращаем только указанный бренд
		
		return $brandIds;
	}

	/**
	 * Получение бренда по порядковому номеру
	 */
	private function getBrandByOrder(int $order): ?int
	{
		$dbBrand = \CIBlockElement::GetList(
			['SORT' => 'ASC', 'NAME' => 'ASC'],
			[
				'IBLOCK_ID' => $this->brandsIBlockId,
				'ACTIVE' => 'Y'
			],
			false,
			['nTopCount' => $order],
			['ID']
		);

		$counter = 1;
		while ($brand = $dbBrand->Fetch()) {
			if ($counter === $order) {
				return (int)$brand['ID'];
			}
			$counter++;
		}

		return null;
	}


	/**
	 * Получение информации о примененных фильтрах по разделам
	 */
	private function getSectionFilterInfo(): array
	{
		$info = [
			'main_section' => null,
			'mode' => 'exact', // exact, subsections, deep
			'included_sections_count' => 1
		];
		
		// Получаем информацию о главном разделе
		$mainSection = CIBlockSection::GetByID($this->sectionId)->Fetch();
		if ($mainSection) {
			$info['main_section'] = [
				'id' => $mainSection['ID'],
				'name' => $mainSection['NAME'],
				'code' => $mainSection['CODE']
			];
		}
		
		// Определяем режим поиска
		if ($this->deepSubsections) {
			$info['mode'] = 'deep';
			if ($mainSection) {
				$info['included_sections_count'] = count($this->getAllSubsectionIds($mainSection));
			}
		} elseif ($this->includeSubsections) {
			$info['mode'] = 'subsections';
			// ИСПРАВЛЕНО: Правильный подсчет разделов первого уровня
			$subsectionsCount = CIBlockSection::GetList(
				[],
				[
					'IBLOCK_ID' => $this->iBlockId,
					'SECTION_ID' => $this->sectionId,
					'ACTIVE' => 'Y'
				],
				[] // Третий параметр для подсчета
			);
			$info['included_sections_count'] = 1 + (int)$subsectionsCount; // Приводим к int
		}
		
		return $info;
	}

	/**
	 * Получение информации о примененных фильтрах по брендам
	 */
	private function getBrandFilterInfo(): array
	{
		$info = [
			'main_brand' => null,
			'mode' => 'exact', // exact, subbrands, deep
			'included_brands_count' => 1
		];
		
		// Получаем информацию о главном бренде
		$mainBrand = \CIBlockElement::GetByID($this->brandId)->GetNext();
		if ($mainBrand) {
			$info['main_brand'] = [
				'id' => $mainBrand['ID'],
				'name' => $mainBrand['NAME'],
				'code' => $mainBrand['CODE'],
				'preview_picture' => $mainBrand['PREVIEW_PICTURE'],
				'detail_picture' => $mainBrand['DETAIL_PICTURE'],
				'preview_text' => $mainBrand['PREVIEW_TEXT'],
				'detail_text' => $mainBrand['DETAIL_TEXT']
			];
		}
		
		// Определяем режим поиска
		if ($this->deepSubbrands) {
			$info['mode'] = 'deep';
			if ($mainBrand) {
				$info['included_brands_count'] = count($this->getAllSubbrandIds($mainBrand));
			}
		} elseif ($this->includeSubbrands) {
			$info['mode'] = 'subbrands';
			$info['included_brands_count'] = count($this->getDirectSubbrandIds());
		}
		
		return $info;
	}



    /**
     * Добавление фильтров по полям элементов
     */
    private function addFieldFilters($request): void
    {
        if ($name = $request->get('name')) {
            $this->filter['%NAME'] = $name;
        }

        if ($code = $request->get('code')) {
            $this->filter['CODE'] = $code;
        }

        if ($externalId = $request->get('external_id')) {
            $this->filter['EXTERNAL_ID'] = $externalId;
        }

        // Фильтр по датам создания
        if ($dateFrom = $request->get('date_from')) {
            $this->filter['>=DATE_CREATE'] = $dateFrom;
        }

        if ($dateTo = $request->get('date_to')) {
            $this->filter['<=DATE_CREATE'] = $dateTo . ' 23:59:59';
        }

        // Фильтр по датам изменения
        if ($modifiedFrom = $request->get('modified_from')) {
            $this->filter['>=TIMESTAMP_X'] = $modifiedFrom;
        }

        if ($modifiedTo = $request->get('modified_to')) {
            $this->filter['<=TIMESTAMP_X'] = $modifiedTo;
        }
    }


	/**
	 * Добавление фильтров по свойствам элементов
	 */
	private function addPropertyFilters($request): void
	{
		// Специальный фильтр по бренду (старый способ по названию)
		if ($this->brandFilter && !$this->brandId) {
			if (is_array($this->brandFilter)) {
				// Множественный выбор брендов
				$this->filter["PROPERTY_BREND"] = $this->brandFilter;
			} else {
				// Один бренд
				$this->filter["PROPERTY_BREND"] = $this->brandFilter;
			}
		}
	
		// Точное совпадение по свойствам
		if ($properties = $request->get('property')) {
			foreach ($properties as $code => $value) {
				// Избегаем дублирования если BRAND уже обработан через brand параметр
				if (($code === 'BRAND' || $code === 'BREND') && $this->brandFilter) {
					continue;
				}
				// Избегаем дублирования если BRAND_ELEMENT уже обработан через brand_id
				if ($code === 'BRAND_ELEMENT' && $this->brandId) {
					continue;
				}
				$this->filter["PROPERTY_{$code}"] = $value;
			}
		}
	
		// Поиск с LIKE по свойствам
		if ($propertiesLike = $request->get('property_like')) {
			foreach ($propertiesLike as $code => $value) {
				// Избегаем дублирования если BRAND уже обработан через brand параметр
				if (($code === 'BRAND' || $code === 'BREND') && $this->brandFilter) {
					continue;
				}
				// Избегаем дублирования если BRAND_ELEMENT уже обработан через brand_id
				if ($code === 'BRAND_ELEMENT' && $this->brandId) {
					continue;
				}
				$this->filter["%PROPERTY_{$code}"] = $value;
			}
		}
	
		// Диапазон для числовых свойств
		if ($propertyRange = $request->get('property_range')) {
			foreach ($propertyRange as $code => $range) {
				if (isset($range['from'])) {
					$this->filter[">=PROPERTY_{$code}"] = $range['from'];
				}
				if (isset($range['to'])) {
					$this->filter["<=PROPERTY_{$code}"] = $range['to'];
				}
			}
		}
	}


    /**
     * Добавление фильтров по ценам
     */
    private function addPriceFilters($request): void
    {
        $priceFrom = $request->get('price_from');
        $priceTo = $request->get('price_to');
        $priceType = $request->get('price_type') ?: 1;
        $currency = $request->get('currency') ?: 'RUB';

        if ($priceFrom || $priceTo) {
            if ($priceFrom) {
                $this->filter[">=CATALOG_PRICE_{$priceType}"] = $priceFrom;
            }
            if ($priceTo) {
                $this->filter["<=CATALOG_PRICE_{$priceType}"] = $priceTo;
            }
            $this->filter["CATALOG_SHOP_QUANTITY_{$priceType}"] = 1;
        }
    }

    /**
     * Добавление статусных фильтров (наличие, доступность и т.д.)
     */
    private function addStatusFilters($request): void
    {
        if ($request->get('available') === 'Y') {
            $this->filter['CATALOG_AVAILABLE'] = 'Y';
        } elseif ($request->get('available') === 'N') {
            $this->filter['CATALOG_AVAILABLE'] = 'N';
        }

        if ($request->get('in_stock') === 'Y') {
            $this->filter['>CATALOG_QUANTITY'] = 0;
        } elseif ($request->get('in_stock') === 'N') {
            $this->filter['<=CATALOG_QUANTITY'] = 0;
        }

        if ($request->get('has_price') === 'Y') {
            $this->filter['>CATALOG_PRICE_1'] = 0;
        }

        // Фильтр по наличию фотографий
        if ($request->get('has_photos') === 'Y') {
            // Создаем OR условие для проверки наличия изображений в разных полях
            $photoFilter = [
                'LOGIC' => 'OR',
                ['!PREVIEW_PICTURE' => false],
                ['!DETAIL_PICTURE' => false],
                ['!PROPERTY_MORE_PHOTO' => false]
            ];
            $this->filter[] = $photoFilter;
        }
    }

    /**
     * Получение элементов каталога с учетом фильтра и пагинации
     */
    private function getCatalogElements(): array
    {
        $result = [];

        $res = \CIBlockElement::GetList(
            $this->sort,
            $this->filter,
            false,
            $this->navParams,
            $this->select
        );

        while ($element = $res->GetNextElement()) {
            $fields = $element->GetFields();
            $properties = $element->GetProperties();

            // Используем метод форматирования из базового класса
            $item = $this->formatElement($fields, $properties);
            $result[] = $item;
        }

        return $result;
    }

    /**
     * Получение раздела по порядковому номеру
     */
    private function getSectionByOrder(int $order): ?int
    {
        $dbSection = \CIBlockSection::GetList(
            ['SORT' => 'ASC', 'NAME' => 'ASC'],
            [
                'IBLOCK_ID' => $this->iBlockId,
                'ACTIVE' => 'Y',
                'SECTION_ID' => false // Только разделы первого уровня
            ],
            false,
            ['ID']
        );

        $counter = 1;
        while ($section = $dbSection->Fetch()) {
            if ($counter === $order) {
                return (int)$section['ID'];
            }
            $counter++;
        }

        return null;
    }

    /**
     * Настройка параметров навигации (пагинации)
     */
    private function setupNavigation(): void
    {
        $this->navParams = [
            'nPageSize' => $this->limit,
            'iNumPage' => $this->page,
            'bShowAll' => false
        ];
    }

    /**
     * Парсинг параметра сортировки
     * Формат: sort=field1:asc,field2:desc
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
                
                // Обработка специальных полей для удобства
                switch ($field) {
                    case 'price':
                        $field = 'CATALOG_PRICE_1';
                        break;
                    case 'name':
                        $field = 'NAME';
                        break;
                    case 'id':
                        $field = 'ID';
                        break;
                    case 'date':
                        $field = 'DATE_CREATE';
                        break;
                    case 'modified':
                        $field = 'TIMESTAMP_X';
                        break;
                }
                
                $result[$field] = $order;
            }
        }

        return !empty($result) ? $result : $this->sort;
    }

    /**
     * Получение общего количества элементов (для пагинации)
     */
    private function getTotalCount(): int
    {
        return \CIBlockElement::GetList([], $this->filter, []);
    }

    /**
     * Построение финального ответа API
     */
	private function buildResponse(array $elements, int $totalCount): array
	{
		$response = [
			'meta' => [
				'iblock_id' => $this->iBlockId,
				'brands_iblock_id' => $this->brandsIBlockId,
				'section_id' => $this->sectionId,
				'brand_id' => $this->brandId,
				'brand_filter' => $this->brandFilter, // старый способ фильтрации
				'include_subsections' => $this->includeSubsections,
				'deep_subsections' => $this->deepSubsections,
				'include_subbrands' => $this->includeSubbrands,
				'deep_subbrands' => $this->deepSubbrands,
				'page' => $this->page,
				'limit' => $this->limit,
				'total_count' => $totalCount,
				'total_pages' => $totalCount > 0 ? ceil($totalCount / $this->limit) : 0,
				'current_count' => count($elements),
				'format' => $this->format,
				'has_next_page' => ($this->page * $this->limit) < $totalCount,
				'has_prev_page' => $this->page > 1,
				'request_time' => date('Y-m-d H:i:s'),
				'filter_applied' => [
					'section_filter' => $this->sectionId !== null,
					'brand_id_filter' => $this->brandId !== null,
					'brand_name_filter' => $this->brandFilter !== null,
					'subsections_included' => $this->includeSubsections || $this->deepSubsections,
					'subbrands_included' => $this->includeSubbrands || $this->deepSubbrands,
					'field_filters' => $this->hasFieldFilters(),
					'property_filters' => $this->hasPropertyFilters(),
					'price_filters' => $this->hasPriceFilters(),
					'status_filters' => $this->hasStatusFilters()
				]
			]
		];
	
		// Добавляем информацию о разделах только если есть section_id и включены подразделы
		if ($this->sectionId && ($this->includeSubsections || $this->deepSubsections)) {
			try {
				$response['meta']['section_info'] = $this->getSectionFilterInfo();
			} catch (\Exception $e) {
				// В случае ошибки добавляем базовую информацию
				$response['meta']['section_info'] = [
					'main_section' => ['id' => $this->sectionId],
					'mode' => $this->deepSubsections ? 'deep' : ($this->includeSubsections ? 'subsections' : 'exact'),
					'included_sections_count' => 1,
					'error' => 'Could not calculate section info: ' . $e->getMessage()
				];
			}
		}
		
		// НОВОЕ: Добавляем информацию о брендах только если есть brand_id
		if ($this->brandId) {
			try {
				$response['meta']['brand_info'] = $this->getBrandFilterInfo();
			} catch (\Exception $e) {
				// В случае ошибки добавляем базовую информацию
				$response['meta']['brand_info'] = [
					'main_brand' => ['id' => $this->brandId],
					'mode' => $this->deepSubbrands ? 'deep' : ($this->includeSubbrands ? 'subbrands' : 'exact'),
					'included_brands_count' => 1,
					'error' => 'Could not calculate brand info: ' . $e->getMessage()
				];
			}
		}
	
		// Структура данных зависит от формата ответа
		if ($this->format === 'compact') {
			$response['items'] = $elements;
		} else {
			$response['data'] = $elements;
		}
	
		return $response;
	}



    /**
     * Проверка наличия фильтров по полям
     */
    private function hasFieldFilters(): bool
    {
        $fieldKeys = ['%NAME', 'CODE', 'EXTERNAL_ID', '>=DATE_CREATE', '<=DATE_CREATE', '>=TIMESTAMP_X', '<=TIMESTAMP_X'];
        
        foreach ($fieldKeys as $key) {
            if (isset($this->filter[$key])) {
                return true;
            }
        }
        
        return false;
    }

	/**
	 * Проверка наличия фильтров по свойствам
	 */
	private function hasPropertyFilters(): bool
	{
		// Проверяем фильтр по бренду
		if ($this->brandFilter) {
			return true;
		}
	
		// Проверяем остальные фильтры по свойствам
		foreach (array_keys($this->filter) as $key) {
			if (strpos($key, 'PROPERTY_') === 0) {
				return true;
			}
		}

		return false;
	}


    /**
     * Проверка наличия фильтров по ценам
     */
    private function hasPriceFilters(): bool
    {
        foreach (array_keys($this->filter) as $key) {
            if (strpos($key, 'CATALOG_PRICE_') === 0) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Проверка наличия статусных фильтров
     */
    private function hasStatusFilters(): bool
    {
        $statusKeys = ['CATALOG_AVAILABLE', '>CATALOG_QUANTITY', '<=CATALOG_QUANTITY', '>CATALOG_PRICE_1'];
        
        foreach ($statusKeys as $key) {
            if (isset($this->filter[$key])) {
                return true;
            }
        }
        
        // Проверяем наличие фильтра по фотографиям
        foreach ($this->filter as $filterItem) {
            if (is_array($filterItem) && isset($filterItem['LOGIC']) && $filterItem['LOGIC'] === 'OR') {
                return true;
            }
        }
        
        return false;
    }

	/**
	 * Получение списка брендов с полной информацией
	 */
	private function getBrandsList(): void
	{
		$request = request();
		
		// Параметры фильтрации брендов
		$filter = [
			'IBLOCK_ID' => $this->brandsIBlockId,
			'ACTIVE' => 'Y'
		];
		
		// Дополнительные фильтры
		if ($search = $request->get('search')) {
			$filter['%NAME'] = $search;
		}
		
		if ($withProducts = $request->get('with_products')) {
			if ($withProducts === 'Y') {
				// Получаем только бренды, у которых есть товары
				$brandsWithProducts = $this->getBrandsWithProducts();
				if (!empty($brandsWithProducts)) {
					$filter['ID'] = $brandsWithProducts;
				} else {
					// Если нет брендов с товарами, возвращаем пустой результат
					response()->json([
						'meta' => [
							'action' => 'brands',
							'brands_iblock_id' => $this->brandsIBlockId,
							'total_count' => 0,
							'with_products_only' => true,
						],
						'data' => []
					]);
					return;
				}
			}
		}
		
		// Сортировка
		$sort = ['SORT' => 'ASC', 'NAME' => 'ASC'];
		if ($sortParam = $request->get('sort')) {
			$sort = $this->parseSortParam($sortParam);
		}
		
		// Получаем бренды
		$brands = [];
		$res = \CIBlockElement::GetList(
			$sort,
			$filter,
			false,
			false,
			['ID', 'NAME', 'CODE', 'SORT', 'PREVIEW_PICTURE', 'DETAIL_PICTURE', 'PREVIEW_TEXT', 'DETAIL_TEXT', 'ACTIVE', 'DATE_CREATE', 'TIMESTAMP_X']
		);
		
		while ($element = $res->GetNextElement()) {
			$fields = $element->GetFields();
			$properties = $element->GetProperties();
			
			// Форматируем изображения
			if ($fields['PREVIEW_PICTURE']) {
				$fields['PREVIEW_PICTURE'] = $this->formatImage($fields['PREVIEW_PICTURE']);
			}
			if ($fields['DETAIL_PICTURE']) {
				$fields['DETAIL_PICTURE'] = $this->formatImage($fields['DETAIL_PICTURE']);
			}
			
			// Подсчитываем количество товаров этого бренда
			$productsCount = 0;
			if ($request->get('with_products_count') === 'Y') {
				$productsCount = \CIBlockElement::GetList(
					[],
					[
						'IBLOCK_ID' => $this->iBlockId,
						'ACTIVE' => 'Y',
						'PROPERTY_BRAND_ELEMENT' => $fields['ID']
					],
					[]
				);
			}
			
			$brandData = [
				'id' => (int)$fields['ID'],
				'name' => $fields['NAME'],
				'code' => $fields['CODE'],
				'sort' => (int)$fields['SORT'],
				'preview_text' => $fields['PREVIEW_TEXT'],
				'detail_text' => $fields['DETAIL_TEXT'],
				'preview_picture' => $fields['PREVIEW_PICTURE'],
				'detail_picture' => $fields['DETAIL_PICTURE'],
				'date_create' => $fields['DATE_CREATE'],
				'date_modified' => $fields['TIMESTAMP_X'],
				'products_count' => $productsCount
			];
			
			// Добавляем свойства если требуется
			if ($request->get('with_properties') === 'Y') {
				$brandData['properties'] = $this->formatProperties($properties);
			}
			
			$brands[] = $brandData;
		}
		
		$response = [
			'meta' => [
				'action' => 'brands',
				'brands_iblock_id' => $this->brandsIBlockId,
				'total_count' => count($brands),
				'with_products_only' => $request->get('with_products') === 'Y',
				'with_products_count' => $request->get('with_products_count') === 'Y',
				'with_properties' => $request->get('with_properties') === 'Y',
				'search_applied' => !empty($search),
				'request_time' => date('Y-m-d H:i:s')
			],
			'data' => $brands
		];
		
		response()->json($response);
	}

	/**
	 * Получение списка ID брендов, у которых есть товары
	 */
	private function getBrandsWithProducts(): array
	{
		$brandIds = [];
		
		$res = \CIBlockElement::GetList(
			[],
			[
				'IBLOCK_ID' => $this->iBlockId,
				'ACTIVE' => 'Y',
				'!PROPERTY_BRAND_ELEMENT' => false
			],
			['PROPERTY_BRAND_ELEMENT'], // Группировка по бренду
			false,
			['PROPERTY_BRAND_ELEMENT']
		);
		
		while ($element = $res->GetNext()) {
			if ($element['PROPERTY_BRAND_ELEMENT_VALUE']) {
				$brandIds[] = (int)$element['PROPERTY_BRAND_ELEMENT_VALUE'];
			}
		}
		
		return array_unique($brandIds);
	}

	/**
	 * Форматирование изображения
	 */
	private function formatImage($imageId): ?array
	{
		if (!$imageId) {
			return null;
		}
		
		$file = \CFile::GetFileArray($imageId);
		if (!$file) {
			return null;
		}
		
		$request = request();
		$baseUrl = 'https://' . $_SERVER['HTTP_HOST'];
		
		$result = [
			'id' => (int)$file['ID'],
			'src' => $baseUrl . $file['SRC'],
			'width' => (int)$file['WIDTH'],
			'height' => (int)$file['HEIGHT'],
			'file_size' => (int)$file['FILE_SIZE'],
			'alt' => $file['ALT'] ?: '',
			'title' => $file['TITLE'] ?: ''
		];
		
		// Создаем ресайзы если указаны размеры
		if ($imageResize = $request->get('image_resize')) {
			$resizeParams = $this->parseImageResizeParams($imageResize);
			$resizedImage = \CFile::ResizeImageGet($imageId, $resizeParams);
			if ($resizedImage) {
				$result['resized'] = [
					'src' => $baseUrl . $resizedImage['src'],
					'width' => (int)$resizedImage['width'],
					'height' => (int)$resizedImage['height']
				];
			}
		}
		
		return $result;
	}

	/**
	 * Парсинг параметров ресайза изображений
	 */
	private function parseImageResizeParams(string $imageResize): array
	{
		// Формат: "300x300" или "300x300BX_RESIZE_IMAGE_PROPORTIONAL"
		$params = ['width' => 300, 'height' => 300];
		
		if (preg_match('/(\d+)x(\d+)/', $imageResize, $matches)) {
			$params['width'] = (int)$matches[1];
			$params['height'] = (int)$matches[2];
		}
		
		// Определяем тип ресайза
		if (strpos($imageResize, 'BX_RESIZE_IMAGE_EXACT') !== false) {
			$params['type'] = BX_RESIZE_IMAGE_EXACT;
		} else {
			$params['type'] = BX_RESIZE_IMAGE_PROPORTIONAL;
		}
		
		return $params;
	}
}
