<?php if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
  /** @var array $arParams */
  /** @var array $arResult */
  /** @global CMain $APPLICATION */
  /** @global CUser $USER */
  /** @global CDatabase $DB */
  /** @var CBitrixComponentTemplate $this */
  /** @var string $templateName */
  /** @var string $templateFile */
  /** @var string $templateFolder */
  /** @var string $componentPath */
  
  /** @var CBitrixComponent $component */
  
  use Bitrix\Main\Loader;
  use Bitrix\Main\ModuleManager;
  
  $this->setFrameMode(true);
  
  $arSelect = array("ID", "NAME", "PICTURE", "GLOBAL_ACTIVE", "ACTIVE", "DETAIL_PICTURE", "IBLOCK_SECTION_ID", "UF_*");
  $arFilter = array('IBLOCK_ID' => $arParams["IBLOCK_ID"], "CODE" => $arResult["VARIABLES"]["SECTION_CODE"]);
  $db_list = CIBlockSection::GetList(array(), $arFilter, false, $arSelect);
  $ar_result = $db_list->GetNext();
  
  
  if ($ar_result["ACTIVE"] == "N" || $ar_result["GLOBAL_ACTIVE"] == "N") {
    
    if (!defined("ERROR_404"))
      define("ERROR_404", "Y");
    
    \CHTTP::setStatus("404 Not Found");
    
    if ($APPLICATION->RestartWorkarea()) {
      require(\Bitrix\Main\Application::getDocumentRoot() . "/404.php");
      die();
    }
  }
  
  
  if (strlen($ar_result["UF_KRAKEN_CTLG_TMPL"]) > 0) {
    $ar_result["UF_KRAKEN_CTLG_TMPL_ENUM"] = CUserFieldEnum::GetList(array(), array(
      "ID" => $ar_result["UF_KRAKEN_CTLG_TMPL"],
    ))->GetNext();
  }
  
  if (strlen($ar_result["UF_KRAKEN_CTLG_TMPL_ENUM"]["XML_ID"]) <= 0)
    $ar_result["UF_KRAKEN_CTLG_TMPL_ENUM"]["XML_ID"] = "default";
  
  
  if (strlen($ar_result["UF_KRAKEN_BNRS_VIEW"]) > 0) {
    $ar_result["UF_KRAKEN_BNRS_VIEW_ENUM"] = CUserFieldEnum::GetList(array(), array(
      "ID" => $ar_result["UF_KRAKEN_BNRS_VIEW"],
    ))->GetNext();
  } else
    $ar_result["UF_KRAKEN_BNRS_VIEW_ENUM"]["XML_ID"] = "none";
  
  
  if (strlen($ar_result["UF_EMPL_BANNER_TYPE"]) > 0) {
    $ar_result["UF_EMPL_BANNER_TYPE_ENUM"] = CUserFieldEnum::GetList(array(), array(
      "ID" => $ar_result["UF_EMPL_BANNER_TYPE"],
    ))->GetNext();
  } else
    $ar_result["UF_EMPL_BANNER_TYPE_ENUM"]["XML_ID"] = "none";
  
  
  if (strlen($ar_result["UF_KRAKEN_CTLG_TXT_P"]) > 0) {
    $ar_result["UF_KRAKEN_CTLG_TXT_P_ENUM"] = CUserFieldEnum::GetList(array(), array(
      "ID" => $ar_result["UF_KRAKEN_CTLG_TXT_P"],
    ))->GetNext();
  }
  
  if (strlen($ar_result["UF_KRAKEN_CTLG_TXT_P_ENUM"]["XML_ID"]) <= 0)
    $ar_result["UF_KRAKEN_CTLG_TXT_P_ENUM"]["XML_ID"] = "short";
  
  
  $header_back = "";
  
  if ($ar_result["DETAIL_PICTURE"] > 0) {
    $img = CFile::ResizeImageGet($ar_result["DETAIL_PICTURE"], array('width' => 2560, 'height' => 1500), BX_RESIZE_IMAGE_PROPORTIONAL, false);
    $header_back = $img["src"];
  }
  
  
  $arResult["BANNERS_LEFT"] = array();
  
  if (!empty($ar_result["UF_KRAKEN_CTLG_BNNRS"]) && $ar_result["UF_KRAKEN_BNRS_VIEW_ENUM"]["XML_ID"] == "own")
    $arResult["BANNERS_LEFT"] = $ar_result["UF_KRAKEN_CTLG_BNNRS"];
  
  
  $arResult["EMPL_BANNER"] = array();
  
  if (!empty($ar_result["UF_EMPL_BANNER"]) && $ar_result["UF_EMPL_BANNER_TYPE_ENUM"]["XML_ID"] == "own")
    $arResult["EMPL_BANNER"] = $ar_result["UF_EMPL_BANNER"];
  
  
  $parent_section_id = $ar_result["IBLOCK_SECTION_ID"];
  
  while ($parent_section_id != 0) {
    $arSelect = array("ID", "DETAIL_PICTURE", "IBLOCK_SECTION_ID", "UF_*");
    $arFilter = array("IBLOCK_ID" => $arParams["IBLOCK_ID"], "ACTIVE" => "Y", "GLOBAL_ACTIVE" => "Y", "ID" => $parent_section_id);
    $db_list = CIBlockSection::GetList(array(), $arFilter, false, $arSelect);
    
    while ($ar_res = $db_list->GetNext()) {
      
      
      if ($ar_result["UF_KRAKEN_BNRS_VIEW_ENUM"]["XML_ID"] == "parent") {
        if (empty($arResult["BANNERS_LEFT"]))
          $arResult["BANNERS_LEFT"] = $ar_res["UF_KRAKEN_CTLG_BNNRS"];
      }
      
      if ($ar_result["UF_EMPL_BANNER_TYPE_ENUM"]["XML_ID"] == "parent") {
        if (empty($arResult["UF_EMPL_BANNER"]))
          $arResult["EMPL_BANNER"] = $ar_res["UF_EMPL_BANNER"];
      }
      
      
      if (strlen($header_back) <= 0) {
        if ($ar_res["DETAIL_PICTURE"] > 0) {
          $img = CFile::ResizeImageGet($ar_res["DETAIL_PICTURE"], array('width' => 2560, 'height' => 1500), BX_RESIZE_IMAGE_PROPORTIONAL, false);
          $header_back = $img["src"];
        }
      }
      
      
      $parent_section_id = $ar_res["IBLOCK_SECTION_ID"];
      
      
    }
    
  }
  
  global $KRAKEN_TEMPLATE_ARRAY;
  
  
  if (strlen($header_back) <= 0 && $KRAKEN_TEMPLATE_ARRAY["CTLG_BG_PIC"]["VALUE"] > 0) {
    $img = CFile::ResizeImageGet($KRAKEN_TEMPLATE_ARRAY["CTLG_BG_PIC"]["VALUE"], array('width' => 2560, 'height' => 1500), BX_RESIZE_IMAGE_PROPORTIONAL, false);
    $header_back = $img["src"];
  }

?>


<?php $GLOBALS["KRAKEN_CURRENT_PAGE"] = "catalog"; ?>
<?php $GLOBALS["KRAKEN_CURRENT_DIR"] = "section"; ?>
<?php $GLOBALS["KRAKEN_CURRENT_SECTION_ID"] = $ar_result["ID"]; ?>
<?php $GLOBALS["KRAKEN_CURRENT_TMPL"] = $ar_result["UF_KRAKEN_CTLG_TMPL_ENUM"]["XML_ID"]; ?>


<?php //if ($ar_result["UF_KRAKEN_CTLG_TMPL_ENUM"]["XML_ID"] == "default"): ?>
<?php
  $GLOBALS["IS_CONSTRUCTOR"] = false;
  $html = "";


//  if ($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["CATALOG_USE_FILTER"]["VALUE"]['ACTIVE'] == "Y" && !$ar_result["UF_HIDE_SUBSECTIONS"] && !$ar_result["UF_USE_FILTER"]) {
  $GLOBALS["arrCatalogPreFilter"]["SECTION_ACTIVE"] = "Y";
  $GLOBALS["arrCatalogPreFilter"]["SECTION_SCOPE"] = "IBLOCK";
  
  ob_start();
  
  $tabFilter = "";
  
  if (!isset($_COOKIE[$domenUrlForCookie . "_catalog_tab_catalog_filter" . SITE_ID])) {
    if ($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["CATALOG_FILTER_SHOW"]["VALUE"]['ACTIVE'] == 'Y')
      $tabFilter = "active";
    else
      $tabFilter = "noactive";
  } else
    $tabFilter = $_COOKIE[$domenUrlForCookie . "_catalog_tab_catalog_filter" . SITE_ID];
  
  
  $APPLICATION->IncludeComponent(
    "bitrix:catalog.smart.filter",
    "main",
    array(
      "DATA_SHOW" => "catalog_filter",
      "TAB" => $tabFilter,
      "FILTER_NAME" => "arrCatalogFilter",
      "PREFILTER_NAME" => "arrCatalogPreFilter",
      "CACHE_GROUPS" => "Y",
      "CACHE_TIME" => "36000000",
      "CACHE_TYPE" => "A",
      "COMPOSITE_FRAME_MODE" => "N",
      "COMPOSITE_FRAME_TYPE" => "AUTO",
      "DISPLAY_ELEMENT_COUNT" => "Y",
      "FILTER_VIEW_MODE" => "vertical",
      "IBLOCK_ID" => $arParams["IBLOCK_ID"],
      "IBLOCK_TYPE" => $arParams["IBLOCK_TYPE"],
      "PAGER_PARAMS_NAME" => "arrPager",
      "POPUP_POSITION" => "left",
      "SAVE_IN_SESSION" => "N",
      "SECTION_CODE" => "",
      "SECTION_CODE_PATH" => "",
      "SECTION_DESCRIPTION" => "-",
      "SECTION_ID" => $ar_result["ID"],
      "SECTION_TITLE" => "-",
      "SEF_MODE" => "Y",
      "SEF_RULE" => $arResult["FOLDER"] . $arResult["URL_TEMPLATES"]["smart_filter"],
      "SMART_FILTER_PATH" => $arResult["VARIABLES"]["SMART_FILTER_PATH"],
      "TEMPLATE_THEME" => "blue",
      "XML_EXPORT" => "N"
    ),
    $component
  );
  
  
  $html = ob_get_clean();

//  }
  
  $APPLICATION->AddViewContent('filter_content', $html);

?>
<?php if ($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["HEAD_BG_XS_FOR_PAGES_MODE"]["VALUE"] == "custom" && strlen($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["HEAD_BG_XS_FOR_PAGES"]["SRC"]) > 0): ?>
  <style>
    @media (max-width: 767.98px) {
      div.header-page {
        background-image: url('<?=$KRAKEN_TEMPLATE_ARRAY["ITEMS"]["HEAD_BG_XS_FOR_PAGES"]["SRC"]?>') !important;
      }
    }
  </style>
<?php endif; ?>
<?php

//  if (file_exists($_SERVER['DOCUMENT_ROOT'] . '/include/k1-catalog-search.php')) {
//    include($_SERVER['DOCUMENT_ROOT'] . '/include/k1-catalog-search.php');
//  }
  
  $title = "";
  global $typeFilter;
  $typeFilter = [];
  if ($_GET["pr"]) {
    $typeFilter[] = ["PROPERTY_PRODUCT_TYPE" => $_GET["pr"]];
    $title .= " / " . $_GET["pr"];
  }
  if ($_GET["wp"]) {
    $typeFilter[] = ["PROPERTY_WEAPON_TYPE" => $_GET["wp"]];
    $title .= " / " . $_GET["wp"];
  }

?>
  <div class="r-catalog-top">
    <h1><?php $APPLICATION->ShowTitle(false); ?> <?= $title ?></h1>
    <?php
      $APPLICATION->ShowViewContent('element_filters');
    ?>
  </div>
  <div class="catalog-list-wrap k1-catalog-list-wrap page_pad_bot">
    <div class="">
      <div class=" clearfix">
        <?php /* ?>
        <div class="col-md-3 col-xs-12 wr-side-inner">
          <div class="side-inner">
            
            
            <?php // if ($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["CATALOG_SORT_LEFT_SIDE"]["VALUE"] === 'filter'): ?>
            
            <?php  $APPLICATION->ShowViewContent('filter_content'); ?>
            
            <div class="hidden-sm hidden-xs">
              
              <?php
                if ($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["CATALOG_TAB_SECTIONS_SHOW"]["VALUE"]['ACTIVE'] == 'Y')
                  $tab = "active";
                else
                  $tab = "noactive";
              
              ?>
              
              <?php $APPLICATION->IncludeComponent(
                "bitrix:catalog.section.list",
                "mainsections",
                array(
                  "TAB" => $tab,
                  "IBLOCK_TYPE" => $arParams["IBLOCK_TYPE"],
                  "IBLOCK_ID" => $arParams["IBLOCK_ID"],
                  "SECTION_ID" => $ar_result["IBLOCK_SECTION_ID"],
                  "SECTION_CODE" => "",
                  "CACHE_TYPE" => $arParams["CACHE_TYPE"],
                  "CACHE_TIME" => $arParams["CACHE_TIME"],
                  "CACHE_GROUPS" => $arParams["CACHE_GROUPS"],
                  "COUNT_ELEMENTS" => $arParams["SECTION_COUNT_ELEMENTS"],
                  "TOP_DEPTH" => 1,
                  "SECTION_URL" => $arResult["FOLDER"] . $arResult["URL_TEMPLATES"]["section"],
                  "VIEW_MODE" => $arParams["SECTIONS_VIEW_MODE"],
                  "SHOW_PARENT_NAME" => $arParams["SECTIONS_SHOW_PARENT_NAME"],
                  "HIDE_SECTION_NAME" => (isset($arParams["SECTIONS_HIDE_SECTION_NAME"]) ? $arParams["SECTIONS_HIDE_SECTION_NAME"] : "N"),
                  "ADD_SECTIONS_CHAIN" => "N",
                  "COMPOSITE_FRAME_MODE" => "N",
                ),
                $component,
                array("HIDE_ICONS" => "Y")
              );
              ?>
            
            </div>
            <?php */ ?>
        <?php /* else: ?>
              
              <div class="hidden-sm hidden-xs">
                
                <?php
                  if ($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["CATALOG_TAB_SECTIONS_SHOW"]["VALUE"]['ACTIVE'] == 'Y')
                    $tab = "active";
                  else
                    $tab = "noactive";
                
                ?>
                
                <?php $APPLICATION->IncludeComponent(
                  "bitrix:catalog.section.list",
                  "mainsections",
                  array(
                    "TAB" => $tab,
                    "IBLOCK_TYPE" => $arParams["IBLOCK_TYPE"],
                    "IBLOCK_ID" => $arParams["IBLOCK_ID"],
                    "SECTION_ID" => $ar_result["IBLOCK_SECTION_ID"],
                    "SECTION_CODE" => "",
                    "CACHE_TYPE" => $arParams["CACHE_TYPE"],
                    "CACHE_TIME" => $arParams["CACHE_TIME"],
                    "CACHE_GROUPS" => $arParams["CACHE_GROUPS"],
                    "COUNT_ELEMENTS" => $arParams["SECTION_COUNT_ELEMENTS"],
                    "TOP_DEPTH" => 1,
                    "SECTION_URL" => $arResult["FOLDER"] . $arResult["URL_TEMPLATES"]["section"],
                    "VIEW_MODE" => $arParams["SECTIONS_VIEW_MODE"],
                    "SHOW_PARENT_NAME" => $arParams["SECTIONS_SHOW_PARENT_NAME"],
                    "HIDE_SECTION_NAME" => (isset($arParams["SECTIONS_HIDE_SECTION_NAME"]) ? $arParams["SECTIONS_HIDE_SECTION_NAME"] : "N"),
                    "ADD_SECTIONS_CHAIN" => "N",
                    "COMPOSITE_FRAME_MODE" => "N",
                  ),
                  $component,
                  array("HIDE_ICONS" => "Y")
                );
                ?>
                
                <?php // $APPLICATION->ShowViewContent('filter_content'); ?>
              </div>
            
            <?php endif; */ ?>
        <?php /* ?>
            <div class="hidden-sm hidden-xs">
              
              <?php if (!empty($arResult["EMPL_BANNER"]) > 0): ?>
                
                <?php
//                $APPLICATION->IncludeComponent(
//                  "concept:kraken.news-list",
//                  "empl",
//                  array(
//                    "COMPOSITE_FRAME_MODE" => "N",
//                    "ELEMENTS_ID" => $arResult["EMPL_BANNER"],
//                    "VIEW" => "flat-banner",
//                    "COLS" => "col-xs-12",
//                    "SORT_BY1" => "SORT",
//                    "SORT_ORDER1" => "ASC",
//                  ),
//                  $component
//                );
                ?>
              
              <?php endif; ?>
              
              
              <?php if (!empty($arResult["BANNERS_LEFT"]) > 0): ?>
                
                <?php $GLOBALS["arrBannersFilter"]["ID"] = $arResult["BANNERS_LEFT"]; ?>
                
                <?php CKraken::getIblockIDs(array("SITE_ID" => SITE_ID, "CODES" => array("concept_kraken_site_banners_" . SITE_ID))); ?>
                
                <?php $APPLICATION->IncludeComponent(
                  "bitrix:news.list",
                  "banners-left",
                  array(
                    "COMPONENT_TEMPLATE" => "banners-left",
                    "IBLOCK_TYPE" => $KRAKEN_TEMPLATE_ARRAY['BANNERS']["IBLOCK_TYPE"],
                    "IBLOCK_ID" => $KRAKEN_TEMPLATE_ARRAY['BANNERS']["IBLOCK_ID"],
                    "NEWS_COUNT" => "20",
                    "SORT_BY1" => "SORT",
                    "SORT_ORDER1" => "ASC",
                    "SORT_BY2" => "SORT",
                    "SORT_ORDER2" => "ASC",
                    "FILTER_NAME" => "arrBannersFilter",
                    "FIELD_CODE" => array(
                      0 => "DETAIL_PICTURE",
                      1 => "PREVIEW_PICTURE",
                    ),
                    "PROPERTY_CODE" => array(
                      0 => "",
                      1 => "BANNER_BTN_TYPE",
                      2 => "BANNER_ACTION_ALL_WRAP",
                      3 => "BANNER_USER_BG_COLOR",
                      4 => "BANNER_UPTITLE",
                      5 => "BANNER_BTN_NAME",
                      6 => "BANNER_TITLE",
                      7 => "BANNER_BTN_BLANK",
                      8 => "BANNER_BORDER",
                      9 => "BANNER_DESC",
                      10 => "BANNER_TEXT",
                      11 => "BANNER_LINK",
                      12 => "BANNER_COLOR_TEXT",
                      13 => "",
                    ),
                    "CHECK_DATES" => "Y",
                    "DETAIL_URL" => "",
                    "AJAX_MODE" => "N",
                    "AJAX_OPTION_JUMP" => "N",
                    "AJAX_OPTION_STYLE" => "Y",
                    "AJAX_OPTION_HISTORY" => "N",
                    "AJAX_OPTION_ADDITIONAL" => "",
                    "CACHE_TYPE" => "A",
                    "CACHE_TIME" => "36000000",
                    "CACHE_FILTER" => "Y",
                    "CACHE_GROUPS" => "Y",
                    "PREVIEW_TRUNCATE_LEN" => "",
                    "ACTIVE_DATE_FORMAT" => "d.m.Y",
                    "SET_TITLE" => "N",
                    "SET_BROWSER_TITLE" => "N",
                    "SET_META_KEYWORDS" => "N",
                    "SET_META_DESCRIPTION" => "N",
                    "SET_LAST_MODIFIED" => "N",
                    "INCLUDE_IBLOCK_INTO_CHAIN" => "N",
                    "ADD_SECTIONS_CHAIN" => "N",
                    "HIDE_LINK_WHEN_NO_DETAIL" => "N",
                    "PARENT_SECTION" => "",
                    "PARENT_SECTION_CODE" => "",
                    "INCLUDE_SUBSECTIONS" => "N",
                    "STRICT_SECTION_CHECK" => "N",
                    "DISPLAY_DATE" => "N",
                    "DISPLAY_NAME" => "N",
                    "DISPLAY_PICTURE" => "N",
                    "DISPLAY_PREVIEW_TEXT" => "N",
                    "COMPOSITE_FRAME_MODE" => "N",
                    "COMPOSITE_FRAME_TYPE" => "AUTO",
                    "PAGER_TEMPLATE" => ".default",
                    "DISPLAY_TOP_PAGER" => "N",
                    "DISPLAY_BOTTOM_PAGER" => "N",
                    "PAGER_TITLE" => "",
                    "PAGER_SHOW_ALWAYS" => "N",
                    "PAGER_DESC_NUMBERING" => "N",
                    "PAGER_DESC_NUMBERING_CACHE_TIME" => "36000",
                    "PAGER_SHOW_ALL" => "N",
                    "PAGER_BASE_LINK_ENABLE" => "N",
                    "SET_STATUS_404" => "N",
                    "SHOW_404" => "N",
                    "MESSAGE_404" => ""
                  ),
                  $component
                ); ?>
              
              <?php endif; ?>
            
            </div>
          
          </div>
        </div>
        <?php */ ?>
        <div class="content-inner page">
          <div class="block small">
            <?php /*
              $APPLICATION->ShowViewContent('catalog-top-desc'); ?>
            <?php $APPLICATION->IncludeComponent(
              "bitrix:catalog.section.list",
              "subsections",
              array(
                "IBLOCK_TYPE" => $arParams["IBLOCK_TYPE"],
                "IBLOCK_ID" => $arParams["IBLOCK_ID"],
                "SECTION_ID" => $arResult["VARIABLES"]["SECTION_ID"],
                "SECTION_CODE" => $arResult["VARIABLES"]["SECTION_CODE"],
                "CACHE_TYPE" => $arParams["CACHE_TYPE"],
                "CACHE_TIME" => $arParams["CACHE_TIME"],
                "CACHE_GROUPS" => $arParams["CACHE_GROUPS"],
                "COUNT_ELEMENTS" => $arParams["SECTION_COUNT_ELEMENTS"],
                "TOP_DEPTH" => 1,
                "SECTION_URL" => $arResult["FOLDER"] . $arResult["URL_TEMPLATES"]["section"],
                "VIEW_MODE" => $arParams["SECTIONS_VIEW_MODE"],
                "SHOW_PARENT_NAME" => $arParams["SECTIONS_SHOW_PARENT_NAME"],
                "HIDE_SECTION_NAME" => (isset($arParams["SECTIONS_HIDE_SECTION_NAME"]) ? $arParams["SECTIONS_HIDE_SECTION_NAME"] : "N"),
                "ADD_SECTIONS_CHAIN" => "N"
              ),
              $component,
              array("HIDE_ICONS" => "Y")
            );
            */ ?>
            <div class="element-list-wrap" id="actionbox">
              <?php
                //                if (!$ar_result["UF_HIDE_SUBSECTIONS"])
                //                  include("sort.php");
                $GLOBALS["arrCatalogFilter"]["SECTION_ACTIVE"] = "Y";
                $GLOBALS["arrCatalogFilter"]["SECTION_SCOPE"] = "IBLOCK";
              
              ?>
              
              
              <?php
                $sectionID = (int)$arResult["VARIABLES"]["SECTION_ID"] ?: $arResult["VARIABLES"]["SECTION_CODE"];
                global $GOATID, $GOATFilter, $articleData, $typeFilter;
                $GOATID = getGOATProduct($sectionID);
                $articleData = getArticleData($sectionID);
                $elementCount = 24;
                if ($GOATID) {
                  $GOATFilter = [
                    "ID" => $GOATID
                  ];
//                  $elementCount -= 1;
                }
                if ($articleData) {
//                  $elementCount -= 1;
                }
                $typeFilter["!SECTION_ID"] = 534;
                $typeFilter[">catalog_PRICE_1"] = 0;
                $intSectionID = $APPLICATION->IncludeComponent(
                  "bitrix:catalog.section",
                  "sections_new",
                  array(
                    "SEARCH_CHECK_DATES" => $arParams["SEARCH_CHECK_DATES"],
                    "SHOW_DEACTIVATED" => $arParams["SHOW_DEACTIVATED"],
//                  "FROM" => "section",
                    "IBLOCK_TYPE" => $arParams["IBLOCK_TYPE"],
                    "IBLOCK_ID" => $arParams["IBLOCK_ID"],
                    "ELEMENT_SORT_FIELD" => "ID",
                    "ELEMENT_SORT_ORDER" => "ASC",
                    "ELEMENT_SORT_FIELD2" => "NAME",
                    "ELEMENT_SORT_ORDER2" => "ASC",
//                  "ELEMENT_SORT_FIELD" => $sort1,
//                  "ELEMENT_SORT_ORDER" => $sort_order1,
//                  "ELEMENT_SORT_FIELD2" => $sort2,
//                  "ELEMENT_SORT_ORDER2" => $sort_order2,
                    "PROPERTY_CODE" => $arParams["LIST_PROPERTY_CODE"],
                    "PROPERTY_CODE_MOBILE" => $arParams["LIST_PROPERTY_CODE_MOBILE"],
                    "META_KEYWORDS" => $arParams["LIST_META_KEYWORDS"],
                    "META_DESCRIPTION" => $arParams["LIST_META_DESCRIPTION"],
                    "BROWSER_TITLE" => $arParams["LIST_BROWSER_TITLE"],
                    "SET_LAST_MODIFIED" => $arParams["SET_LAST_MODIFIED"],
                    "INCLUDE_SUBSECTIONS" => "A",
//                  "INCLUDE_SUBSECTIONS" => ($ar_result["UF_HIDE_SUBSECTIONS"]) ? "N" : "A",
                    "BASKET_URL" => $arParams["BASKET_URL"],
                    "ACTION_VARIABLE" => $arParams["ACTION_VARIABLE"],
                    "PRODUCT_ID_VARIABLE" => $arParams["PRODUCT_ID_VARIABLE"],
                    "SECTION_ID_VARIABLE" => $arParams["SECTION_ID_VARIABLE"],
                    "PRODUCT_QUANTITY_VARIABLE" => $arParams["PRODUCT_QUANTITY_VARIABLE"],
                    "PRODUCT_PROPS_VARIABLE" => $arParams["PRODUCT_PROPS_VARIABLE"],
                    "FILTER_NAME" => "typeFilter",
                    "CACHE_TYPE" => $arParams["CACHE_TYPE"],
                    "CACHE_TIME" => $arParams["CACHE_TIME"],
                    "CACHE_FILTER" => $arParams["CACHE_FILTER"],
                    "CACHE_GROUPS" => $arParams["CACHE_GROUPS"],
                    "SET_TITLE" => $arParams["SET_TITLE"],
                    "MESSAGE_404" => $arParams["~MESSAGE_404"],
                    "SET_STATUS_404" => $arParams["SET_STATUS_404"],
                    "SHOW_404" => $arParams["SHOW_404"],
                    "FILE_404" => $arParams["FILE_404"],
                    "DISPLAY_COMPARE" => $arParams["USE_COMPARE"],
                    "PAGE_ELEMENT_COUNT" => $elementCount,
                    "LINE_ELEMENT_COUNT" => $arParams["LINE_ELEMENT_COUNT"],
                    "PRICE_CODE" => $arParams["PRICE_CODE"],
                    "USE_PRICE_COUNT" => $arParams["USE_PRICE_COUNT"],
                    "SHOW_PRICE_COUNT" => $arParams["SHOW_PRICE_COUNT"],
                    
                    "PRICE_VAT_INCLUDE" => $arParams["PRICE_VAT_INCLUDE"],
                    "USE_PRODUCT_QUANTITY" => $arParams['USE_PRODUCT_QUANTITY'],
                    "ADD_PROPERTIES_TO_BASKET" => (isset($arParams["ADD_PROPERTIES_TO_BASKET"]) ? $arParams["ADD_PROPERTIES_TO_BASKET"] : ''),
                    "PARTIAL_PRODUCT_PROPERTIES" => (isset($arParams["PARTIAL_PRODUCT_PROPERTIES"]) ? $arParams["PARTIAL_PRODUCT_PROPERTIES"] : ''),
                    "PRODUCT_PROPERTIES" => $arParams["PRODUCT_PROPERTIES"],
                    
                    "DISPLAY_TOP_PAGER" => $arParams["DISPLAY_TOP_PAGER"],
                    "DISPLAY_BOTTOM_PAGER" => $arParams["DISPLAY_BOTTOM_PAGER"],
                    "PAGER_TITLE" => $arParams["PAGER_TITLE"],
                    "PAGER_SHOW_ALWAYS" => $arParams["PAGER_SHOW_ALWAYS"],
                    "PAGER_TEMPLATE" => $arParams["PAGER_TEMPLATE"],
                    "PAGER_DESC_NUMBERING" => $arParams["PAGER_DESC_NUMBERING"],
                    "PAGER_DESC_NUMBERING_CACHE_TIME" => $arParams["PAGER_DESC_NUMBERING_CACHE_TIME"],
                    "PAGER_SHOW_ALL" => $arParams["PAGER_SHOW_ALL"],
                    "PAGER_BASE_LINK_ENABLE" => $arParams["PAGER_BASE_LINK_ENABLE"],
                    "PAGER_BASE_LINK" => $arParams["PAGER_BASE_LINK"],
                    "PAGER_PARAMS_NAME" => $arParams["PAGER_PARAMS_NAME"],
                    "LAZY_LOAD" => $arParams["LAZY_LOAD"],
                    "MESS_BTN_LAZY_LOAD" => $arParams["~MESS_BTN_LAZY_LOAD"],
                    "LOAD_ON_SCROLL" => $arParams["LOAD_ON_SCROLL"],
                    
                    "OFFERS_CART_PROPERTIES" => $arParams["OFFERS_CART_PROPERTIES"],
                    "OFFERS_FIELD_CODE" => $arParams["LIST_OFFERS_FIELD_CODE"],
                    "OFFERS_PROPERTY_CODE" => $arParams["LIST_OFFERS_PROPERTY_CODE"],
                    "OFFERS_SORT_FIELD" => $arParams["OFFERS_SORT_FIELD"],
                    "OFFERS_SORT_ORDER" => $arParams["OFFERS_SORT_ORDER"],
                    "OFFERS_SORT_FIELD2" => $arParams["OFFERS_SORT_FIELD2"],
                    "OFFERS_SORT_ORDER2" => $arParams["OFFERS_SORT_ORDER2"],
                    "OFFERS_LIMIT" => $arParams["LIST_OFFERS_LIMIT"],
                    
                    "SECTION_ID" => $arResult["VARIABLES"]["SECTION_ID"],
                    "SECTION_CODE" => $_GET["st"] ?: $arResult["VARIABLES"]["SECTION_CODE"],
                    "SECTION_URL" => $arResult["FOLDER"] . $arResult["URL_TEMPLATES"]["section"],
                    "DETAIL_URL" => $arResult["FOLDER"] . $arResult["URL_TEMPLATES"]["element"],
                    "USE_MAIN_ELEMENT_SECTION" => $arParams["USE_MAIN_ELEMENT_SECTION"],
                    'CONVERT_CURRENCY' => $arParams['CONVERT_CURRENCY'],
                    'CURRENCY_ID' => $arParams['CURRENCY_ID'],
                    'HIDE_NOT_AVAILABLE' => $arParams["HIDE_NOT_AVAILABLE"],
                    'HIDE_NOT_AVAILABLE_OFFERS' => $arParams["HIDE_NOT_AVAILABLE_OFFERS"],
                    
                    'LABEL_PROP' => $arParams['LABEL_PROP'],
                    'LABEL_PROP_MOBILE' => $arParams['LABEL_PROP_MOBILE'],
                    'LABEL_PROP_POSITION' => $arParams['LABEL_PROP_POSITION'],
                    'ADD_PICT_PROP' => $arParams['ADD_PICT_PROP'],
                    'PRODUCT_DISPLAY_MODE' => $arParams['PRODUCT_DISPLAY_MODE'],
                    'PRODUCT_BLOCKS_ORDER' => $arParams['LIST_PRODUCT_BLOCKS_ORDER'],
                    'PRODUCT_ROW_VARIANTS' => $arParams['LIST_PRODUCT_ROW_VARIANTS'],
                    'ENLARGE_PRODUCT' => $arParams['LIST_ENLARGE_PRODUCT'],
                    'ENLARGE_PROP' => isset($arParams['LIST_ENLARGE_PROP']) ? $arParams['LIST_ENLARGE_PROP'] : '',
                    'SHOW_SLIDER' => $arParams['LIST_SHOW_SLIDER'],
                    'SLIDER_INTERVAL' => isset($arParams['LIST_SLIDER_INTERVAL']) ? $arParams['LIST_SLIDER_INTERVAL'] : '',
                    'SLIDER_PROGRESS' => isset($arParams['LIST_SLIDER_PROGRESS']) ? $arParams['LIST_SLIDER_PROGRESS'] : '',
                    
                    'OFFER_ADD_PICT_PROP' => $arParams['OFFER_ADD_PICT_PROP'],
                    'OFFER_TREE_PROPS' => $arParams['OFFER_TREE_PROPS'],
                    'PRODUCT_SUBSCRIPTION' => $arParams['PRODUCT_SUBSCRIPTION'],
                    'SHOW_DISCOUNT_PERCENT' => $arParams['SHOW_DISCOUNT_PERCENT'],
                    'DISCOUNT_PERCENT_POSITION' => $arParams['DISCOUNT_PERCENT_POSITION'],
                    'SHOW_OLD_PRICE' => $arParams['SHOW_OLD_PRICE'],
                    'SHOW_MAX_QUANTITY' => $arParams['SHOW_MAX_QUANTITY'],
                    'MESS_SHOW_MAX_QUANTITY' => (isset($arParams['~MESS_SHOW_MAX_QUANTITY']) ? $arParams['~MESS_SHOW_MAX_QUANTITY'] : ''),
                    'RELATIVE_QUANTITY_FACTOR' => (isset($arParams['RELATIVE_QUANTITY_FACTOR']) ? $arParams['RELATIVE_QUANTITY_FACTOR'] : ''),
                    'MESS_RELATIVE_QUANTITY_MANY' => (isset($arParams['~MESS_RELATIVE_QUANTITY_MANY']) ? $arParams['~MESS_RELATIVE_QUANTITY_MANY'] : ''),
                    'MESS_RELATIVE_QUANTITY_FEW' => (isset($arParams['~MESS_RELATIVE_QUANTITY_FEW']) ? $arParams['~MESS_RELATIVE_QUANTITY_FEW'] : ''),
                    'MESS_BTN_BUY' => (isset($arParams['~MESS_BTN_BUY']) ? $arParams['~MESS_BTN_BUY'] : ''),
                    'MESS_BTN_ADD_TO_BASKET' => (isset($arParams['~MESS_BTN_ADD_TO_BASKET']) ? $arParams['~MESS_BTN_ADD_TO_BASKET'] : ''),
                    'MESS_BTN_SUBSCRIBE' => (isset($arParams['~MESS_BTN_SUBSCRIBE']) ? $arParams['~MESS_BTN_SUBSCRIBE'] : ''),
                    'MESS_BTN_DETAIL' => (isset($arParams['~MESS_BTN_DETAIL']) ? $arParams['~MESS_BTN_DETAIL'] : ''),
                    'MESS_NOT_AVAILABLE' => (isset($arParams['~MESS_NOT_AVAILABLE']) ? $arParams['~MESS_NOT_AVAILABLE'] : ''),
                    'MESS_BTN_COMPARE' => (isset($arParams['~MESS_BTN_COMPARE']) ? $arParams['~MESS_BTN_COMPARE'] : ''),
                    
                    'USE_ENHANCED_ECOMMERCE' => (isset($arParams['USE_ENHANCED_ECOMMERCE']) ? $arParams['USE_ENHANCED_ECOMMERCE'] : ''),
                    'DATA_LAYER_NAME' => (isset($arParams['DATA_LAYER_NAME']) ? $arParams['DATA_LAYER_NAME'] : ''),
                    'BRAND_PROPERTY' => (isset($arParams['BRAND_PROPERTY']) ? $arParams['BRAND_PROPERTY'] : ''),
                    
                    'TEMPLATE_THEME' => (isset($arParams['TEMPLATE_THEME']) ? $arParams['TEMPLATE_THEME'] : ''),
                    "ADD_SECTIONS_CHAIN" => "Y",
                    'ADD_TO_BASKET_ACTION' => "/basket",
//                  'ADD_TO_BASKET_ACTION' => $basketAction,
                    'SHOW_CLOSE_POPUP' => isset($arParams['COMMON_SHOW_CLOSE_POPUP']) ? $arParams['COMMON_SHOW_CLOSE_POPUP'] : '',
                    'COMPARE_PATH' => $arResult['FOLDER'] . $arResult['URL_TEMPLATES']['compare'],
                    'COMPARE_NAME' => $arParams['COMPARE_NAME'],
                    'BACKGROUND_IMAGE' => (isset($arParams['SECTION_BACKGROUND_IMAGE']) ? $arParams['SECTION_BACKGROUND_IMAGE'] : ''),
                    'COMPATIBLE_MODE' => (isset($arParams['COMPATIBLE_MODE']) ? $arParams['COMPATIBLE_MODE'] : ''),
                    'DISABLE_INIT_JS_IN_COMPONENT' => (isset($arParams['DISABLE_INIT_JS_IN_COMPONENT']) ? $arParams['DISABLE_INIT_JS_IN_COMPONENT'] : '')
                  ),
                  $component
                );
                $filters = getElementFilters($intSectionID); // 433
                ob_start(); ?>
              <?php if ($USER->IsAdmin()): ?>
                <?php if (!empty($filters["product"]) || !empty($filters["sections"]) || !empty($filters["weapon"])): ?>
                  <button class="r-button" data-k-js="toggle-sections">Показать категории</button>
                  <div class="r-catalog-top__list-wrapper">
                <?php endif; // !empty($filters["product"]) || !empty($filters["sections"]) || !empty($filters["weapon"])?>
              <?php endif; // $USER->IsAdmin() ?>
              <?php if (!empty($filters["product"])) : ?>
                <div class="r-catalog-top__list">
                  <a href="<?= $APPLICATION->GetCurPageParam("", ["pr"]) ?>">Все</a>
                  <?php foreach ($filters["product"] as $product) : ?>
                    <a
                      href="<?= $APPLICATION->GetCurPageParam("pr=$product", ["pr"]) ?>"
                      class="<?= $_GET["pr"] === $product ? "k-current-filter" : "" ?>"
                    >
                      <?= $product ?>
                    </a>
                  <?php endforeach ?>
                </div>
              <?php endif; ?>
              <?php if (!empty($filters["sections"])) : ?>
                <div class="r-catalog-top__list">
                  <a href="<?= $APPLICATION->GetCurPageParam("", ["st"]) ?>">Все</a>
                  <?php foreach ($filters["sections"] as $section) :
                    $code = $section["CODE"];
                    ?>
                    <a
                      href="<?= $APPLICATION->GetCurPageParam("st=$code", ["st"]) ?>"
                      class="<?= $_GET["st"] === $code ? "k-current-filter" : "" ?>"
                    >
                      <?= $section["NAME"] ?>
                    </a>
                  <?php endforeach ?>
                </div>
              <?php endif; ?>
              <?php if (!empty($filters["weapon"])) : ?>
                <div class="r-catalog-top__list">
                  <a href="<?= $APPLICATION->GetCurPageParam("", ["wp"]) ?>">Все</a>
                  <?php foreach ($filters["weapon"] as $weapon) : ?>
                    <a
                      href="<?= $APPLICATION->GetCurPageParam("wp=$weapon", ["wp"]) ?>"
                      class="<?= $_GET["wp"] === $weapon ? "k-current-filter" : "" ?>"
                    >
                      <?= $weapon ?>
                    </a>
                  <?php endforeach ?>
                </div>
              <?php endif; ?>
              <?php if ($USER->IsAdmin()): ?>
                <?php if (!empty($filters["product"]) || !empty($filters["sections"]) || !empty($filters["weapon"])): ?>
                  </div>
                <?php endif; // !empty($filters["product"]) || !empty($filters["sections"]) || !empty($filters["weapon"])?>
              <?php endif; // $USER->IsAdmin() ?>
              <?php $elementFilters = ob_get_clean();
                $APPLICATION->AddViewContent('element_filters', $elementFilters);
              
              ?>
              
              <?php $GLOBALS['CATALOG_CURRENT_SECTION_ID'] = $intSectionID; ?>
              
              
              <?php if ($ar_result["UF_KRAKEN_CTLG_TXT_P_ENUM"]["XML_ID"] == "short"): ?>
                <?php $APPLICATION->ShowViewContent('catalog-bottom-desc'); ?>
              <?php endif; ?>
            
            </div>
          
          
          </div>
        
        
        </div>
        
        <div class="clearfix"></div>
      
      </div>
    </div>
  
  </div>

<?php if ($ar_result["UF_KRAKEN_CTLG_TXT_P_ENUM"]["XML_ID"] == "long"): ?>
  <?php $APPLICATION->ShowViewContent('catalog-bottom-desc'); ?>
<?php endif; ?>

<?php //endif; ?>


<?php if ($ar_result["UF_KRAKEN_CTLG_TMPL_ENUM"]["XML_ID"] == "landing"): ?>
  
  
  <?php if ($ar_result["UF_KRAKEN_CTLG_T_ID"] > 0): ?>
    
    <?php
    $arFilter = array("ID" => $ar_result["UF_KRAKEN_CTLG_T_ID"]);
    $db_list = CIBlockSection::GetList(array(), $arFilter, false);
    $ar_res = $db_list->GetNext();
    ?>
    
    <?php if ($ar_res["ACTIVE"] == "Y"): ?>
      <?php $GLOBALS["IS_CONSTRUCTOR"] = true; ?>
      <?php
//      $section = $APPLICATION->IncludeComponent(
//        "concept:kraken.one.page",
//        "",
//        array(
//          "CACHE_GROUPS" => $arParams["CACHE_GROUPS"],
//          "CACHE_TIME" => $arParams["CACHE_TIME"],
//          "CACHE_TYPE" => $arParams["CACHE_TYPE"],
//          "CHECK_DATES" => $arParams["CHECK_DATES"],
//          "IBLOCK_ID" => $ar_res["IBLOCK_ID"],
//          "IBLOCK_TYPE" => $ar_res["IBLOCK_TYPE_ID"],
//          "PARENT_SECTION" => $ar_res["ID"],
//          "SET_TITLE" => $arParams["SET_TITLE"],
//          "SET_LAST_MODIFIED" => $arParams["SET_LAST_MODIFIED"],
//          "MESSAGE_404" => $arParams["MESSAGE_404"],
//          "SET_STATUS_404" => $arParams["SET_STATUS_404"],
//          "SHOW_404" => $arParams["SHOW_404"],
//          "FILE_404" => $arParams["FILE_404"],
//          "COMPONENT_TEMPLATE" => ""
//        ),
//        $component
//      );
      ?>
      
      <?php // $GLOBALS["KRAKEN_CURRENT_SECTION_ID"] = $section; ?>
    
    
    <?php else: ?>
      
      <?php
      if (!defined("ERROR_404"))
        define("ERROR_404", "Y");
      
      \CHTTP::setStatus("404 Not Found");
      
      if ($APPLICATION->RestartWorkarea()) {
        require(\Bitrix\Main\Application::getDocumentRoot() . "/404.php");
        die();
      }
      
      
      ?>
    
    <?php endif; ?>
  
  <?php endif; ?>

<?php endif;
  if ($arResult["VARIABLES"]["SECTION_ID"]) {
    $this->SetViewTarget("header-bg");
    echo getSectionPictureByID($arResult["VARIABLES"]["SECTION_ID"]);
    $this->EndViewTarget();
  }
?>