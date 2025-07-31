<?php
namespace Artamonov\Rest\Controllers\Native;

use Artamonov\Rest\Controllers\Native\Base\BasketBase;

/**
 * Контроллер для работы с корзиной неавторизованных пользователей
 */
class Basket extends BasketBase
{
    /**
     * GET - получение содержимого корзины или проверка наличия товара
     */
    public function _get(): void
    {
        try {
            $request = request();
            $action = $request->get('action', 'get_basket');
            
            // Добавляем отладочную информацию
            $this->addDebugLog('GET request received', [
                'action' => $action,
                'product_id' => $request->get('product_id'),
                'quantity' => $request->get('quantity'),
                'uri' => $_SERVER['REQUEST_URI'] ?? '',
                'method' => $_SERVER['REQUEST_METHOD'] ?? ''
            ]);
            
            // Проверяем тип действия
            if ($action === 'check_stock') {
                $this->addDebugLog('Routing to stock check');
                $this->handleStockCheck($request);
                return;
            }
            
            // Обычная логика получения корзины
            $format = $request->get('format', 'full');

            $basket = $this->loadBasket();
            $items = $this->getAllBasketItems();
            $summary = $this->getBasketSummary();

            $response = [
                'meta' => [
                    'fuser_id' => $this->fuserId,
                    'is_fuser_from_request' => $this->isFuserFromRequest,
                    'site_id' => $this->siteId,
                    'format' => $format,
                    'request_time' => date('Y-m-d H:i:s')
                ],
                'basket' => [
                    'items' => $items,
                    'summary' => $summary
                ],
                'debug_log' => $this->getDebugLog()
            ];

            // Добавляем временные данные пользователя если есть
            if (!empty($this->tempUserData)) {
                $response['temp_user_data'] = $this->tempUserData;
            }

            response()->json($response);

        } catch (\Exception $e) {
            $this->logError($e);
            $this->errorResponse(500, $e->getMessage());
        }
    }

    /**
     * Обработка запроса проверки наличия товара
     */
    private function handleStockCheck($request): void
    {
        $this->addDebugLog('Stock check started');
        
        // Валидация входных данных
        $productId = (int)$request->get('product_id');
        $quantity = (int)$request->get('quantity');

        $this->addDebugLog('Stock check params', [
            'product_id' => $productId,
            'quantity' => $quantity
        ]);

        if ($productId <= 0) {
            response()->json([
                'success' => false,
                'available' => false,
                'available_quantity' => 0,
                'requested_quantity' => $quantity,
                'error' => 'Invalid product_id parameter'
            ], 400);
            return;
        }

        if ($quantity <= 0) {
            response()->json([
                'success' => false,
                'available' => false,
                'available_quantity' => 0,
                'requested_quantity' => $quantity,
                'error' => 'Invalid quantity parameter'
            ], 400);
            return;
        }

        // Проверяем наличие товара
        $availability = $this->checkProductAvailability($productId, $quantity);

        $this->addDebugLog('Availability check result', $availability);

        // Формируем единообразный ответ для всех случаев
        $response = [
            'success' => $availability['available'],
            'available' => $availability['available'],
            'available_quantity' => $availability['available_quantity'] ?? 0,
            'requested_quantity' => $quantity
        ];

        // Добавляем ошибку только если товар недоступен
        if (!$availability['available']) {
            $response['error'] = $availability['error'] ?? 'Insufficient stock';
        }

        response()->json($response);
    }

    /**
     * POST - добавление товара в корзину
     */
    public function _post(): void
    {
        try {
            $request = request();
            
            // Добавляем отладочную информацию
            $this->addDebugLog('POST request received', [
                'product_id' => $request->get('product_id'),
                'quantity' => $request->get('quantity'),
                'uri' => $_SERVER['REQUEST_URI'] ?? '',
                'method' => $_SERVER['REQUEST_METHOD'] ?? ''
            ]);
            
            // Валидация входных данных
            $productId = (int)$request->get('product_id');
            $quantity = (float)$request->get('quantity', 1);
            $properties = $request->get('properties', []); // Убеждаемся что это массив
            
            // Если properties не массив, делаем пустым массивом
            if (!is_array($properties)) {
                $properties = [];
            }

            if ($productId <= 0) {
                $this->errorResponse(400, 'Invalid product_id');
            }

            if ($quantity <= 0) {
                $this->errorResponse(400, 'Invalid quantity');
            }

            // Добавляем товар в корзину
            $result = $this->addProductToBasket($productId, $quantity, $properties);

            if (!$result['success']) {
                response()->json($result, 400);
                return;
            }

            response()->json([
                'success' => true,
                'message' => $result['action'] === 'added' ? 'Товар добавлен в корзину' : 'Количество товара увеличено',
                'data' => $result,
                'fuser_id' => $this->fuserId,
                'debug_log' => $this->getDebugLog()
            ]);

        } catch (\Exception $e) {
            $this->logError($e);
            $this->errorResponse(500, $e->getMessage());
        }
    }

    /**
     * PATCH - обновление товара в корзине
     */
    public function _patch(): void
    {
        try {
            $request = request();
            
            $basketItemId = (int)$request->get('basket_item_id');
            $quantity = (float)$request->get('quantity');

            if ($basketItemId <= 0) {
                $this->errorResponse(400, 'Invalid basket_item_id');
            }

            if ($quantity < 0) {
                $this->errorResponse(400, 'Invalid quantity');
            }

            // Проверяем что FUSER_ID передан для операций обновления
            if (!$this->isFuserFromRequest && $this->providedFuserId === null) {
                $this->errorResponse(400, 'fuser_id is required for basket updates');
            }

            $result = $this->updateBasketItemQuantity($basketItemId, $quantity);

            if (!$result['success']) {
                response()->json($result, 400);
                return;
            }

            response()->json([
                'success' => true,
                'message' => $quantity > 0 ? 'Количество товара обновлено' : 'Товар удален из корзины',
                'data' => $result,
                'fuser_id' => $this->fuserId,
                'debug_log' => $this->getDebugLog()
            ]);

        } catch (\Exception $e) {
            $this->logError($e);
            $this->errorResponse(500, $e->getMessage());
        }
    }

    /**
     * DELETE - удаление товара из корзины или очистка корзины
     */
    public function _delete(): void
    {
        try {
            $request = request();
            $basketItemId = (int)$request->get('basket_item_id');
            $clearAll = $request->get('clear_all') === 'Y';

            // Проверяем что FUSER_ID передан для операций удаления
            if (!$this->isFuserFromRequest && $this->providedFuserId === null) {
                $this->errorResponse(400, 'fuser_id is required for basket operations');
            }

            if ($clearAll) {
                $result = $this->clearBasket();
                
                if (!$result['success']) {
                    response()->json($result, 400);
                    return;
                }

                response()->json([
                    'success' => true,
                    'message' => 'Корзина очищена',
                    'fuser_id' => $this->fuserId,
                    'debug_log' => $this->getDebugLog()
                ]);
                return;
            }

            if ($basketItemId <= 0) {
                $this->errorResponse(400, 'Invalid basket_item_id');
            }

            $result = $this->removeProductFromBasket($basketItemId);

            if (!$result['success']) {
                response()->json($result, 400);
                return;
            }

            response()->json([
                'success' => true,
                'message' => 'Товар удален из корзины',
                'data' => $result,
                'fuser_id' => $this->fuserId,
                'debug_log' => $this->getDebugLog()
            ]);

        } catch (\Exception $e) {
            $this->logError($e);
            $this->errorResponse(500, $e->getMessage());
        }
    }

    private function logError(\Exception $e): void
    {
        $this->addDebugLog('Exception occurred', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'fuser_id' => $this->fuserId,
            'provided_fuser_id' => $this->providedFuserId,
            'is_from_request' => $this->isFuserFromRequest
        ]);
    }
}