<?php require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php'); ?>
<?php
  
  use Bitrix\Sale;
  
  Bitrix\Main\Loader::includeModule("sale");
  Bitrix\Main\Loader::includeModule("catalog");
  $basket = Sale\Basket::loadItemsForFUser(Sale\Fuser::getId(), Bitrix\Main\Context::getCurrent()->getSite());
  echo json_encode([
    "count" => count($basket->toArray()),
    "status" => true
  ]);
?>