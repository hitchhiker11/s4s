<?php
  
  use Bitrix\Currency\CurrencyManager;
  use Bitrix\Main\Context;
  use Bitrix\Main\Engine\Contract\Controllerable;
  use \Bitrix\Main;
  use \Bitrix\Sale;
  use \Bitrix\Sale\Order;
  use \Bitrix\Main\Loader;
  use \Bitrix\Main\Application;
  use \Bitrix\Sale\Delivery;
  use \Bitrix\Sale\PaySystem;
  
  \Bitrix\Main\Loader::includeModule('iblock');
  \Bitrix\Main\Loader::includeModule('sale');
  
  if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();
//  ini_set('error_reporting', E_ERROR);
//  ini_set('display_errors', 1);
//  ini_set('display_startup_errors', 1);
  
  class PersonalOrder extends CBitrixComponent implements Controllerable
  {
    public $arParams = [];
    public $arResult = [];
//    private $user;
//    private $entityID;
//    private $error = false;
//    private $errorList = [];
//    const ENTITY_IB = 30;
//
//    const FORM_PROPERTY_ID = 324;
//
//    public $userData = [
//      "second-name" => "fam",
//      "name" => "name",
//      "last-name" => "fath",
//      "personal-mobile" => "79898989898989",
//      "email" => "kd@ft10.ru",
//      "login" => "kd_",
//      "password" => "123456",
//      "check-password" => "123456",
//      "full-name" => "Полное",
//      "address" => "Адрес",
//      "address-place" => "Местонахождение",
//      "inn" => "11111111111111111",
//      "bic" => "22222222222222",
//      "checking-acc" => "2333333333333333",
//      "corr-acc" => "3444444444444444",
//    ];
    
    /**
     * Подготовка параметров компонента
     * @param $arParams
     * @return mixed
     */
    public function onPrepareComponentParams($arParams) {
      
      $this->arParams = $arParams;
      return $arParams;
    }
    
    /**
     * Точка входа в компонент
     */
    public function executeComponent() {
      $this->setResult();
      $this->includeComponentTemplate();
    }
    
    private function _user() {
      global $USER;
      return $USER;
    }
    
    private function setResult(): void {
      $this->setPaySystems();
      $this->setDeliveryList();
//      $this->setEntities();
//      $this->setUserData();
//      $this->setAddressesData();
//      $this->setDeliveryTime();
//      $this->setPickupList();
//      $this->setBasketData();
      
    }

    private function setPaySystems(): void {
      $this->arResult['PAY_SYSTEMS'] = [];
      $rsPaySystem = \Bitrix\Sale\Internals\PaySystemActionTable::getList(array(
        'filter' => array('ACTIVE'=>'Y'),
      ));
      while($arPaySystem = $rsPaySystem->fetch())
      {
        $this->arResult['PAY_SYSTEMS'][] = [
          "NAME" => $arPaySystem["NAME"],
          "ID" => $arPaySystem["ID"],
          "PAY_SYSTEM_ID" => $arPaySystem["PAY_SYSTEM_ID"],
        ];
      }
    }
    
    private function setDeliveryList(): void {
      $this->arResult['DELIVERY_SYSTEMS'] = [];
      $result = \Bitrix\Sale\Delivery\Services\Table::getList(array(
        "filter" => [
          "ACTIVE" => "Y",
          "!ID" => 1,
          "PARENT_ID" => 0
        ],
        "order"  => [
          "sort" => "desc"
        ]
      ));
      while($delivery = $result->fetch())
      {
        $this->arResult['DELIVERY_SYSTEMS'][] = [
          "NAME" => $delivery["NAME"],
          "ID" => $delivery["ID"]
        ];
      }
    }

    public function configureActions() {
      // Сбрасываем фильтры по-умолчанию (ActionFilter\Authentication и ActionFilter\HttpMethod)
      // Предустановленные фильтры находятся в папке /bitrix/modules/main/lib/engine/actionfilter/
      return [
        'createOrder' => [
          'prefilters' => [],
        ],
      ];
    }
    
    
//
//    private function setBasketData() {
//      $basket = Sale\Basket::loadItemsForFUser(Sale\Fuser::getId(), Bitrix\Main\Context::getCurrent()->getSite());
//      if ($basket->isEmpty()) {
//        $this->arResult["BASKET_DATA"]["EMPTY"] = true;
//        return false;
//      }
//      $fuser = new \Bitrix\Sale\Discount\Context\Fuser($basket->getFUserId(true));
//      $discounts = \Bitrix\Sale\Discount::buildFromBasket($basket, $fuser);
//      $discounts->calculate();
//      $result = $discounts->getApplyResult(true);
//      $prices = $result['PRICES']['BASKET']; // цены товаров с учетом скидки
//      $pricesData = [
//        "BASE" => [],
//        "CURRENT" => [],
//        "TOTAL_DISCOUNT" => []
//      ];
//
//      foreach ($prices as $price) {
//        $pricesData["BASE"][] = $price["BASE_PRICE"];
//        $pricesData["CURRENT"][] = $price["PRICE"];
//        $pricesData["TOTAL_DISCOUNT"][] = $price["DISCOUNT"];
//      }
//      $this->arResult["BASKET_DATA"]["PRICE"] = array_sum($pricesData["CURRENT"]);
//      $this->arResult["BASKET_DATA"]["PRICE_FORMATTED"] = number_format(
//          $this->arResult["BASKET_DATA"]["PRICE"],
//          0,
//          ".",
//          " "
//        ) . " ₽";
//      $this->arResult["BASKET_DATA"]["BASE_PRICE"] = array_sum($pricesData["BASE"]);
//      $this->arResult["BASKET_DATA"]["BASE_PRICE_FORMATTED"] = number_format(
//          $this->arResult["BASKET_DATA"]["BASE_PRICE"],
//          0,
//          ".",
//          " "
//        ) . " ₽";
//      $this->arResult["BASKET_DATA"]["TOTAL_DISCOUNT"] = array_sum($pricesData["TOTAL_DISCOUNT"]);
//      $this->arResult["BASKET_DATA"]["TOTAL_DISCOUNT_FORMATTED"] = number_format(
//          $this->arResult["BASKET_DATA"]["TOTAL_DISCOUNT"],
//          0,
//          ".",
//          " "
//        ) . " ₽";
//    }
//
//    private function setEntities() {
//      $this->arResult["ENTITIES"] = $this->getEntities($this->_user()->getID());
//    }
//
//    private function setUserData() {
//      $id = $this->_user()->getID();
//      $this->user = \Bitrix\Main\UserTable::getList([
//        "filter" => [
//          "ID" => $id
//        ],
//        "select" => [
//          "NAME",
//          "SECOND_NAME", // Фамилия
//          "LAST_NAME", // Отчество
//          "EMAIL",
//          "UF_MANAGER",
//          "UF_ENTITIES",
//          "UF_DELIVERY_ADDRESSES",
//          "PERSONAL_MOBILE",
//          "XML_ID"
//        ]
//      ])->Fetch();
//    }
//
//    private function setAddressesData() {
//      $this->arResult["ADDRESSES"] = $this->user["UF_DELIVERY_ADDRESSES"];
//    }
//
//    private function setDeliveryTime() {
//      $dbRes = \Bitrix\Iblock\Elements\ElementDeliveryTimeTable::getList([
//        "filter" => [
//          "ACTIVE" => "Y"
//        ],
//        "order" => [
//          "SORT" => "ASC"
//        ],
//        "select" => [
//          "NAME"
//        ]
//      ]);
//      while ($obj = $dbRes->Fetch()) {
//        $this->arResult["DELIVERY_TIMES"][] = $obj["NAME"];
//      }
//    }
//
//    private function setPickupList() {
//      $dbRes = \Bitrix\Iblock\Elements\ElementPickupTable::getList([
//        "filter" => [
//          "ACTIVE" => "Y"
//        ],
//        "order" => [
//          "SORT" => "ASC"
//        ],
//        "select" => [
//          "NAME"
//        ]
//      ]);
//      while ($obj = $dbRes->Fetch()) {
//        $this->arResult["PICKUP_LIST"][] = $obj["NAME"];
//      }
//    }
//

    
    function setErrors($data) {
      $this->error = false;
      $this->errorList = [];
//      if (!Helpers::isEmail($data["email"])) {
//        $this->error = true;
//        $this->errorList[] = [
//          "type" => "email",
//          "message" => "Некорректный email"
//        ];
//      }
//      if (!Helpers::isPhone($data["phone"])) {
//        $this->error = true;
//        $this->errorList[] = [
//          "type" => "phone",
//          "message" => "Некорректный номер телефона"
//        ];
//      }
      if (!$data["entity"]) {
        $this->error = true;
        $this->errorList[] = [
          "type" => "entity",
          "message" => "Не выбрано юридическое лицо"
        ];
      }
      if ($data["type-delivery"] === "pickup") {
        if (!$data["pickup"]) {
          $this->error = true;
          $this->errorList[] = [
            "type" => "pickup",
            "message" => "Не выбран пункт самовывоза"
          ];
        }
      }
      if ($data["type-delivery"] === "delivery") {
        if (!$data["delivery"]) {
          $this->error = true;
          $this->errorList[] = [
            "type" => "delivery",
            "message" => "Не введен адрес доставки"
          ];
        }
        if (!$data["date"]) {
          $this->error = true;
          $this->errorList[] = [
            "type" => "date",
            "message" => "Не выбрана дата доставки"
          ];
        }
        if (!$data["time"]) {
          $this->error = true;
          $this->errorList[] = [
            "type" => "time",
            "message" => "Не выбрано время доставки"
          ];
        }
      }
    }

    function createOrderAction($params) {
//      global $USER;
      
//      return [
//        "empty" => true,
//        "mes" => "",
//        "id" => 9
//      ];
      
      $data = json_decode($params, true)["data"];
//      $this->setErrors($data);
      if ($this->error) {
        return [
          "error" => $this->error,
          "errorList" => $this->errorList
        ];
      }
      $name = $data["name"] . " " . $data["second-name"] . " " . $data["surname"];
      $comment = $data["comment"];



      $siteId = Context::getCurrent()->getSite();
      $currencyCode = CurrencyManager::getBaseCurrency();

// Создаёт новый заказ
      $order = \Bitrix\Sale\Order::create($siteId, Sale\Fuser::getId());
      $order->setPersonTypeId(1);
      $order->setField('CURRENCY', $currencyCode);
      if ($comment) {
        $order->setField('USER_DESCRIPTION', $comment); // Устанавливаем поля комментария покупателя
      }
      $order->setField('USER_DESCRIPTION', $comment);
      $basket = Sale\Basket::loadItemsForFUser(Sale\Fuser::getId(), Bitrix\Main\Context::getCurrent()->getSite());
      if ($basket->isEmpty()) {
        return [
          "empty" => true
        ];
      }
      $order->setBasket($basket);

// Создаём одну отгрузку и устанавливаем способ доставки - "Без доставки" (он служебный)
      $shipmentCollection = $order->getShipmentCollection();
      $shipment = $shipmentCollection->createItem();
//      $service = Delivery\Services\Manager::getById(Delivery\Services\EmptyDeliveryService::getEmptyDeliveryServiceId());
      $shipment->setFields(array(
        'DELIVERY_ID' => $data['delivery'],
      ));
//      $shipmentItemCollection = $shipment->getShipmentItemCollection();
//      $shipmentItem = $shipmentItemCollection->createItem($item);
//      $shipmentItem->setQuantity($item->getQuantity());

// Создаём оплату со способом #1
      $paymentCollection = $order->getPaymentCollection();
      $payment = $paymentCollection->createItem();
      $paySystemService = PaySystem\Manager::getObjectById($data["pay"]);
      $payment->setFields(array(
        'PAY_SYSTEM_ID' => $paySystemService->getField("PAY_SYSTEM_ID"),
        'PAY_SYSTEM_NAME' => $paySystemService->getField("NAME"),
      ));

// Устанавливаем свойства
      $propertyCollection = $order->getPropertyCollection();
      
      $phoneProp = $propertyCollection->getPhone();
//      return $phoneProp;
//      var_dump($phoneProp);
      $phoneProp->setValue($data["phone"]);
      
//      return $propertyCollection->getUserEmail();
//      return get_class_methods($propertyCollection);
      $emailProp = $propertyCollection->getUserEmail();
      $emailProp->setValue($data["email"]);
      $nameProp = $propertyCollection->getPayerName();
      $nameProp->setValue($name);
      $propItem = $propertyCollection->getItemByOrderPropertyId(1);
      $propItem->setValue($data["delivery-address"]);
// Сохраняем
      $order->doFinalAction(true);
      $result = $order->save();
      $orderId = $order->getId();
      if ($orderId) {
        $message = getAdminMessageBody($data, $basket->toArray(), $orderId);
        CEvent::SendImmediate(
          "KRAKEN_CART_ADMIN_s1",
          SITE_ID,
          [
            "MESSAGE" => $message,
            "ID_ORDER" => $orderId
          ],
          "Y",
          11
        );
      }
      return [
        "mes" => $result,
        "id" => $orderId
      ];
    }
    
  }
