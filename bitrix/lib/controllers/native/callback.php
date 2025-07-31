<?php
namespace Artamonov\Rest\Controllers\Native;

use Bitrix\Main\Loader;
use Bitrix\Main\Web\Json;
use Bitrix\Main\Context;
use CIBlockElement;
use CIBlock;

class Callback
{
    /** @var int ID инфоблока по умолчанию */
    private $iBlockId = 23;

    public function __construct()
    {
        if (!Loader::includeModule('iblock')) {
            $this->errorResponse(500, 'Модуль iblock не доступен');
        }
    }

    /**
     * POST /api/callback
     * -- ожидает JSON в теле:
     * {
     *   "iblock_id": 4,                  // необязательно, по умолчанию 4
     *   "fields": {
     *     "first_name": "Иван",
     *     "last_name": "Иванов",
     *     "phone_number": "+79991234567",
     *     // … любые другие свойства, существующие в этом инфоблоке
     *   }
     * }
     */
    public function create(): void
    {
        try {
            $request = Context::getCurrent()->getRequest();

            // 1) Берём «сырое» тело JSON:
            $rawBody = $request->getInput();
            if (empty($rawBody)) {
                throw new \Exception('Тело запроса пустое или не JSON');
            }

            // 2) Парсим JSON в массив:
            try {
                $data = Json::decode($rawBody);
            } catch (\Exception $e) {
                throw new \Exception('Невалидный JSON: ' . $e->getMessage());
            }
            if (!is_array($data)) {
                throw new \Exception('Ожидается JSON-объект');
            }

            // 3) Определяем iblock_id (если не передали, остаётся 23)
            if (isset($data['iblock_id'])) {
                $this->iBlockId = (int)$data['iblock_id'];
            }
            $this->validateIBlock();

            // 4) Берём ассоциативный массив свойств “fields”
            if (
                !isset($data['fields'])
                || !is_array($data['fields'])
                || empty($data['fields'])
            ) {
                throw new \Exception('Параметр "fields" обязателен и должен быть непустым массивом');
            }
            $fields = $data['fields'];

            // 5) Проверяем «минимальный набор» обязательных свойств.
            //    У вас в инфоблоке настроены как обязательные first_name и phone_number:
            if (!isset($fields['first_name']) || !isset($fields['phone_number'])) {
                throw new \Exception('Не переданы обязательные поля формы: first_name и phone_number');
            }
            // Простая валидация first_name:
            if (mb_strlen((string)$fields['first_name']) < 1) {
                throw new \Exception('Неверное значение для first_name');
            }
            // Проверка формата телефона («+7XXXXXXXXXX»):
            if (!preg_match('/^\+7\d{10}$/', (string)$fields['phone_number'])) {
                throw new \Exception('Некорректный формат phone_number (должен быть +7XXXXXXXXXX)');
            }

            // 6) Готовим массив для CIBlockElement::Add
            $elementFields = [
                'IBLOCK_ID'       => $this->iBlockId,
                'ACTIVE'          => 'Y',
                'NAME'            => 'Заявка от ' . $fields['first_name'],
                'PROPERTY_VALUES' => $fields,
            ];

            $el    = new CIBlockElement();
            $newId = $el->Add($elementFields);
            if (!$newId) {
                // Если Add() вернул false, в $el->LAST_ERROR лежит текст ошибки
                throw new \Exception((string)$el->LAST_ERROR);
            }

            // Успешно создали элемент
            $this->jsonResponse([
                'success' => true,
                'id'      => $newId,
                'message' => 'Заявка успешно создана',
            ]);

        } catch (\Exception $e) {
            $this->errorResponse(400, $e->getMessage());
        }
    }

    /**
     * GET /api/callback
     * – просто возвращаем список элементов (заявок) из указанного инфоблока
     *   (включая любые свойства каждого элемента).
     * Параметры в URL: ?iblock_id=4&limit=10&page=1&sort=ID:DESC
     */
    public function list(): void
    {
        try {
            $request = Context::getCurrent()->getRequest();

            // Берём iblock_id из GET (если не передали, остаётся 23)
            $this->iBlockId = isset($_GET['iblock_id'])
                ? (int)$_GET['iblock_id']
                : $this->iBlockId;
            $this->validateIBlock();

            // Параметры пагинации:
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
            $page  = isset($_GET['page'])  ? (int)$_GET['page']  : 1;
            if ($limit < 1)   $limit = 10;
            if ($limit > 100) $limit = 100;
            if ($page < 1)    $page  = 1;

            $navParams = [
                'nPageSize' => $limit,
                'iNumPage'  => $page,
            ];

            // Сортировка “FIELD:asc|desc”
            $sortParam = isset($_GET['sort'])
                ? (string)$_GET['sort']
                : 'ID:DESC';
            $parts     = explode(':', $sortParam);
            $sortField = mb_strtoupper($parts[0]) ?: 'ID';
            $sortOrder = (
                isset($parts[1])
                && mb_strtolower($parts[1]) === 'asc'
            ) ? 'ASC' : 'DESC';
            $order = [ $sortField => $sortOrder ];

            $filter = [
                'IBLOCK_ID'         => $this->iBlockId,
                'CHECK_PERMISSIONS' => 'N',
            ];

            // Получаем элементы (GetNextElement — чтобы сразу читать свойства)
            $dbRes = CIBlockElement::GetList(
                $order,
                $filter,
                false,
                $navParams,
                ['ID', 'IBLOCK_ID', 'NAME', 'DATE_CREATE']
            );

            $items = [];
            while ($elObj = $dbRes->GetNextElement()) {
                $f = $elObj->GetFields();
                $p = $elObj->GetProperties();

                // Собираем “плоский” массив свойств
                $propsSimple = [];
                foreach ($p as $code => $prop) {
                    $propsSimple[$code] = $prop['VALUE'];
                }

                $items[] = [
                    'fields'     => [
                        'id'          => (int)$f['ID'],
                        'name'        => $f['NAME'],
                        'date_create' => $f['DATE_CREATE'],
                    ],
                    'properties' => $propsSimple,
                ];
            }

            $meta = [
                'total' => (int)$dbRes->NavRecordCount,
                'page'  => $page,
                'limit' => $limit,
                'pages' => (int)ceil($dbRes->NavRecordCount / $limit),
            ];

            $this->jsonResponse([
                'success' => true,
                'meta'    => $meta,
                'data'    => $items,
            ]);

        } catch (\Exception $e) {
            $this->errorResponse(400, $e->getMessage());
        }
    }

    /**
     * Проверяет, что инфоблок существует, иначе выбрасывает исключение
     * @throws \Exception
     */
    private function validateIBlock(): void
    {
        if (!CIBlock::GetByID($this->iBlockId)->Fetch()) {
            throw new \Exception("Инфоблок с ID={$this->iBlockId} не найден");
        }
    }

    /**
     * Утилита: отдаёт JSON-ответ и завершает скрипт
     * @param array $data
     * @param int   $status
     */
    private function jsonResponse(array $data, int $status = 200): void
    {
        header('Content-Type: application/json');
        http_response_code($status);
        echo Json::encode($data);
        exit;
    }

    /**
     * Утилита: отдаёт JSON-ошибку и завершает скрипт
     * @param int    $code
     * @param string $message
     */
    private function errorResponse(int $code, string $message): void
    {
        $this->jsonResponse([
            'success' => false,
            'error'   => [
                'code'    => $code,
                'message' => $message,
            ],
        ], $code);
    }
}
