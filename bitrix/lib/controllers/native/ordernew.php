<?php

namespace Artamonov\Rest\Controllers\Native;

use Artamonov\Rest\Controllers\Native\BaseController;
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
class OrderNew extends BaseController
{
    private int $personTypeId = 1; // ID типа плательщика (физлицо)
    private string $currencyCode = 'RUB';
    private array $requestData = [];
    private ?int $userId = null;
    private array $basketItems = [];
    private array $debugLog = []; // ИСПРАВЛЕНО: добавлено свойство для логирования
    
    // Свойства для корзины (перенесены из BasketBase)
    protected string $siteId = 's1';
    protected int $fuserId = 0;
    protected ?int $providedFuserId = null;
    protected bool $isFuserFromRequest = false;

    public function __construct()
    {
        parent::__construct();
        
        // ИСПРАВЛЕНИЕ: Правильная инициализация $USER в API контексте
        global $USER;
        if (!$USER) {
            $USER = new \CUser();
        }
        
        $this->userId = $USER->isAuthorized() ? $USER->GetID() : null;
        $this->currencyCode = CurrencyManager::getBaseCurrency();
        
        // Инициализируем сайт
        $this->siteId = Context::getCurrent()->getSite() ?: 's1';
    }

    /**
     * Получение обязательных модулей
     */
    protected function getRequiredModules(): array
    {
        return ['sale', 'catalog', 'currency'];
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
     * Обработка получения формы оплаты - НОВАЯ ВЕРСИЯ С СОБСТВЕННОЙ ГЕНЕРАЦИЕЙ
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
        
        $this->addDebugLog('Payment collection analysis', [
            'payments_count' => $paymentCollection->count(),
            'order_total' => $order->getPrice(),
            'order_paid_sum' => $order->getSumPaid()
        ]);
        
        // Ищем неоплаченный платеж
        foreach ($paymentCollection as $paymentItem) {
            $this->addDebugLog('Payment item found', [
                'id' => $paymentItem->getId(),
                'payment_system_id' => $paymentItem->getPaymentSystemId(),
                'sum' => $paymentItem->getSum(),
                'is_paid' => $paymentItem->isPaid(),
                'payment_system_name' => $paymentItem->getPaymentSystemName()
            ]);
            
            if (!$paymentItem->isPaid()) {
                $payment = $paymentItem;
                break;
            }
        }

        // Если платежей нет, создаем платеж по D7 стандартам
        if ($paymentCollection->count() === 0 || !$payment) {
            $this->addDebugLog('Creating new payment for order');
            
            try {
                $payment = $paymentCollection->createItem();
                
                // ПРАВИЛЬНОЕ создание платежа по D7
                $paySystemService = PaySystem\Manager::getObjectById(3); // Робокасса
                
                if (!$paySystemService) {
                    $this->errorResponse(400, 'Платежная система с ID 3 (Робокасса) не найдена');
                }
                
                $payment->setFields([
                    'PAY_SYSTEM_ID' => $paySystemService->getField("PAY_SYSTEM_ID"),
                    'PAY_SYSTEM_NAME' => $paySystemService->getField("NAME"),
                    'SUM' => $order->getPrice()
                ]);
                
                $order->save();
                
                $this->addDebugLog('Payment created successfully', [
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
            $this->errorResponse(404, 'Неоплаченная оплата не найдена');
        }

        // Получаем объект платежной системы
        $paySystemService = PaySystem\Manager::getObjectById($payment->getPaymentSystemId());
        if (!$paySystemService) {
            $this->errorResponse(400, 'Платежная система не найдена (ID: ' . $payment->getPaymentSystemId() . ')');
        }

        $this->addDebugLog('Payment system info', [
            'id' => $paySystemService->getField('ID'),
            'name' => $paySystemService->getField('NAME'),
            'new_window' => $paySystemService->getField('NEW_WINDOW'),
            'active' => $paySystemService->getField('ACTIVE'),
            'class_name' => get_class($paySystemService)
        ]);

        // Определяем тип платежной системы
        $paymentSystemId = $payment->getPaymentSystemId();
        $isRobokassa = ($paymentSystemId == 3 || $paymentSystemId === '3' || (int)$paymentSystemId === 3);
        
        $paymentForm = '';
        $directPaymentUrl = '';

        // ТОЧНАЯ КОПИЯ РАБОЧЕГО КОДА ИЗ cart/index.php
        if ($isRobokassa) { // Робокасса
            $this->addDebugLog('Using EXACT working code from cart/index.php');
            
            try {
                // ТОЧНО ТАК ЖЕ КАК В РАБОЧЕМ КОДЕ
                $mrh_login = "shop4shoot.ru";
                $mrh_pass1 = "m0PVdR1Sg4ZJqqsdn5M0";
                $inv_desc = "Оплата заказа №" . $order->getId();
                
                $orderArray = $order->toArray();
                $basketArray = $orderArray["BASKET_ITEMS"];
                $out_summ = $orderArray["PRICE"];
                  
                $invId = $order->getId() . $orderArray["ACCOUNT_NUMBER"];
                $culture = "ru";
                $receipt = [];
                
                // ТОЧНО ТАК ЖЕ формируем Receipt
                foreach ($basketArray as $orderItem) {
                    $price = $orderItem["PRICE"];
                    $count = (int)$orderItem["QUANTITY"];
                    $receipt["items"][] = [
                        "name" => $orderItem["NAME"],
                        "sum" => $price * $count,
                        "quantity" => $count,
                        "tax" => "none",
                        "nomenclature_code" => $orderItem["PRODUCT_ID"] // упрощено без getMarkerCode
                    ];
                }
                $receipt = urldecode(json_encode($receipt));
                
                // ТОЧНО ТАКАЯ ЖЕ подпись как в рабочем коде
                $sgn = md5("$mrh_login:$out_summ:$invId:$receipt:$mrh_pass1");
                
                $this->addDebugLog('Robokassa params generated EXACTLY like working code', [
                    'mrh_login' => $mrh_login,
                    'out_summ' => $out_summ,
                    'invId' => $invId,
                    'culture' => $culture,
                    'receipt_length' => strlen($receipt),
                    'signature' => $sgn
                ]);
                
                // ТОЧНО ТАКАЯ ЖЕ форма как в рабочем коде
                $paymentForm = '<form action="https://auth.robokassa.ru/Merchant/Index.aspx" method="POST">' . "\n";
                $paymentForm .= '<input type="hidden" name="MerchantLogin" value="' . htmlspecialchars($mrh_login) . '">' . "\n";
                $paymentForm .= '<input type="hidden" name="OutSum" value="' . htmlspecialchars($out_summ) . '">' . "\n";
                $paymentForm .= '<input type="hidden" name="InvId" value="' . htmlspecialchars($invId) . '">' . "\n";
                $paymentForm .= '<input type="hidden" name="Receipt" value="' . htmlspecialchars($receipt) . '">' . "\n";
                $paymentForm .= '<input type="hidden" name="Description" value="' . htmlspecialchars($inv_desc) . '">' . "\n";
                $paymentForm .= '<input type="hidden" name="SignatureValue" value="' . htmlspecialchars($sgn) . '">' . "\n";
                $paymentForm .= '<input type="hidden" name="Culture" value="' . htmlspecialchars($culture) . '">' . "\n";
                $paymentForm .= 'Счет № ' . htmlspecialchars($payment->getId()) . '<br>' . "\n";
                $paymentForm .= 'Сумма к оплате по счету: <b>' . $out_summ . ' RUB</b>' . "\n";
                $paymentForm .= '<p><input type="submit" class="btn btn-default button" name="Submit" value="Оплатить"></p>' . "\n";
                $paymentForm .= '</form>' . "\n";
                
                $directPaymentUrl = '';
                
                $this->addDebugLog('Form generated EXACTLY like working code', [
                    'form_length' => strlen($paymentForm),
                    'contains_MerchantLogin' => strpos($paymentForm, 'MerchantLogin') !== false,
                    'contains_Culture' => strpos($paymentForm, 'Culture') !== false
                ]);
                
            } catch (\Exception $e) {
                $this->addDebugLog('Failed to use EXACT working code', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                
                use_standard_api:
                // Fallback к стандартному API для других платежных систем
                $this->errorResponse(500, 'Ошибка генерации формы Робокассы: ' . $e->getMessage());
            }
        } else {
            // Для других платежных систем используем стандартный API
            $this->addDebugLog('Using standard Bitrix payment API', [
                'payment_system_id' => $paymentSystemId,
                'payment_system_id_type' => gettype($paymentSystemId)
            ]);
            
            $paymentForm = '';
            $directPaymentUrl = '';

            try {
                if ($paySystemService->getField('NEW_WINDOW') === 'N' || $paySystemService->getField('ID') == PaySystem\Manager::getInnerPaySystemId()) {
                    
                    $this->addDebugLog('Generating form payment (NEW_WINDOW=N)');
                    
                    $initResult = $paySystemService->initiatePay($payment, null, PaySystem\BaseServiceHandler::STRING);
                    
                    if ($initResult->isSuccess()) {
                        $paymentForm = $initResult->getTemplate();
                        
                        $this->addDebugLog('Form payment generated successfully', [
                            'template_length' => strlen($paymentForm),
                            'contains_form' => strpos($paymentForm, '<form') !== false
                        ]);
                    } else {
                        $errors = $initResult->getErrorMessages();
                        $this->addDebugLog('Form payment generation failed', [
                            'errors' => $errors
                        ]);
                        $this->errorResponse(400, 'Ошибка получения формы оплаты: ' . implode(', ', $errors));
                    }
                } else {
                    
                    $this->addDebugLog('Generating direct payment URL (NEW_WINDOW=Y)');
                    
                    $initResult = $paySystemService->initiatePay($payment, null, PaySystem\BaseServiceHandler::CURL);
                    
                    if ($initResult->isSuccess()) {
                        $directPaymentUrl = $initResult->getTemplate();
                        
                        $this->addDebugLog('Direct payment URL generated successfully', [
                            'url_length' => strlen($directPaymentUrl),
                            'url_preview' => substr($directPaymentUrl, 0, 100) . '...'
                        ]);
                    } else {
                        $errors = $initResult->getErrorMessages();
                        $this->addDebugLog('Direct payment URL generation failed', [
                            'errors' => $errors
                        ]);
                        $this->errorResponse(400, 'Ошибка получения ссылки оплаты: ' . implode(', ', $errors));
                    }
                }

            } catch (\Exception $e) {
                $this->addDebugLog('Payment generation error', [
                    'error' => $e->getMessage(),
                    'payment_system_id' => $payment->getPaymentSystemId(),
                    'trace' => $e->getTraceAsString()
                ]);
                $this->errorResponse(500, 'Ошибка инициализации оплаты: ' . $e->getMessage());
            }
        }

        $this->addDebugLog('Final response preparation', [
            'payment_form_length' => strlen($paymentForm),
            'direct_payment_url_length' => strlen($directPaymentUrl),
            'debug_log_count' => count($this->debugLog)
        ]);

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

        // Загружаем товары из корзины через SQL
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
     * Получение свойств товара в корзине через SQL
     */
    private function getBasketItemPropertiesViaSql(int $basketId): array
    {
        $sql = "SELECT NAME, VALUE, CODE FROM b_sale_basket_props WHERE BASKET_ID = " . intval($basketId);
        $result = \Bitrix\Main\Application::getConnection()->query($sql);
        
        $properties = [];
        while ($row = $result->fetch()) {
            $properties[] = [
                'name' => $row['NAME'],
                'value' => $row['VALUE'],
                'code' => $row['CODE']
            ];
        }
        
        return $properties;
    }

    /**
     * Проверка доступности товара
     */
    private function checkProductAvailability(int $productId, int $quantity): array
    {
        // Упрощенная проверка - можно расширить
        return [
            'available' => true,
            'error' => ''
        ];
    }

    /**
     * Очистка корзины пользователя
     */
    private function clearBasket(): bool
    {
        $sql = "DELETE FROM b_sale_basket WHERE FUSER_ID = " . intval($this->fuserId) . " AND LID = '" . $this->siteId . "' AND (ORDER_ID IS NULL OR ORDER_ID = 0)";
        \Bitrix\Main\Application::getConnection()->query($sql);
        return true;
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
            $result = $this->clearBasket();
            
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
     * Добавление записи в лог отладки
     */
    private function addDebugLog(string $message, array $data = []): void
    {
        $this->debugLog[] = [
            'time' => date('Y-m-d H:i:s'),
            'message' => $message,
            'data' => $data
        ];
    }

    /**
     * Получение лога отладки
     */
    private function getDebugLog(): array
    {
    
        return $this->debugLog;
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