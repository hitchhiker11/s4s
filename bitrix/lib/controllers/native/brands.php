<?php
namespace Artamonov\Rest\Controllers\Native;

use Bitrix\Main\{Loader, Context, Web\Json};
use CIBlockElement, CIBlockSection, CIBlock, CModule;

/**
 * Продвинутый контроллер для работы с брендами
 */
class Brands
{
    private int $iBlockId = 0;
    private ?int $sectionId = null;
    private bool $includeSubsections = false;
    private string $brandProperty = 'BREND';
    private bool $withProductCount = false;
    private bool $withProducts = false;
    private int $productsLimit = 10;
    private bool $activeOnly = true;
    private string $format = 'full';
    private array $sort = ['NAME' => 'ASC'];
    private bool $withBrandDetails = true;
    private bool $withSeo = false;
    private array $excludeFields = [];
    private array $fieldsOnly = [];

    public function __construct()
    {
        if (!config()->get('useNativeRoute')) {
            $this->errorResponse(403, 'Native routes disabled');
        }

        if (!CModule::IncludeModule('iblock')) {
            $this->errorResponse(500, 'IBlock module not installed');
        }
    }

    public function _get(): void
    {
        try {
            $this->parseRequest();
            $this->validateRequest();
            
            $brands = $this->getBrands();
            
            $response = [
                'meta' => [
                    'iblock_id' => $this->iBlockId,
                    'section_id' => $this->sectionId,
                    'brand_property' => $this->brandProperty,
                    'include_subsections' => $this->includeSubsections,
                    'format' => $this->format,
                    'total_brands' => count($brands),
                    'request_time' => date('Y-m-d H:i:s')
                ],
                'data' => $brands
            ];

            response()->json($response);

        } catch (\Exception $e) {
            \Bitrix\Main\Diag\Debug::writeToFile(
                [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                    'request_params' => request()->getInput()
                ],
                'Brands API Error',
                '/local/logs/rest_api.log'
            );
            
            $this->errorResponse(500, $e->getMessage());
        }
    }

    private function parseRequest(): void
    {
        $request = request();

        // Основные параметры
        $this->iBlockId = (int)$request->get('iblock_id');
        $this->sectionId = $request->get('section_id') ? (int)$request->get('section_id') : null;
        $this->includeSubsections = $request->get('include_subsections') === 'Y';
        $this->brandProperty = $request->get('brand_property') ?: 'BREND';
        $this->activeOnly = $request->get('active_only') !== 'N';
        
        // Расширенные параметры
        $this->withProductCount = $request->get('with_product_count') === 'Y';
        $this->withProducts = $request->get('with_products') === 'Y';
        $this->productsLimit = max(1, min((int)$request->get('products_limit') ?: 10, 100));
        $this->withBrandDetails = $request->get('with_brand_details') !== 'N';
        $this->withSeo = $request->get('with_seo') === 'Y';
        $this->format = $request->get('format') ?: 'full';
        
        // Фильтры полей
        if ($excludeFields = $request->get('exclude_fields')) {
            $this->excludeFields = is_array($excludeFields) ? $excludeFields : explode(',', $excludeFields);
        }
        
        if ($fieldsOnly = $request->get('fields_only')) {
            $this->fieldsOnly = is_array($fieldsOnly) ? $fieldsOnly : explode(',', $fieldsOnly);
        }
        
        // Сортировка
        if ($sort = $request->get('sort')) {
            $this->sort = $this->parseSortParam($sort);
        }
    }

    private function getBrands(): array
    {
        // Сначала получаем группированные данные по брендам
        $brandData = $this->getBrandDataFromElements();
        
        // Затем обогащаем информацией о самих брендах
        return $this->enrichBrandsData($brandData);
    }

    private function getBrandDataFromElements(): array
    {
        $filter = [
            'IBLOCK_ID' => $this->iBlockId,
            "!PROPERTY_{$this->brandProperty}" => false
        ];

        if ($this->activeOnly) {
            $filter['ACTIVE'] = 'Y';
        }

        if ($this->sectionId) {
            $filter['SECTION_ID'] = $this->sectionId;
            if ($this->includeSubsections) {
                $filter['INCLUDE_SUBSECTIONS'] = 'Y';
            }
        }

        $brandData = [];
        
        $res = CIBlockElement::GetList(
            [],
            $filter,
            false,
            false,
            ['ID', 'NAME', 'CODE', 'DETAIL_PAGE_URL', "PROPERTY_{$this->brandProperty}"]
        );

        while ($element = $res->GetNextElement()) {
            $fields = $element->GetFields();
            $properties = $element->GetProperties();
            
            $brandProp = $properties[$this->brandProperty];
            
            if (!$brandProp || !$brandProp['VALUE']) {
                continue;
            }

            $brandValue = $brandProp['VALUE'];
            $brandId = $brandProp['VALUE_ENUM_ID'] ?: $brandProp['VALUE'];
            
            if (!isset($brandData[$brandId])) {
                $brandData[$brandId] = [
                    'brand_id' => $brandId,
                    'brand_name' => $brandValue,
                    'brand_code' => $this->generateBrandCode($brandValue),
                    'product_count' => 0,
                    'products' => [],
                    'property_data' => $brandProp
                ];
            }
            
            $brandData[$brandId]['product_count']++;
            
            if ($this->withProducts && count($brandData[$brandId]['products']) < $this->productsLimit) {
                $brandData[$brandId]['products'][] = [
                    'id' => $fields['ID'],
                    'name' => $fields['NAME'],
                    'code' => $fields['CODE'],
                    'url' => $fields['DETAIL_PAGE_URL']
                ];
            }
        }

        return $brandData;
    }

    private function enrichBrandsData(array $brandData): array
    {
        $brands = [];
        
        foreach ($brandData as $data) {
            $brand = $this->formatBrand($data);
            $brands[] = $brand;
        }
        
        // Применяем сортировку
        $brands = $this->sortBrands($brands);
        
        return $brands;
    }

    private function formatBrand(array $data): array
    {
        if ($this->format === 'minimal') {
            return [
                'id' => $data['brand_id'],
                'name' => $data['brand_name']
            ];
        }
        
        $brand = [
            'id' => $data['brand_id'],
            'name' => $data['brand_name'],
            'code' => $data['brand_code']
        ];
        
        // Детальная информация о бренде
        if ($this->withBrandDetails && $this->format !== 'compact') {
            $brand['details'] = $this->getBrandDetails($data);
        }
        
        // Количество товаров
        if ($this->withProductCount) {
            $brand['product_count'] = $data['product_count'];
        }
        
        // Список товаров
        if ($this->withProducts) {
            $brand['products'] = $data['products'];
        }
        
        // SEO данные
        if ($this->withSeo) {
            $brand['seo'] = $this->getBrandSeo($data);
        }
        
        return $this->cleanBrandFields($brand);
    }

    private function getBrandDetails(array $data): array
    {
        $details = [];
        
        // Информация из свойства
        if ($propData = $data['property_data']) {
            $details['property_type'] = $propData['PROPERTY_TYPE'];
            $details['property_id'] = $propData['ID'];
            $details['sort'] = $propData['SORT'] ?? 500;
            
            if ($propData['PROPERTY_TYPE'] === 'L') {
                $details['enum_id'] = $propData['VALUE_ENUM_ID'];
                $details['enum_xml_id'] = $propData['VALUE_XML_ID'];
                $details['enum_sort'] = $propData['VALUE_SORT'];
            }
        }
        
        return $details;
    }

    private function getBrandSeo(array $data): array
    {
        return [
            'title' => $data['brand_name'],
            'description' => "Товары бренда {$data['brand_name']}",
            'keywords' => $data['brand_name'],
            'h1' => $data['brand_name']
        ];
    }

    private function generateBrandCode(string $brandName): string
    {
        $code = strtolower($brandName);
        $code = preg_replace('/[^a-z0-9\-_]/', '', $code);
        $code = preg_replace('/[\-_]+/', '-', $code);
        return trim($code, '-');
    }

    private function sortBrands(array $brands): array
    {
        if (empty($this->sort)) {
            return $brands;
        }
        
        usort($brands, function($a, $b) {
            foreach ($this->sort as $field => $order) {
                $aValue = $a[$field] ?? '';
                $bValue = $b[$field] ?? '';
                
                $result = $order === 'DESC' ? 
                    strcmp($bValue, $aValue) : 
                    strcmp($aValue, $bValue);
                
                if ($result !== 0) {
                    return $result;
                }
            }
            return 0;
        });
        
        return $brands;
    }

    private function cleanBrandFields(array $brand): array
    {
        // Применяем исключения
        if (!empty($this->excludeFields)) {
            foreach ($this->excludeFields as $field) {
                unset($brand[$field]);
            }
        }
        
        // Применяем фильтр "только указанные поля"
        if (!empty($this->fieldsOnly)) {
            $brand = array_intersect_key($brand, array_flip($this->fieldsOnly));
        }
        
        return $brand;
    }

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
    }

    private function errorResponse(int $code, string $message): void
    {
        response()
            ->json(['error' => $message], $code)
            ->send();
        exit;
    }
}
