<?php
  require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/prolog_before.php");
  \Bitrix\Main\Loader::includeModule('sale');
  use \Bitrix\Sale;
  $productID = $_POST["id"];
  $quantity = $_POST["quantity"];
  $method = $_POST["method"];
  
  
  if(!$productID && $method) die();
  
  $siteId = Bitrix\Main\Context::getCurrent()->getSite(); //для публичного раздела
  $fuser = \Bitrix\Sale\Fuser::getId(); //Идентификатор покупателя текущего пользователя
  $basket = \Bitrix\Sale\Basket::loadItemsForFUser($fuser, $siteId); //по идентификатор покупателя
  
  function GetExistsBasketItem($basket,$moduleId,$productId){
    $result = false;
    if(!empty($productId) && (intval($productId)>0) && (intval($productId)==$productId) && ($moduleId!='')){
      foreach ($basket as $item) {
        if($productId == $item->getProductId() && ($item->getField('MODULE') == $moduleId)){
          $result = $item;
          break;
        }
      }
    }
    return $result;
  }
  $item = GetExistsBasketItem($basket,'catalog',$productID); //вернет false, если нет такого
  switch ($method) {
    case "update":
      $item->setField('QUANTITY', $quantity);
      break;
    case "delete":
      $item->delete();
      break;
    case "deleteAll":
      CSaleBasket::DeleteAll(CSaleBasket::GetBasketUserID());
      break;
  }
  $basket->save();
  echo json_encode([
    "status" => true,
    "method" => $method
  ]);