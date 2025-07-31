 <?php

namespace Artamonov\Rest\Controllers\Native;

use Artamonov\Rest\Controllers\Native\Base\BasketBase;
use Bitrix\Main\Loader;
use Bitrix\Main\Context;
use Bitrix\Main\Application;
use Bitrix\Main\Web\Json;
use Bitrix\Currency\CurrencyManager;
use Bitrix\Sale\Order;
use Bitrix\Sale\Basket;
use Bitrix\Sale\Delivery;
use Bitrix\Sale\PaySystem;
use Bitrix\Sale\Location\LocationTable;
use Bitrix\Catalog\ProductTable;
use CModule;

/**
 * Контроллер для создания заказов на основе корзины
 */
class OrderNew extends BasketBase
{
    private int $personTypeId = 1; // ID типа плательщика (физлицо)
    private string $currencyCode = 'RUB';
    private array $requestData = [];
    private ?int $userId = null;
    private array $basketItems = [];

    public function __construct()
    {
        parent::__construct();
        
        global $USER;
        $this->userId = $USER->isAuthorized() ? $USER->GetID() : null;
        $this->currencyCode = CurrencyManager::getBaseCurrency();
    }

    /**
     * GET - получение информации о заказе
     */
    public function _get(): void
    {
        try {
            $request = request();
            $action = $request->get('action', 'get_status');
            
            $this->addDebugLog('GET request received', [
                'action' => $action,
                'order_id' => $request->get('order_id'),
                'uri' => $_SERVER['REQUEST_URI'] ?? '',
                'method' => $_SERVER['REQUEST_METHOD'] ?? ''
            ]);
            
            if ($action === 'get_payment_form') {
                $this->handleGetPaymentForm($request);
                return;
            }
            
            // По умолчанию получаем статус заказа
            $this->handleGetStatus($request);

        } catch (\Exception $e) {
            $this->logError($e);
            $this->errorResponse(500, $e->getMessage());
        }
    }

    /**
     * POST - создание нового заказа из корзины
     */
    public function _post(): void
    {
        try {
            $request = request();
            
            $this->addDebugLog('POST request received', [
                'fuser_id' => $request->get('fuser_id'),
                'customer_name' => $request->get('customer_name'),
                'customer_phone' => $request->get('customer_phone'),
                'uri' => $_SERVER['REQUEST_URI'] ?? '',
                'method' => $_SERVER['REQUEST_METHOD'] ?? ''
            ]);
            
            $this->parseCreateRequest($request);
            $this->loadBasketItems();
            $this->validateBasketItems();
            
            $order = $this->createOrder();
            $this->setupOrderBasketFromUserBasket($order);
            $this->setupOrderDelivery($order);
            $this->setupOrderPayment($order);
            $this->setupOrderProperties($order);
            
            // Сохраняем заказ
            $order->doFinalAction(true);
            $result = $order->save();
            
            if (!$result->isSuccess()) {
                $this->errorResponse(400, 'Ошибка создания заказа: ' . implode(', ', $result->getErrorMessages()));
            }

            $orderId = $order->getId();
            
            // Очищаем корзину пользователя если требуется
            if ($this->requestData['clear_basket'] === 'Y') {
                $this->clearUserBasket();
            }
            
            // Получаем ссылку на оплату для email
            $paymentUrl = $this->generatePaymentUrl($orderId);
            
            // Формируем ответ
            $response = [
                'success' => true,
                'data' => [
                    'order_id' => $orderId,
                    'order_number' => $order->getField('ACCOUNT_NUMBER'),
                    'total_price' => $order->getPrice(),
                    'currency' => $order->getCurrency(),
                    'status' => 'created',
                    'payment_required' => !$order->isPaid(),
                    'items_count' => count($this->basketItems),
                    'basket_cleared' => $this->requestData['clear_basket'] === 'Y',
                    'payment_url' => $paymentUrl
                ],
                'message' => 'Заказ успешно создан из корзины',
                'debug_log' => $this->getDebugLog()
            ];

            response()->json($response, 201);

        } catch (\Exception $e) {
            $this->logError($e);
            $this->errorResponse(500, $e->getMessage());
        }
    }

    /**
     * Обработка получения статуса заказа
     */
    private function handleGetStatus($request): void
    {
        $orderId = (int)$request->get('order_id');
        
        if ($orderId <= 0) {
            $this->errorResponse(400, 'Некорректный ID заказа');
        }

        $order = Order::load($orderId);
        if (!$order) {
            $this->errorResponse(404, 'Заказ не найден');
        }

        $response = [
            'success' => true,
            'data' => [
                'order_id' => $order->getId(),
                'order_number' => $order->getField('ACCOUNT_NUMBER'),
                'status' => $this->getOrderStatus($order),
                'total_price' => $order->getPrice(),
                'paid_sum' => $order->getSumPaid(),
                'currency' => $order->getCurrency(),
                'is_paid' => $order->isPaid(),
                'is_canceled' => $order->isCanceled(),
                'is_shipped' => $order->isShipped(),
                'date_created' => $order->getDateInsert()->format('Y-m-d H:i:s')
            ],
            'debug_log' => $this->getDebugLog()
        ];

        response()->json($response);
    }

    /**
     * Обработка получения формы оплаты
     */
    private function handleGetPaymentForm($request): void
    {
        $orderId = (int)$request->get('order_id');
        
        if ($orderId <= 0) {
            $this->errorResponse(400, 'Некорректный ID заказа');
        }

        $order = Order::load($orderId);
        if (!$order) {
            $this->errorResponse(404, 'Заказ не найден');
        }

        if ($order->isPaid()) {
            $this->errorResponse(400, 'Заказ уже оплачен');
        }

        // Добавляем общую информацию о заказе
        $this->addDebugLog('Order basic info', [
            'id' => $order->getId(),
            'account_number' => $order->getField('ACCOUNT_NUMBER'),
            'price' => $order->getPrice(),
            'currency' => $order->getCurrency(),
            'is_paid' => $order->isPaid(),
            'is_canceled' => $order->isCanceled(),
            'is_allow_pay' => $order->isAllowPay(),
            'status_id' => $order->getField('STATUS_ID'),
            'user_id' => $order->getField('USER_ID')
        ]);

        // Проверяем разрешена ли оплата заказа
        if (!$order->isAllowPay()) {
            $this->errorResponse(400, 'Оплата заказа не разрешена');
        }

        $paymentCollection = $order->getPaymentCollection();
        $payment = null;
        
        // Добавляем отладочную информацию о платежах
        $this->addDebugLog('Payment collection analysis', [
            'payments_count' => $paymentCollection->count(),
            'order_total' => $order->getPrice(),
            'order_paid_sum' => $order->getSumPaid()
        ]);
        
        $paymentDetails = [];
        foreach ($paymentCollection as $paymentItem) {
            $paymentDetails[] = [
                'id' => $paymentItem->getId(),
                'payment_system_id' => $paymentItem->getPaymentSystemId(),
                'sum' => $paymentItem->getSum(),
                'is_paid' => $paymentItem->isPaid(),
                'payment_system_name' => $paymentItem->getPaymentSystemName()
            ];
            
            // Ищем неоплаченный платеж (убираем проверку payment_system_id > 0)
            if (!$paymentItem->isPaid()) {
                $payment = $paymentItem;
                // Не прерываем цикл, чтобы собрать всю отладочную информацию
            }
        }
        
        $this->addDebugLog('Payment details', $paymentDetails);

        // Если платежей нет вообще, создаем платеж
        if ($paymentCollection->count() === 0) {
            $this->addDebugLog('No payments found, creating payment');
            
            try {
                $payment = $paymentCollection->createItem();
                $paySystemService = PaySystem\Manager::getObjectById(3); // Робокасса по умолчанию
                
                if (!$paySystemService) {
                    $this->errorResponse(400, 'Платежная система с ID 3 (Робокасса) не найдена');
                }
                
                $payment->setFields([
                    'PAY_SYSTEM_ID' => $paySystemService->getField("PAY_SYSTEM_ID"),
                    'PAY_SYSTEM_NAME' => $paySystemService->getField("NAME"),
                    'SUM' => $order->getPrice()
                ]);
                
                $order->save();
                
                $this->addDebugLog('Payment created', [
                    'payment_id' => $payment->getId(),
                    'payment_system_id' => $payment->getPaymentSystemId(),
                    'sum' => $payment->getSum()
                ]);
                
            } catch (\Exception $e) {
                $this->addDebugLog('Failed to create payment', [
                    'error' => $e->getMessage()
                ]);
                $this->errorResponse(500, 'Ошибка создания платежа: ' . $e->getMessage());
            }
        }

        if (!$payment) {
            $this->errorResponse(404, 'Неоплаченная оплата не найдена. Проверьте отладочную информацию.');
        }

        // Получаем обработчик платежной системы
        $paymentSystemId = $payment->getPaymentSystemId();
        
        $this->addDebugLog('Payment system check', [
            'payment_system_id' => $paymentSystemId,
            'inner_pay_system_id' => PaySystem\Manager::getInnerPaySystemId()
        ]);
        
        // Проверяем, что это не внутренняя платежная система
        if ($paymentSystemId == PaySystem\Manager::getInnerPaySystemId()) {
            $this->errorResponse(400, 'Внутренняя платежная система не поддерживает внешние формы оплаты');
        }
        
        $paySystemService = PaySystem\Manager::getObjectById($paymentSystemId);
        if (!$paySystemService) {
            $this->errorResponse(400, 'Платежная система не найдена (ID: ' . $paymentSystemId . ')');
        }

        $context = Application::getInstance()->getContext();
        $paymentForm = '';
        $directPaymentUrl = '';

        // Добавляем информацию о платежной системе
        // Получаем все настройки платежной системы для диагностики
        $paySystemSettings = [];
        try {
            // Получаем настройки через правильный вызов с параметром Payment
            $settings = $paySystemService->getParamsBusValue($payment);
            foreach ($settings as $key => $value) {
                // Скрываем пароли в логах, но показываем что они есть
                if (strpos(strtolower($key), 'password') !== false || strpos(strtolower($key), 'shoppassword') !== false) {
                    $paySystemSettings[$key] = !empty($value) ? '[HIDDEN - LENGTH: ' . strlen($value) . ']' : '[EMPTY]';
                } else {
                    $paySystemSettings[$key] = $value;
                }
            }
        } catch (\Exception $e) {
            $paySystemSettings['settings_error'] = 'Не удалось получить настройки: ' . $e->getMessage();
        }
        
        $this->addDebugLog('Payment system info', [
            'id' => $paySystemService->getField('ID'),
            'name' => $paySystemService->getField('NAME'),
            'new_window' => $paySystemService->getField('NEW_WINDOW'),
            'active' => $paySystemService->getField('ACTIVE'),
            'sort' => $paySystemService->getField('SORT'),
            'class_name' => get_class($paySystemService),
            'settings' => $paySystemSettings
        ]);

        try {
            // Получаем форму оплаты или прямую ссылку
            if ($paySystemService->getField('NEW_WINDOW') === 'N') {
                
                $this->addDebugLog('Initiating form payment (NEW_WINDOW=N)');
                
                // Форма оплаты для отображения на сайте
                $initResult = $paySystemService->initiatePay(
                    $payment, 
                    $context->getRequest(), 
                    PaySystem\BaseServiceHandler::STRING
                );
                
                if ($initResult->isSuccess()) {
                    $paymentForm = $initResult->getTemplate();
                    
                    // ИСПРАВЛЯЕМ ПАРАМЕТРЫ ФОРМЫ РОБОКАССЫ
                    $paymentForm = $this->fixRobokassaFormParameters($paymentForm);
                    
                    $this->addDebugLog('Form payment initiated successfully', [
                        'template_length' => strlen($paymentForm)
                    ]);
                } else {
                    $errors = $initResult->getErrorMessages();
                    $this->addDebugLog('Form payment initiation failed', [
                        'errors' => $errors
                    ]);
                    $this->errorResponse(400, 'Ошибка получения формы оплаты: ' . implode(', ', $errors));
                }
            } else {
                
                $this->addDebugLog('Initiating direct payment (NEW_WINDOW=Y)');
                
                // Прямая ссылка для перенаправления
                $initResult = $paySystemService->initiatePay(
                    $payment, 
                    $context->getRequest(), 
                    PaySystem\BaseServiceHandler::CURL
                );
                
                if ($initResult->isSuccess()) {
                    $directPaymentUrl = $initResult->getTemplate();
                    
                    // ИСПРАВЛЯЕМ ПАРАМЕТРЫ ССЫЛКИ РОБОКАССЫ
                    $directPaymentUrl = $this->fixRobokassaUrlParameters($directPaymentUrl);
                    
                    $this->addDebugLog('Direct payment initiated successfully', [
                        'url_length' => strlen($directPaymentUrl),
                        'url_preview' => substr($directPaymentUrl, 0, 100) . '...'
                    ]);
                } else {
                    $errors = $initResult->getErrorMessages();
                    $this->addDebugLog('Direct payment initiation failed', [
                        'errors' => $errors
                    ]);
                    $this->errorResponse(400, 'Ошибка получения ссылки оплаты: ' . implode(', ', $errors));
                }
            }

        } catch (\Exception $e) {
            $this->addDebugLog('Payment initiation error', [
                'error' => $e->getMessage(),
                'payment_system_id' => $payment->getPaymentSystemId(),
                'trace' => $e->getTraceAsString()
            ]);
            $this->errorResponse(500, 'Ошибка инициализации оплаты: ' . $e->getMessage());
        }

        $response = [
            'success' => true,
            'data' => [
                'order_id' => $orderId,
                'payment_id' => $payment->getId(),
                'payment_system' => $payment->getPaymentSystemName(),
                'payment_system_id' => $payment->getPaymentSystemId(),
                'amount' => $payment->getSum(),
                'currency' => $order->getCurrency(),
                'payment_form' => $paymentForm,
                'direct_payment_url' => $directPaymentUrl,
                'new_window' => $paySystemService->getField('NEW_WINDOW') === 'Y'
            ],
            'debug_log' => $this->getDebugLog()
        ];

        response()->json($response);
    }

    /**
     * Парсинг запроса на создание заказа
     */
    private function parseCreateRequest($request): void
    {
        // Получаем fuser_id из запроса и устанавливаем его
        $requestFuserId = (int)$request->get('fuser_id');
        if ($requestFuserId <= 0) {
            $this->errorResponse(400, 'FUSER_ID обязателен для создания заказа');
        }

        // Устанавливаем fuser_id из запроса
        $this->providedFuserId = $requestFuserId;
        $this->isFuserFromRequest = true;
        $this->fuserId = $requestFuserId;

        $this->addDebugLog('Using FUSER_ID from request', [
            'fuser_id' => $this->fuserId,
            'provided_fuser_id' => $this->providedFuserId
        ]);

        $this->requestData = [
            'fuser_id' => $this->fuserId,
            'customer' => [
                'name' => trim($request->get('customer_name', '')),
                'lastname' => trim($request->get('customer_lastname', '')),
                'middlename' => trim($request->get('customer_middlename', '')),
                'phone' => trim($request->get('customer_phone', '')),
                'email' => trim($request->get('customer_email', ''))
            ],
            'delivery' => [
                'cdek_code' => trim($request->get('cdek_code', '')),
                'address' => trim($request->get('delivery_address', ''))
            ],
            'payment_system_id' => (int)$request->get('payment_system_id'),
            'comment' => trim($request->get('comment', '')),
            'clear_basket' => $request->get('clear_basket', 'Y') === 'Y' ? 'Y' : 'N'
        ];

        // Валидация обязательных полей
        if (empty($this->requestData['customer']['name'])) {
            $this->errorResponse(400, 'Имя покупателя обязательно');
        }

        if (empty($this->requestData['customer']['lastname'])) {
            $this->errorResponse(400, 'Фамилия покупателя обязательна');
        }

        if (empty($this->requestData['customer']['phone'])) {
            $this->errorResponse(400, 'Телефон покупателя обязателен');
        }

        if (empty($this->requestData['customer']['email'])) {
            $this->errorResponse(400, 'Email покупателя обязателен');
        }

        if (empty($this->requestData['delivery']['cdek_code'])) {
            $this->errorResponse(400, 'Код ПВЗ СДЭК обязателен');
        }

        if (empty($this->requestData['delivery']['address'])) {
            $this->errorResponse(400, 'Адрес доставки обязателен');
        }

        if ($this->requestData['payment_system_id'] <= 0) {
            $this->requestData['payment_system_id'] = 3; // Робокасса по умолчанию
        }
    }

    /**
     * Загрузка товаров из корзины пользователя
     */
    private function loadBasketItems(): void
    {
        $this->addDebugLog('Loading basket items for FUSER_ID', ['fuser_id' => $this->fuserId]);

        // Загружаем товары из корзины через SQL (как в BasketBase)
        $sql = "SELECT * FROM b_sale_basket WHERE FUSER_ID = " . intval($this->fuserId) . " AND LID = '" . $this->siteId . "' AND (ORDER_ID IS NULL OR ORDER_ID = 0)";
        $result = \Bitrix\Main\Application::getConnection()->query($sql);
        
        $this->basketItems = [];
        while ($row = $result->fetch()) {
            $this->basketItems[] = [
                'id' => (int)$row['ID'],
                'product_id' => (int)$row['PRODUCT_ID'],
                'name' => $row['NAME'],
                'price' => (float)$row['PRICE'],
                'quantity' => (int)$row['QUANTITY'],
                'currency' => $row['CURRENCY'],
                'weight' => (float)($row['WEIGHT'] ?? 0),
                'properties' => $this->getBasketItemPropertiesViaSql($row['ID'])
            ];
        }

        $this->addDebugLog('Loaded basket items', [
            'count' => count($this->basketItems),
            'items' => array_map(function($item) {
                return [
                    'id' => $item['id'],
                    'product_id' => $item['product_id'],
                    'name' => $item['name'],
                    'quantity' => $item['quantity']
                ];
            }, $this->basketItems)
        ]);
    }

    /**
     * Валидация товаров в корзине
     */
    private function validateBasketItems(): void
    {
        if (empty($this->basketItems)) {
            $this->errorResponse(400, 'Корзина пользователя пуста');
        }

        // Проверяем наличие каждого товара
        foreach ($this->basketItems as $item) {
            $availability = $this->checkProductAvailability($item['product_id'], $item['quantity']);
            if (!$availability['available']) {
                $this->errorResponse(400, "Товар \"{$item['name']}\" недоступен: " . $availability['error']);
            }
        }

        $this->addDebugLog('All basket items validated successfully');
    }

    /**
     * Создание заказа (упрощенная версия)
     */
    private function createOrder(): Order
    {
        // Если пользователь не авторизован, используем ID 1 (обычно администратор)
        if (!$this->userId) {
            $this->userId = 1;
        }
        
        $order = Order::create($this->siteId, $this->userId);
        $order->setPersonTypeId($this->personTypeId);
        $order->setField('CURRENCY', $this->currencyCode);
        
        if (!empty($this->requestData['comment'])) {
            $order->setField('USER_DESCRIPTION', $this->requestData['comment']);
        }

        $this->addDebugLog('Order created', [
            'site_id' => $this->siteId,
            'user_id' => $this->userId,
            'person_type_id' => $this->personTypeId
        ]);

        return $order;
    }

    /**
     * Получение или создание анонимного пользователя
     */
    private function getOrCreateAnonymousUser(): int
    {
        // Проверяем, есть ли уже анонимный пользователь с таким email
        $email = $this->requestData['customer']['email'];
        
        $userResult = \CUser::GetList(
            [],
            ['EMAIL' => $email, 'ACTIVE' => 'Y'],
            ['ID', 'EMAIL', 'NAME', 'LAST_NAME']
        );
        
        if ($existingUser = $userResult->Fetch()) {
            $this->addDebugLog('Found existing user by email', [
                'user_id' => $existingUser['ID'],
                'email' => $email
            ]);
            return (int)$existingUser['ID'];
        }
        
        // Создаем нового анонимного пользователя
        $user = new \CUser();
        $userData = [
            'EMAIL' => $email,
            'LOGIN' => 'anon_' . time() . '_' . rand(1000, 9999),
            'NAME' => $this->requestData['customer']['name'],
            'LAST_NAME' => $this->requestData['customer']['lastname'],
            'SECOND_NAME' => $this->requestData['customer']['middlename'],
            'PERSONAL_PHONE' => $this->requestData['customer']['phone'],
            'ACTIVE' => 'Y',
            'GROUP_ID' => [2], // Пользователи
            'PASSWORD' => \CUser::GeneratePasswordByPolicy(),
            'CONFIRM_PASSWORD' => '',
            'LID' => $this->siteId
        ];
        
        $userId = $user->Add($userData);
        
        if (!$userId) {
            $this->addDebugLog('Failed to create user', [
                'error' => $user->LAST_ERROR,
                'email' => $email
            ]);
            
            // Если не удалось создать пользователя, используем системного
            return $this->getSystemUserId();
        }
        
        $this->addDebugLog('Created new anonymous user', [
            'user_id' => $userId,
            'email' => $email
        ]);
        
        return (int)$userId;
    }

    /**
     * Получение ID системного пользователя
     */
    private function getSystemUserId(): int
    {
        // Ищем системного пользователя или администратора
        $userResult = \CUser::GetList(
            [],
            ['ACTIVE' => 'Y', 'ADMIN' => 'Y'],
            ['ID']
        );
        
        if ($systemUser = $userResult->Fetch()) {
            return (int)$systemUser['ID'];
        }
        
        // Если не найден админ, ищем любого активного пользователя
        $userResult = \CUser::GetList(
            [],
            ['ACTIVE' => 'Y'],
            ['ID']
        );
        
        if ($anyUser = $userResult->Fetch()) {
            return (int)$anyUser['ID'];
        }
        
        // В крайнем случае используем ID 1
        return 1;
    }

    /**
     * Настройка корзины заказа из пользовательской корзины
     */
    private function setupOrderBasketFromUserBasket(Order $order): void
    {
        $basket = Basket::create($this->siteId);

        foreach ($this->basketItems as $basketItem) {
            $item = $basket->createItem('catalog', $basketItem['product_id']);
            $item->setFields([
                'QUANTITY' => $basketItem['quantity'],
                'CURRENCY' => $basketItem['currency'] ?: $this->currencyCode,
                'LID' => $this->siteId,
                'PRODUCT_PROVIDER_CLASS' => '\CCatalogProductProvider',
            ]);

            // Добавляем свойства товара
            if (!empty($basketItem['properties'])) {
                $propertyCollection = $item->getPropertyCollection();
                foreach ($basketItem['properties'] as $property) {
                    $basketProperty = $propertyCollection->createItem();
                    $basketProperty->setFields([
                        'NAME' => $property['name'],
                        'VALUE' => $property['value'],
                        'CODE' => $property['code']
                    ]);
                }
            }
        }

        $order->setBasket($basket);
        
        $this->addDebugLog('Order basket configured from user basket', [
            'items_count' => count($this->basketItems)
        ]);
    }

    /**
     * Очистка корзины пользователя после создания заказа
     */
    private function clearUserBasket(): void
    {
        try {
            $result = $this->clearBasket(); // Используем метод из BasketBase
            
            $this->addDebugLog('User basket cleared after order creation', [
                'fuser_id' => $this->fuserId,
                'result' => $result
            ]);
            
        } catch (\Exception $e) {
            $this->addDebugLog('Failed to clear user basket', [
                'error' => $e->getMessage(),
                'fuser_id' => $this->fuserId
            ]);
            // Не останавливаем процесс, просто логируем ошибку
        }
    }

    /**
     * Настройка доставки заказа
     */
    private function setupOrderDelivery(Order $order): void
    {
        $shipmentCollection = $order->getShipmentCollection();
        $shipment = $shipmentCollection->createItem();
        
        // Получаем ID службы доставки СДЭК или используем "Без доставки"
        $deliveryId = $this->getCdekDeliveryId() ?: Delivery\Services\EmptyDeliveryService::getEmptyDeliveryServiceId();
        $service = Delivery\Services\Manager::getById($deliveryId);
        
        $shipment->setFields([
            'DELIVERY_ID' => $service['ID'],
            'DELIVERY_NAME' => $service['NAME'] . ' (ПВЗ: ' . $this->requestData['delivery']['cdek_code'] . ')',
        ]);

        // Добавляем все товары в отгрузку
        $basket = $order->getBasket();
        $shipmentItemCollection = $shipment->getShipmentItemCollection();
        
        foreach ($basket as $basketItem) {
            $shipmentItem = $shipmentItemCollection->createItem($basketItem);
            $shipmentItem->setQuantity($basketItem->getQuantity());
        }
        
        $this->addDebugLog('Order delivery configured', [
            'delivery_id' => $deliveryId,
            'delivery_name' => $service['NAME'],
            'cdek_code' => $this->requestData['delivery']['cdek_code']
        ]);
    }

    /**
     * Настройка оплаты заказа
     */
    private function setupOrderPayment(Order $order): void
    {
        $paymentCollection = $order->getPaymentCollection();
        $payment = $paymentCollection->createItem();
        
        $paySystemService = PaySystem\Manager::getObjectById($this->requestData['payment_system_id']);
        
        if (!$paySystemService) {
            $this->errorResponse(400, 'Способ оплаты не найден');
        }

        $payment->setFields([
            'PAY_SYSTEM_ID' => $paySystemService->getField("PAY_SYSTEM_ID"),
            'PAY_SYSTEM_NAME' => $paySystemService->getField("NAME"),
        ]);
        
        $this->addDebugLog('Order payment configured', [
            'payment_system_id' => $this->requestData['payment_system_id'],
            'payment_system_name' => $paySystemService->getField("NAME")
        ]);
    }

    /**
     * Настройка свойств заказа
     */
    private function setupOrderProperties(Order $order): void
    {
        $propertyCollection = $order->getPropertyCollection();
        $customer = $this->requestData['customer'];

        // Имя
        if ($nameProp = $propertyCollection->getPayerName()) {
            $fullName = trim($customer['lastname'] . ' ' . $customer['name'] . ' ' . $customer['middlename']);
            $nameProp->setValue($fullName);
        }

        // Телефон
        if ($phoneProp = $propertyCollection->getPhone()) {
            $phoneProp->setValue($customer['phone']);
        }

        // Email
        if ($emailProp = $propertyCollection->getUserEmail()) {
            $emailProp->setValue($customer['email']);
        }

        // Адрес доставки (ПВЗ СДЭК)
        if ($addrProp = $propertyCollection->getAddress()) {
            $address = "ПВЗ СДЭК " . $this->requestData['delivery']['cdek_code'] . ": " . $this->requestData['delivery']['address'];
            $addrProp->setValue($address);
        }
        
        $this->addDebugLog('Order properties configured', [
            'customer_name' => $fullName ?? '',
            'customer_phone' => $customer['phone'],
            'customer_email' => $customer['email'],
            'delivery_address' => $address ?? ''
        ]);
    }

    /**
     * Получение ID службы доставки СДЭК
     */
    private function getCdekDeliveryId(): ?int
    {
        $services = Delivery\Services\Manager::getActiveList();
        
        foreach ($services as $service) {
            if (stripos($service['NAME'], 'СДЭК') !== false || stripos($service['NAME'], 'CDEK') !== false) {
                return $service['ID'];
            }
        }
        
        return null;
    }

    /**
     * Получение статуса заказа в читаемом виде
     */
    private function getOrderStatus(Order $order): string
    {
        if ($order->isCanceled()) {
            return 'canceled';
        }
        
        if ($order->isShipped()) {
            return 'shipped';
        }
        
        if ($order->isPaid()) {
            return 'paid';
        }
        
        return 'new';
    }

    /**
     * Генерация ссылки на страницу оплаты (для фронтенда)
     */
    private function generatePaymentUrl(int $orderId): string
    {
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'shop4shoot.com';
        
        // Формируем ссылку на ваш фронтенд, который сделает редирект на оплату
        return "{$protocol}://{$host}/cart/?order_id={$orderId}";
    }

    /**
     * Исправление параметров формы Робокассы для совместимости
     */
    private function fixRobokassaFormParameters(string $paymentForm): string
    {
        $this->addDebugLog('Fixing Robokassa form parameters');
        
        // Исправляем MrchLogin на MerchantLogin
        $paymentForm = str_replace('name="MrchLogin"', 'name="MerchantLogin"', $paymentForm);
        
        // Исправляем Desc на Description  
        $paymentForm = str_replace('name="Desc"', 'name="Description"', $paymentForm);
        
        // Добавляем параметр Culture=ru если его нет
        if (strpos($paymentForm, 'name="Culture"') === false) {
            $hiddenInput = '<input type="hidden" name="Culture" value="ru">';
            $paymentForm = str_replace('</form>', "\t$hiddenInput\r\n</form>", $paymentForm);
        }
        
        // Исправляем формат чека (Receipt) - убираем лишние параметры и приводим к стандарту
        $paymentForm = $this->fixReceiptFormat($paymentForm);
        
        $this->addDebugLog('Robokassa form parameters fixed');
        
        return $paymentForm;
    }

    /**
     * Исправление параметров URL Робокассы для совместимости
     */
    private function fixRobokassaUrlParameters(string $paymentUrl): string
    {
        $this->addDebugLog('Fixing Robokassa URL parameters');
        
        // Парсим URL и исправляем параметры
        $parsedUrl = parse_url($paymentUrl);
        if (!$parsedUrl || !isset($parsedUrl['query'])) {
            return $paymentUrl;
        }
        
        parse_str($parsedUrl['query'], $params);
        
        // Исправляем MrchLogin на MerchantLogin
        if (isset($params['MrchLogin'])) {
            $params['MerchantLogin'] = $params['MrchLogin'];
            unset($params['MrchLogin']);
        }
        
        // Исправляем Desc на Description
        if (isset($params['Desc'])) {
            $params['Description'] = $params['Desc'];
            unset($params['Desc']);
        }
        
        // Добавляем Culture=ru если его нет
        if (!isset($params['Culture'])) {
            $params['Culture'] = 'ru';
        }
        
        // Исправляем формат чека
        if (isset($params['Receipt'])) {
            $params['Receipt'] = $this->fixReceiptData($params['Receipt']);
        }
        
        // Собираем URL обратно
        $newQuery = http_build_query($params);
        $fixedUrl = $parsedUrl['scheme'] . '://' . $parsedUrl['host'] . $parsedUrl['path'] . '?' . $newQuery;
        
        $this->addDebugLog('Robokassa URL parameters fixed', [
            'original_length' => strlen($paymentUrl),
            'fixed_length' => strlen($fixedUrl)
        ]);
        
        return $fixedUrl;
    }

    /**
     * Исправление формата чека в форме
     */
    private function fixReceiptFormat(string $paymentForm): string
    {
        // Ищем поле Receipt
        if (preg_match('/name="Receipt"\s+value="([^"]+)"/', $paymentForm, $matches)) {
            $receiptData = urldecode($matches[1]);
            $fixedReceiptData = $this->fixReceiptData($receiptData);
            $encodedReceiptData = urlencode($fixedReceiptData);
            
            $paymentForm = str_replace($matches[0], 'name="Receipt" value="' . $encodedReceiptData . '"', $paymentForm);
            
            $this->addDebugLog('Receipt format fixed in form');
        }
        
        return $paymentForm;
    }

    /**
     * Исправление данных чека
     */
    private function fixReceiptData(string $receiptData): string
    {
        try {
            $receipt = json_decode($receiptData, true);
            
            if (!$receipt || !isset($receipt['items'])) {
                return $receiptData; // Если не можем распарсить, возвращаем как есть
            }
            
            // Исправляем формат позиций чека
            foreach ($receipt['items'] as &$item) {
                // Убираем nomenclature_code если он false
                if (isset($item['nomenclature_code']) && $item['nomenclature_code'] === false) {
                    unset($item['nomenclature_code']);
                }
                
                // Убираем лишние параметры, которые могут вызывать проблемы
                if (isset($item['tax']) && $item['tax'] === 'vat0') {
                    $item['tax'] = 'none'; // Заменяем vat0 на none для совместимости
                }
            }
            
            $fixedReceiptData = json_encode($receipt, JSON_UNESCAPED_UNICODE);
            
            $this->addDebugLog('Receipt data fixed', [
                'original_length' => strlen($receiptData),
                'fixed_length' => strlen($fixedReceiptData)
            ]);
            
            return $fixedReceiptData;
            
        } catch (\Exception $e) {
            $this->addDebugLog('Failed to fix receipt data', [
                'error' => $e->getMessage()
            ]);
            return $receiptData; // Возвращаем оригинал при ошибке
        }
    }


    /**
     * Логирование ошибок
     */
    private function logError(\Exception $e): void
    {
        $this->addDebugLog('Exception occurred', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'fuser_id' => $this->fuserId
        ]);
        
        error_log("Orders API Error: " . $e->getMessage() . " in " . $e->getFile() . ":" . $e->getLine());
    }
} 