<?php
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetTitle("");


?>
  <style>
    .shadow {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.45);
      display: block;
    }

    .top-shadow {
      position: absolute;
      width: 100%;
      height: 293px;
      top: 0;
      left: 0;
      opacity: 0.5;
      background: url("/bitrix/templates/concept_kraken_s1/images/shad.png") repeat-x top left;
      z-index: 0;
    }
  </style>


<!--  <div style="padding-top: 300px; position: relative;">-->
<!--    <div class="shadow">-->
<!--    </div>-->
<!--    <div class="top-shadow"></div>-->
<!---->
<!---->
<!--  </div>-->
<?php
//  if (file_exists($_SERVER['DOCUMENT_ROOT'] . '/include/k1-catalog-search.php')) {
//    include($_SERVER['DOCUMENT_ROOT'] . '/include/k1-catalog-search.php');
//  }
?>
  <div style="padding-bottom: 50px;">
    <div class="r-container">
      <?php
      global $arrFilter;
      $arrFilter = [];
      $res = [
        "LOGIC" => "OR"
      ];
      if ($_GET["tag"]) {
          $query = $_SERVER["QUERY_STRING"];
          $queriesArray = explode("&", $query);
          $tagsArray = [];
          foreach($queriesArray as $q) {
            $qArr = explode("=", $q);
            if ($qArr[0] === "tag") {
              $TAG = mb_strtoupper($qArr[1]);
              $propName = "%PROPERTY_TAG_$TAG";
              $res[] = [
                $propName => $_GET["q"],
              ];
            }
          }
      } else {
        $res[] = [
          "%PROPERTY_TAG_BRAND" => $_GET["q"],
        ];
        $res[] = [
          "%PROPERTY_TAG_SPARES" => $_GET["q"],
        ];
        $res[] = [
          "%PROPERTY_TAG_EQUIP" => $_GET["q"],
        ];
       
        
        
      }
      $res[] = [
        "%NAME" => $_GET["q"]
      ];
      $res[] = [
        "%PROPERTY_ARTICLE" => $_GET["q"],
      ];
//      echo '<pre>', print_r($res, true), '</pre>';
      $arrFilter[] = $res;
      $arrFilter["!SECTION_ID"] = 534;
      $arrFilter[">catalog_PRICE_1"] = 0;
//      echo '<pre>', print_r($arrFilter, true), '</pre>';
      ?>

      <?php
      $APPLICATION->IncludeComponent(
        "bitrix:catalog.section",
        "sections_new",
        array(
          "ACTION_VARIABLE" => "action",
          "ADD_PICT_PROP" => "-",
          "ADD_PROPERTIES_TO_BASKET" => "Y",
          "ADD_SECTIONS_CHAIN" => "N",
          "AJAX_MODE" => "N",
          "AJAX_OPTION_ADDITIONAL" => "",
          "AJAX_OPTION_HISTORY" => "N",
          "AJAX_OPTION_JUMP" => "N",
          "AJAX_OPTION_STYLE" => "Y",
          "BACKGROUND_IMAGE" => "-",
          "BASKET_URL" => "/personal/basket.php",
          "BROWSER_TITLE" => "-",
          "CACHE_FILTER" => "N",
          "CACHE_GROUPS" => "Y",
          "CACHE_TIME" => "36000000",
          "CACHE_TYPE" => "A",
          "COMPATIBLE_MODE" => "Y",
          "DETAIL_URL" => "",
          "DISABLE_INIT_JS_IN_COMPONENT" => "N",
          "DISPLAY_BOTTOM_PAGER" => "Y",
          "DISPLAY_COMPARE" => "N",
          "DISPLAY_TOP_PAGER" => "N",
          "ELEMENT_SORT_FIELD" => "sort",
          "ELEMENT_SORT_FIELD2" => "id",
          "ELEMENT_SORT_ORDER" => "asc",
          "ELEMENT_SORT_ORDER2" => "desc",
          "ENLARGE_PRODUCT" => "STRICT",
          "FILTER_NAME" => "arrFilter",
          "IBLOCK_ID" => CATALOG_IB,
          "IBLOCK_TYPE" => "concept_kraken_s1",
          "INCLUDE_SUBSECTIONS" => "Y",
          "LABEL_PROP" => array(),
          "LAZY_LOAD" => "N",
          "LINE_ELEMENT_COUNT" => "3",
          "LOAD_ON_SCROLL" => "N",
          "MESSAGE_404" => "",
          "MESS_BTN_ADD_TO_BASKET" => "В корзину",
          "MESS_BTN_BUY" => "Купить",
          "MESS_BTN_DETAIL" => "Подробнее",
          "MESS_BTN_LAZY_LOAD" => "Показать ещё",
          "MESS_BTN_SUBSCRIBE" => "Подписаться",
          "MESS_NOT_AVAILABLE" => "Нет в наличии",
          "MESS_NOT_AVAILABLE_SERVICE" => "Недоступно",
          "META_DESCRIPTION" => "-",
          "META_KEYWORDS" => "-",
          "OFFERS_LIMIT" => "5",
          "PAGER_BASE_LINK_ENABLE" => "N",
          "PAGER_DESC_NUMBERING" => "N",
          "PAGER_DESC_NUMBERING_CACHE_TIME" => "36000",
          "PAGER_SHOW_ALL" => "N",
          "PAGER_SHOW_ALWAYS" => "N",
          "PAGER_TEMPLATE" => "kraken_round",
          "PAGER_TITLE" => "Товары",
          "PAGE_ELEMENT_COUNT" => "20",
          "PARTIAL_PRODUCT_PROPERTIES" => "N",
          "PRICE_CODE" => array(
            0 => "BASE",
          ),
          "PRICE_VAT_INCLUDE" => "Y",
          "PRODUCT_BLOCKS_ORDER" => "price,props,sku,quantityLimit,quantity,buttons",
          "PRODUCT_ID_VARIABLE" => "id",
          "PRODUCT_PROPS_VARIABLE" => "prop",
          "PRODUCT_QUANTITY_VARIABLE" => "quantity",
          "PRODUCT_ROW_VARIANTS" => "[{'VARIANT':'2','BIG_DATA':false},{'VARIANT':'2','BIG_DATA':false},{'VARIANT':'2','BIG_DATA':false},{'VARIANT':'2','BIG_DATA':false},{'VARIANT':'2','BIG_DATA':false},{'VARIANT':'2','BIG_DATA':false}]",
          "RCM_PROD_ID" => $_REQUEST["PRODUCT_ID"],
          "RCM_TYPE" => "personal",
          "SECTION_CODE" => "",
          "SECTION_ID" => $_REQUEST["SECTION_ID"],
          "SECTION_ID_VARIABLE" => "SECTION_ID",
          "SECTION_URL" => "",
          "SECTION_USER_FIELDS" => array("", ""),
          "SEF_MODE" => "N",
          "SET_BROWSER_TITLE" => "Y",
          "SET_LAST_MODIFIED" => "N",
          "SET_META_DESCRIPTION" => "Y",
          "SET_META_KEYWORDS" => "Y",
          "SET_STATUS_404" => "N",
          "SET_TITLE" => "Y",
          "SHOW_404" => "N",
          "SHOW_ALL_WO_SECTION" => "N",
          "SHOW_FROM_SECTION" => "N",
          "SHOW_PRICE_COUNT" => "1",
          "SHOW_SLIDER" => "Y",
          "SLIDER_INTERVAL" => "3000",
          "SLIDER_PROGRESS" => "N",
          "TEMPLATE_THEME" => "blue",
          "USE_ENHANCED_ECOMMERCE" => "N",
          "USE_MAIN_ELEMENT_SECTION" => "N",
          "USE_PRICE_COUNT" => "N",
          "USE_PRODUCT_QUANTITY" => "N",
          "K_PRODUCT_ROW" => 4,
        )
      ); ?>
    </div>
  </div>
<?php

  $APPLICATION->SetTitle("Поиск");
  $APPLICATION->SetPageProperty("title", "Поиск");

?>
<?php require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>