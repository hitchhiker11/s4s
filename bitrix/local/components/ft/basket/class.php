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

  class PersonalBasket extends CBitrixComponent implements Controllerable
  {
    public $arParams = [];
    public $arResult = [];
    private $kJSParams = [];
    
    const IBLOCK_OFFERS_ID = 13;
    const IBLOCK_CATALOG_ID = 21;
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
      $this->setBasketData();
      $this->setJSParams();
    }

    public function configureActions() {
      // Сбрасываем фильтры по-умолчанию (ActionFilter\Authentication и ActionFilter\HttpMethod)
      // Предустановленные фильтры находятся в папке /bitrix/modules/main/lib/engine/actionfilter/
      return [
        'createOrder' => [
          'prefilters' => [],
        ],
        "changeProductQuantity" => [
          'prefilters' => [],
        ],
        "removeProduct" => [
          'prefilters' => [],
        ],
        "removeAllProduct" => [
          'prefilters' => [],
        ],
        "refreshProducts" => [
          'prefilters' => [],
        ],
      ];
    }
    
    private function setBasketData() {
      $basket = Sale\Basket::loadItemsForFUser(Sale\Fuser::getId(), Bitrix\Main\Context::getCurrent()->getSite());
      $this->arResult["BASKET_TOTAL"] = [
        "PRICE" => 0,
        "PRICE_FORMATTED" => ""
      ];
      if ($basket->isEmpty()) {
        $this->arResult["BASKET_DATA"]["EMPTY"] = true;
        $this->arResult["BASKET_TOTAL"]["EMPTY"] = true;
        return false;
      }
      
      $fuser = new \Bitrix\Sale\Discount\Context\Fuser($basket->getFUserId(true));
      $discounts = \Bitrix\Sale\Discount::buildFromBasket($basket, $fuser);
      $discounts->calculate();
      $result = $discounts->getApplyResult(true);
      $prices = $result['PRICES']['BASKET']; // цены товаров с учетом скидки
      $pricesData = [
        "BASE" => [],
        "CURRENT" => [],
        "TOTAL_DISCOUNT" => []
      ];
      
      $productData = [];
      
      foreach ($basket as $basketItem) {
        $productID = $basketItem->getProductId();
        $offer = CCatalogSku::GetProductInfo(
          $productID
        );
        if ($offer) {
          if ($offer["SKU_PROPERTY_ID"] && $offer["OFFER_IBLOCK_ID"]) {
            $offersClassName = \Bitrix\Iblock\Iblock::wakeUp(self::IBLOCK_OFFERS_ID)->getEntityDataClass();
            $productRaw = $offersClassName::getByPrimary($productID, [
              'select' => [
                'ID',
                'NAME',
                'PREVIEW_PICTURE',
                'DETAIL_PICTURE',
                "HAND_" => "HAND.ITEM",
                "MODEL_" => "MODEL.ITEM",
                'ARTICLE_' => 'ARTICLE.VALUE',
              ]
            ])->fetch();
            
            if (!$productRaw["PREVIEW_PICTURE"] && !$productRaw["DETAIL_PICTURE"]) {
              $photoItems = $offersClassName::getByPrimary($productID, [
                'select' => [
                  'ID',
                  "MORE_PHOTO.FILE",
                ]
              ])->fetchCollection();
              foreach ($photoItems as $element) {
                foreach ($element->getMorePhoto()->getAll() as $value) {
                  $productRaw["PREVIEW_PICTURE"] = '/upload/' . $value->getFile()->getSubdir() . '/' . $value->getFile()
                      ->getFileName();
                  break;
                }
              }
              if (!$productRaw["PREVIEW_PICTURE"]) {
                $productRaw["PREVIEW_PICTURE"] = CATALOG_PICTURE_STUB;
              }
            } else {
              if ($productRaw["PREVIEW_PICTURE"]) $productRaw["PREVIEW_PICTURE"] = CFile::GetPath($productRaw["PREVIEW_PICTURE"]);
              if ($productRaw["DETAIL_PICTURE"]) $productRaw["DETAIL_PICTURE"] = CFile::GetPath($productRaw["DETAIL_PICTURE"]);
            }
            
            $productRaw["SKU_PROPS"] = [];
            if ($productRaw["HAND_VALUE"]) {
              $productRaw["SKU_PROPS"][] = [
                "TITLE" => "Рука",
                "VALUE" => $productRaw["HAND_VALUE"]
              ];
            }
            if ($productRaw["MODEL_VALUE"]) {
              $productRaw["SKU_PROPS"][] = [
                "TITLE" => "Модель пистолета",
                "VALUE" => $productRaw["MODEL_VALUE"]
              ];
            }
            $productRaw['DETAIL_PAGE_URL'] = $this->getElementLinkByID($offer["ID"]);
            $product = CCatalogProduct::GetByID($basketItem->getProductId());
            $productRaw["PRODUCT_ID"] = $productID;
            $productRaw["QUANTITY"] = [
              "TOTAL" => $basketItem->getQuantity(),
              "MAX" => (int)$product["QUANTITY"]
            ];
            $totalPrice = (int)$productRaw["QUANTITY"]["TOTAL"] * $basketItem->getPrice();
            $productRaw["PRICES"] = [
              "PRICE" => $basketItem->getPrice(),
              "PRICE_FORMATTED" => number_format(
                  $basketItem->getPrice(),
                  0,
                  ".",
                  " "
                ) . " ₽",
              "BASE_PRICE" => $basketItem->getBasePrice(),
              "DISCOUNT_PRICE" => $basketItem->getDiscountPrice(),
              "TOTAL_PRICE" => $totalPrice,
              "TOTAL_PRICE_FORMATTED" => number_format(
                  $totalPrice,
                  0,
                  ".",
                  " "
                ) . " ₽",
            ];
            $this->arResult["BASKET_TOTAL"]["PRICE"] += $totalPrice;
            $productData[] = $productRaw;

//            break;
            
          } else {
            // TODO write code for single product
          }
        } else {
          $productClassName = \Bitrix\Iblock\Iblock::wakeUp(CATALOG_IB)->getEntityDataClass();
          $productRaw = $productClassName::getByPrimary($productID, [
            'select' => [
              'ID',
              'NAME',
              'PREVIEW_PICTURE',
              'DETAIL_PICTURE',
            ]
          ])->fetch();
          if ($productRaw["PREVIEW_PICTURE"]) $productRaw["PREVIEW_PICTURE"] = CFile::GetPath($productRaw["PREVIEW_PICTURE"]);
          if ($productRaw["DETAIL_PICTURE"]) $productRaw["DETAIL_PICTURE"] = CFile::GetPath($productRaw["DETAIL_PICTURE"]);
          if (!$productRaw["PREVIEW_PICTURE"]) {
            $productRaw["PREVIEW_PICTURE"] = CATALOG_PICTURE_STUB;
          }
          $productRaw['DETAIL_PAGE_URL'] = $this->getElementLinkByID($productID);
          $product = CCatalogProduct::GetByID($basketItem->getProductId());
          $productRaw["PRODUCT_ID"] = $productID;
          $productRaw["QUANTITY"] = [
            "TOTAL" => $basketItem->getQuantity(),
            "MAX" => (int)$product["QUANTITY"]
          ];
          $totalPrice = (int)$productRaw["QUANTITY"]["TOTAL"] * $basketItem->getPrice();
          $productRaw["PRICES"] = [
            "PRICE" => $basketItem->getPrice(),
            "PRICE_FORMATTED" => number_format(
                $basketItem->getPrice(),
                0,
                ".",
                " "
              ) . " ₽",
            "BASE_PRICE" => $basketItem->getBasePrice(),
            "DISCOUNT_PRICE" => $basketItem->getDiscountPrice(),
            "TOTAL_PRICE" => $totalPrice,
            "TOTAL_PRICE_FORMATTED" => number_format(
                $totalPrice,
                0,
                ".",
                " "
              ) . " ₽",
          ];
          $this->arResult["BASKET_TOTAL"]["PRICE"] += $totalPrice;
          $productData[] = $productRaw;
        }
        
        
      }
      $this->arResult["BASKET_TOTAL"]["PRICE_FORMATTED"] = number_format(
          $this->arResult["BASKET_TOTAL"]["PRICE"],
          0,
          ".",
          " "
        ) . " ₽";
      foreach ($prices as $price) {
        $pricesData["BASE"][] = $price["BASE_PRICE"];
        $pricesData["CURRENT"][] = $price["PRICE"];
        $pricesData["TOTAL_DISCOUNT"][] = $price["DISCOUNT"];
      }
      $this->arResult["BASKET_DATA"]["PRICE"] = array_sum($pricesData["CURRENT"]);
      $this->arResult["BASKET_DATA"]["PRICE_FORMATTED"] = number_format(
          $this->arResult["BASKET_DATA"]["PRICE"],
          0,
          ".",
          " "
        ) . " ₽";
      $this->arResult["BASKET_DATA"]["BASE_PRICE"] = array_sum($pricesData["BASE"]);
      $this->arResult["BASKET_DATA"]["BASE_PRICE_FORMATTED"] = number_format(
          $this->arResult["BASKET_DATA"]["BASE_PRICE"],
          0,
          ".",
          " "
        ) . " ₽";
      $this->arResult["BASKET_DATA"]["TOTAL_DISCOUNT"] = array_sum($pricesData["TOTAL_DISCOUNT"]);
      $this->arResult["BASKET_DATA"]["TOTAL_DISCOUNT_FORMATTED"] = number_format(
          $this->arResult["BASKET_DATA"]["TOTAL_DISCOUNT"],
          0,
          ".",
          " "
        ) . " ₽";
      
      $this->arResult["PRODUCT_DATA"] = $productData;
    }
    
    function setJSParams() {
      $this->kJSParams = [
        "nodes" => [
          "productWrapper" => "k-product-table",
          "offerValues" => "k-offer-values",
          "article" => "k-article",
          "photo" => "k-photo",
          "link" => "k-link",
          "name" => "k-name",
          "count" => "k-count",
          "totalPrice" => "k-total-price",
          "remove" => "k-remove",
          "basketTotalPrice" => "k-basket-total-price",
          "basketTotal" => "k-basket-total",
          "basketWrapper" => "k-basket-wrapper",
          "basketEmpty" => "k-basket-empty",
        ],
        "products" => $this->arResult["PRODUCT_DATA"],
        "basketTotal" => $this->arResult["BASKET_TOTAL"],
      ];
    }
    
    function getJSParams() {
      return $this->kJSParams;
    }
    
    function getExistsBasketItem($basket, $moduleId, $productId) {
      $result = false;
      if (!empty($productId) && (intval($productId) > 0) && (intval($productId) == $productId) && ($moduleId != '')) {
        foreach ($basket as $item) {
          if ($productId == $item->getProductId() && ($item->getField('MODULE') == $moduleId)) {
            $result = $item;
            break;
          }
        }
      }
      return $result;
    }
    
    function getElementLinkByID($id) {
      $elementDB = \Bitrix\Iblock\ElementTable::getList([
        "filter" => [
          "ID" => $id,
          "IBLOCK_ID" => self::IBLOCK_CATALOG_ID,
          "ACTIVE" => "Y"
        ],
        "select" => [
          "*",
          "DETAIL_PAGE_URL" => "IBLOCK.DETAIL_PAGE_URL"
        ]
      ]);
      if ($element = $elementDB->fetch()) {
        return CIBlock::ReplaceDetailUrl($element['DETAIL_PAGE_URL'], $element, false, 'E');
      }
      return false;
    }
    
    function getBasket() {
      $siteId = Bitrix\Main\Context::getCurrent()->getSite(); //для публичного раздела
      $fuser = \Bitrix\Sale\Fuser::getId(); //Идентификатор покупателя текущего пользователя
      return \Bitrix\Sale\Basket::loadItemsForFUser($fuser, $siteId); //по идентификатор покупателя
    }
    
    function changeProductQuantityAction($params) {
      $data = json_decode($params, true);
      $basket = $this->getBasket();
      $item = $this->getExistsBasketItem($basket, 'catalog', $data["id"]); //вернет false, если нет такого
      $item->setField('QUANTITY', $data["quantity"]);
      $basket->save();
      $this->setBasketData();
      $this->setJSParams();
      return json_encode($this->getJSParams());
    }
    
    function removeProductAction($id) {
      $basket = $this->getBasket();
      $item = $this->getExistsBasketItem($basket, 'catalog', $id); //вернет false, если нет такого
      $item->delete();
      $basket->save();
      $this->setBasketData();
      $this->setJSParams();
      return json_encode($this->getJSParams());
    }
    
    function removeAllProductAction() {
      $basket = $this->getBasket();
      CSaleBasket::DeleteAll(CSaleBasket::GetBasketUserID());
      $basket->save();
      $this->setBasketData();
      $this->setJSParams();
      return json_encode($this->getJSParams());
    }
    
    function refreshProductsAction() {
      $this->setBasketData();
      $this->setJSParams();
      return json_encode($this->getJSParams());
    }
    
  }
