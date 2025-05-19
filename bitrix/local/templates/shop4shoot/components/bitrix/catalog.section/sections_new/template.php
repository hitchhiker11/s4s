<?php
  if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();
  
  use Bitrix\Main\Localization\Loc;
  use Bitrix\Catalog\ProductTable;
  
  /**
   * @global CMain $APPLICATION
   * @var array $arParams
   * @var array $arResult
   * @var CatalogSectionComponent $component
   * @var CBitrixComponentTemplate $this
   * @var string $templateName
   * @var string $componentPath
   *
   *  _________________________________________________________________________
   * |  Attention!
   * |  The following comments are for system use
   * |  and are required for the component to work correctly in ajax mode:
   * |  <!-- items-container -->
   * |  <!-- pagination-container -->
   * |  <!-- component-end -->
   */
  
  $this->setFrameMode(true);
  $this->addExternalCss('/bitrix/css/main/bootstrap.css');
  
  
  
  if (!empty($arResult['NAV_RESULT'])) {
    $navParams = array(
      'NavPageCount' => $arResult['NAV_RESULT']->NavPageCount,
      'NavPageNomer' => $arResult['NAV_RESULT']->NavPageNomer,
      'NavNum' => $arResult['NAV_RESULT']->NavNum
    );
  } else {
    $navParams = array(
      'NavPageCount' => 1,
      'NavPageNomer' => 1,
      'NavNum' => $this->randString()
    );
  }
  
  $showTopPager = false;
  $showBottomPager = false;
  $showLazyLoad = false;
  
  if ($arParams['PAGE_ELEMENT_COUNT'] > 0 && $navParams['NavPageCount'] > 1) {
    $showTopPager = $arParams['DISPLAY_TOP_PAGER'];
    $showBottomPager = $arParams['DISPLAY_BOTTOM_PAGER'];
    $showLazyLoad = $arParams['LAZY_LOAD'] === 'Y' && $navParams['NavPageNomer'] != $navParams['NavPageCount'];
  }
  
  $templateLibrary = array('popup', 'ajax', 'fx');
  $currencyList = '';
  
  if (!empty($arResult['CURRENCIES'])) {
    $templateLibrary[] = 'currency';
    $currencyList = CUtil::PhpToJSObject($arResult['CURRENCIES'], false, true, true);
  }
  
  $templateData = array(
    'TEMPLATE_THEME' => $arParams['TEMPLATE_THEME'],
    'TEMPLATE_LIBRARY' => $templateLibrary,
    'CURRENCIES' => $currencyList,
    'USE_PAGINATION_CONTAINER' => $showTopPager || $showBottomPager,
  );
  unset($currencyList, $templateLibrary);
  
  $elementEdit = CIBlock::GetArrayByID($arParams['IBLOCK_ID'], 'ELEMENT_EDIT');
  $elementDelete = CIBlock::GetArrayByID($arParams['IBLOCK_ID'], 'ELEMENT_DELETE');
  $elementDeleteParams = array('CONFIRM' => GetMessage('CT_BCS_TPL_ELEMENT_DELETE_CONFIRM'));
  
  $positionClassMap = array(
    'left' => 'product-item-label-left',
    'center' => 'product-item-label-center',
    'right' => 'product-item-label-right',
    'bottom' => 'product-item-label-bottom',
    'middle' => 'product-item-label-middle',
    'top' => 'product-item-label-top'
  );
  
  $discountPositionClass = '';
  if ($arParams['SHOW_DISCOUNT_PERCENT'] === 'Y' && !empty($arParams['DISCOUNT_PERCENT_POSITION'])) {
    foreach (explode('-', $arParams['DISCOUNT_PERCENT_POSITION']) as $pos) {
      $discountPositionClass .= isset($positionClassMap[$pos]) ? ' ' . $positionClassMap[$pos] : '';
    }
  }
  
  $labelPositionClass = '';
  if (!empty($arParams['LABEL_PROP_POSITION'])) {
    foreach (explode('-', $arParams['LABEL_PROP_POSITION']) as $pos) {
      $labelPositionClass .= isset($positionClassMap[$pos]) ? ' ' . $positionClassMap[$pos] : '';
    }
  }
  
  $arParams['~MESS_BTN_BUY'] = ($arParams['~MESS_BTN_BUY'] ?? '') ?: Loc::getMessage('CT_BCS_TPL_MESS_BTN_BUY');
  $arParams['~MESS_BTN_DETAIL'] = ($arParams['~MESS_BTN_DETAIL'] ?? '') ?: Loc::getMessage('CT_BCS_TPL_MESS_BTN_DETAIL');
  $arParams['~MESS_BTN_COMPARE'] = ($arParams['~MESS_BTN_COMPARE'] ?? '') ?: Loc::getMessage('CT_BCS_TPL_MESS_BTN_COMPARE');
  $arParams['~MESS_BTN_SUBSCRIBE'] = ($arParams['~MESS_BTN_SUBSCRIBE'] ?? '') ?: Loc::getMessage('CT_BCS_TPL_MESS_BTN_SUBSCRIBE');
  $arParams['~MESS_BTN_ADD_TO_BASKET'] = ($arParams['~MESS_BTN_ADD_TO_BASKET'] ?? '') ?: Loc::getMessage('CT_BCS_TPL_MESS_BTN_ADD_TO_BASKET');
  $arParams['~MESS_NOT_AVAILABLE'] = ($arParams['~MESS_NOT_AVAILABLE'] ?? '') ?: Loc::getMessage('CT_BCS_TPL_MESS_PRODUCT_NOT_AVAILABLE');
  $arParams['~MESS_NOT_AVAILABLE_SERVICE'] = ($arParams['~MESS_NOT_AVAILABLE_SERVICE'] ?? '') ?: Loc::getMessage('CP_BCS_TPL_MESS_PRODUCT_NOT_AVAILABLE_SERVICE');
  $arParams['~MESS_SHOW_MAX_QUANTITY'] = ($arParams['~MESS_SHOW_MAX_QUANTITY'] ?? '') ?: Loc::getMessage('CT_BCS_CATALOG_SHOW_MAX_QUANTITY');
  $arParams['~MESS_RELATIVE_QUANTITY_MANY'] = ($arParams['~MESS_RELATIVE_QUANTITY_MANY'] ?? '') ?: Loc::getMessage('CT_BCS_CATALOG_RELATIVE_QUANTITY_MANY');
  $arParams['MESS_RELATIVE_QUANTITY_MANY'] = ($arParams['MESS_RELATIVE_QUANTITY_MANY'] ?? '') ?: Loc::getMessage('CT_BCS_CATALOG_RELATIVE_QUANTITY_MANY');
  $arParams['~MESS_RELATIVE_QUANTITY_FEW'] = ($arParams['~MESS_RELATIVE_QUANTITY_FEW'] ?? '') ?: Loc::getMessage('CT_BCS_CATALOG_RELATIVE_QUANTITY_FEW');
  $arParams['MESS_RELATIVE_QUANTITY_FEW'] = ($arParams['MESS_RELATIVE_QUANTITY_FEW'] ?? '') ?: Loc::getMessage('CT_BCS_CATALOG_RELATIVE_QUANTITY_FEW');
  
  $arParams['MESS_BTN_LAZY_LOAD'] = $arParams['MESS_BTN_LAZY_LOAD'] ?: Loc::getMessage('CT_BCS_CATALOG_MESS_BTN_LAZY_LOAD');
  
  $obName = 'ob' . preg_replace('/[^a-zA-Z0-9_]/', 'x', $this->GetEditAreaId($navParams['NavNum']));
  $containerName = 'container-' . $navParams['NavNum'];
  if ($showTopPager) {
    ?>
    <div data-pagination-num="<?= $navParams['NavNum'] ?>">
      <!-- pagination-container -->
      <?= $arResult['NAV_STRING'] ?>
      <!-- pagination-container -->
    </div>
    <?php
  }
 ?>
<?php if (!empty($arResult["ITEMS"])) : ?>


<?php if (!isset($arParams['HIDE_SECTION_DESCRIPTION']) || $arParams['HIDE_SECTION_DESCRIPTION'] !== 'Y') {
    ?>
    <div class="bx-section-desc bx-<?= $arParams['TEMPLATE_THEME'] ?>">
      <p class="bx-section-desc-post"><?= $arResult['DESCRIPTION'] ?? '' ?></p>
    </div>
    <?php
  }
  //  echo '<pre>', print_r($arResult, true), '</pre>';
  global $GOATID, $articleData;
  $additionalClasses = "";
  if ($articleData) $additionalClasses .= " k1-catalog-items-block--article";
  if ($GOATID) $additionalClasses .= " k1-catalog-items-block--goat";
  $count = 0;
?>
  <div class="catalog-section  bx-<?= $arParams['TEMPLATE_THEME'] ?>" data-entity="<?= $containerName ?>">
    
    <div class="k1-catalog-wrapper-new">
      <div class="k1-catalog-items-block <?= $additionalClasses ?>">
        <?php
          if (!empty($arResult['ITEMS']) && !empty($arResult['ITEM_ROWS'])) {
            $generalParams = [
              'SHOW_DISCOUNT_PERCENT' => $arParams['SHOW_DISCOUNT_PERCENT'],
              'PRODUCT_DISPLAY_MODE' => $arParams['PRODUCT_DISPLAY_MODE'],
              'SHOW_MAX_QUANTITY' => $arParams['SHOW_MAX_QUANTITY'],
              'RELATIVE_QUANTITY_FACTOR' => $arParams['RELATIVE_QUANTITY_FACTOR'],
              'MESS_SHOW_MAX_QUANTITY' => $arParams['~MESS_SHOW_MAX_QUANTITY'],
              'MESS_RELATIVE_QUANTITY_MANY' => $arParams['~MESS_RELATIVE_QUANTITY_MANY'],
              'MESS_RELATIVE_QUANTITY_FEW' => $arParams['~MESS_RELATIVE_QUANTITY_FEW'],
              'SHOW_OLD_PRICE' => $arParams['SHOW_OLD_PRICE'],
              'USE_PRODUCT_QUANTITY' => $arParams['USE_PRODUCT_QUANTITY'],
              'PRODUCT_QUANTITY_VARIABLE' => $arParams['PRODUCT_QUANTITY_VARIABLE'],
              'ADD_TO_BASKET_ACTION' => $arParams['ADD_TO_BASKET_ACTION'],
              'ADD_PROPERTIES_TO_BASKET' => $arParams['ADD_PROPERTIES_TO_BASKET'],
              'PRODUCT_PROPS_VARIABLE' => $arParams['PRODUCT_PROPS_VARIABLE'],
              'SHOW_CLOSE_POPUP' => $arParams['SHOW_CLOSE_POPUP'],
              'DISPLAY_COMPARE' => $arParams['DISPLAY_COMPARE'],
              'COMPARE_PATH' => $arParams['COMPARE_PATH'],
              'COMPARE_NAME' => $arParams['COMPARE_NAME'],
              'PRODUCT_SUBSCRIPTION' => $arParams['PRODUCT_SUBSCRIPTION'],
              'PRODUCT_BLOCKS_ORDER' => $arParams['PRODUCT_BLOCKS_ORDER'],
              'LABEL_POSITION_CLASS' => $labelPositionClass,
              'DISCOUNT_POSITION_CLASS' => $discountPositionClass,
              'SLIDER_INTERVAL' => $arParams['SLIDER_INTERVAL'],
              'SLIDER_PROGRESS' => $arParams['SLIDER_PROGRESS'],
              '~BASKET_URL' => $arParams['~BASKET_URL'],
              '~ADD_URL_TEMPLATE' => $arResult['~ADD_URL_TEMPLATE'],
              '~BUY_URL_TEMPLATE' => $arResult['~BUY_URL_TEMPLATE'],
              '~COMPARE_URL_TEMPLATE' => $arResult['~COMPARE_URL_TEMPLATE'],
              '~COMPARE_DELETE_URL_TEMPLATE' => $arResult['~COMPARE_DELETE_URL_TEMPLATE'],
              'TEMPLATE_THEME' => $arParams['TEMPLATE_THEME'],
              'USE_ENHANCED_ECOMMERCE' => $arParams['USE_ENHANCED_ECOMMERCE'],
              'DATA_LAYER_NAME' => $arParams['DATA_LAYER_NAME'],
              'BRAND_PROPERTY' => $arParams['BRAND_PROPERTY'],
              'MESS_BTN_BUY' => $arParams['~MESS_BTN_BUY'],
              'MESS_BTN_DETAIL' => $arParams['~MESS_BTN_DETAIL'],
              'MESS_BTN_COMPARE' => $arParams['~MESS_BTN_COMPARE'],
              'MESS_BTN_SUBSCRIBE' => $arParams['~MESS_BTN_SUBSCRIBE'],
              'MESS_BTN_ADD_TO_BASKET' => $arParams['~MESS_BTN_ADD_TO_BASKET'],
            ];
            
            $areaIds = [];
            $itemParameters = [];
            $elementCount = 0;
            ?>
            
            <?php
            foreach ($arResult['ITEMS'] as $item) {
              
              $uniqueId = $item['ID'] . '_' . md5($this->randString() . $component->getAction());
              $areaIds[$item['ID']] = $this->GetEditAreaId($uniqueId);
              $this->AddEditAction($uniqueId, $item['EDIT_LINK'], $elementEdit);
              $this->AddDeleteAction($uniqueId, $item['DELETE_LINK'], $elementDelete, $elementDeleteParams);
              
              $itemParameters[$item['ID']] = [
                'SKU_PROPS' => $arResult['SKU_PROPS'][$item['IBLOCK_ID']],
                'MESS_NOT_AVAILABLE' => ($arResult['MODULES']['catalog'] && $item['PRODUCT']['TYPE'] === ProductTable::TYPE_SERVICE
                  ? $arParams['~MESS_NOT_AVAILABLE_SERVICE']
                  : $arParams['~MESS_NOT_AVAILABLE']
                ),
              ];
            }
            ?>
            
            <!-- items-container -->
            <?php foreach ($arResult["ITEMS"] as $key => $arItem): ?>
              <?php $this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], $elementEdit); ?>
              <?php $this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], $elementDelete, $elementDeleteParams); ?>
              <?php
              
              $uniqueId = $arItem['ID'] . '_' . md5($this->randString() . $component->getAction());
              $areaIds[$arItem['ID']] = $this->GetEditAreaId($uniqueId);
              $mainId = $this->GetEditAreaId($arItem['ID']);
              $itemParameters[$arItem['ID']] = [
                'SKU_PROPS' => $arResult['SKU_PROPS'][$arItem['IBLOCK_ID']],
                'MESS_NOT_AVAILABLE' => ($arResult['MODULES']['catalog'] && $arItem['PRODUCT']['TYPE'] === ProductTable::TYPE_SERVICE
                  ? $arParams['~MESS_NOT_AVAILABLE_SERVICE']
                  : $arParams['~MESS_NOT_AVAILABLE']
                ),
              ];
              $obName = 'ob' . preg_replace('/[^a-zA-Z0-9_]/', 'x', $mainId);
              
              $itemIds = array(
                'ID' => $mainId,
                'SKU_ID' => $mainId . '_sku_block',
                'GALLERY' => $mainId . '_gallery_block',
                'ARTICLE_AVAILABLE_TEXT' => $mainId . '_article_available_text_block',
                'ARTICLE' => $mainId . '_article',
                'ARTICLE_BLOCK' => $mainId . '_article_block',
                'AVAILABLE' => $mainId . '_available',
                'AVAILABLE_BLOCK' => $mainId . '_available_block',
                'PREVIEW_TEXT' => $mainId . '_preview_text',
                'PREVIEW_TEXT_BLOCK' => $mainId . '_preview_text_block',
                'PRICE_BLOCK_ID' => $mainId . '_price_block',
                'PRICE_VALUE' => $mainId . '_price_value',
                'OLDPRICE_VALUE' => $mainId . '_oldprice_value',
                'PRICE_REQUEST' => $mainId . '_price_request',
                'BTN_ADD2BASKET' => $mainId . '_add2basket',
                'WR_BTN_ADD2BASKET' => $mainId . '_wr_add2basket',
                'BTN_FAST_ORDER' => $mainId . '_fast_order',
                'WR_BTN_FAST_ORDER' => $mainId . '_wr_fast_order',
                'CHARS' => $mainId . '_chars',
                'BTN2DETAIL' => $mainId . '_btn2Detail',
                'NAME2DETAIL' => $mainId . '_name2Detail'
              ); ?>
              <?php
              $defaultClasses = "col-lg-3 col-md-4 col-sm-4 col-xs-6";
              if ($arParams["K_PRODUCT_ROW"] == 4) {
                $defaultClasses = "col-md-3 col-sm-4 col-xs-6";
              }
              $defaultClasses = ""
              ?>
              
              <!--            <div class="--><?php //= $defaultClasses ?><!-- ">-->
              <?php $APPLICATION->IncludeComponent(
                'bitrix:catalog.item',
                'bootstrap_v4',
                array(
                  'RESULT' => array(
                    'ITEM' => $arItem,
                    'AREA_ID' => $areaIds[$arItem['ID']],
                    'TYPE' => "CARD",
                    'BIG_LABEL' => 'N',
                    'BIG_DISCOUNT_PERCENT' => 'N',
                    'BIG_BUTTONS' => 'N',
                    'SCALABLE' => 'N'
                  ),
                  'PARAMS' => $generalParams + $itemParameters[$arItem['ID']],
                  "kCount" => $count
                ),
                $component,
                array('HIDE_ICONS' => 'Y')
              );
              ?>
              <!--            </div>-->
              <?php if ($elementCount === 3 && $articleData) :
                $elementCount += 1;
                ?>
                <!--            <div class="--><?php //= $defaultClasses
                ?><!-- col-xs-6 article-in-catalog">-->
                <div class="product-item-container article-in-catalog"
                     style="grid-area: A"
                     data-entity="item">
                  <div class="product-item">
                    <a class="product-item-image-wrapper"
                       href="<?= $articleData["LINK"] ?>"
                       title="<?= $articleData["NAME"] ?>"
                       data-entity="image-wrapper">
<!--                      <img src="--><?php //= $articleData["PHOTO"] ?><!--" alt="">-->
                    <span class="product-item-image-original"
                          style="background-image: url('<?= $articleData["PHOTO"] ?>')"></span>
                      <span class="product-item-image-alternative"
                            style="background-image: url('<?= $articleData["PHOTO"] ?>')"></span>
                    </a>
                    <h3 class="product-item-title">
                      <a href="<?= $articleData["LINK"] ?>" title="<?= $articleData["NAME"] ?>">
                        <?= $articleData["NAME"] ?>
                      </a>
                    </h3>
                  </div>
                </div>
                <!--            </div>-->
              <?php endif; ?>
              <?php
              
              if ($elementCount === 8 && $GOATID) :
                $elementCount += 1;
                global $GOATFilter;
                
                $intSectionID = $APPLICATION->IncludeComponent(
                  "bitrix:catalog.section",
                  "best_product",
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
                    "FILTER_NAME" => "GOATFilter",
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
                    "PAGE_ELEMENT_COUNT" => 1,
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
              endif; ?>
              
              <?php if (($elementCount + 1) % 2 == 0): ?>
                <div class="clearfix visible-xs"></div>
              <?php endif; ?>
              <?php if (($elementCount + 1) % 3 == 0): ?>
                <div class="clearfix hidden-xs hidden-k-lg"></div>
              <?php endif; ?>
              <?php if (($elementCount + 1) % 5 == 0): ?>
                <div class="clearfix hidden-xs visible-k-lg"></div>
              <?php endif; ?>
              
              <?php
              $jsParams = array(
                'PRODUCT_TYPE' => ($arItem["HAVEOFFERS"]) ? "OFFERS" : "PRODUCT",
                'CONFIG' => array(
                  'USE_ADD2BASKET' => $permCartOn,
                  'USE_FAST_ORDER' => $permShowFastOrder,
                  'USE_SKU' => true,
                  'USE_SCROLL2CHARS' => '',
                  'EMPTY_SKU' => ($arItem["HAVEOFFERS"] && !empty($arItem["OFFERS_SKU"])) ? false : true
                ),
                'VISUAL' => $itemIds,
                'PRODUCT' => $arItem["PRODUCT_INFO"],
                'FAST_ORDER_FORM_ID' => $arItem["FORM_FAST_ORDER"]
              );
              if ($arItem["HAVEOFFERS"] && !empty($arItem["OFFERS_SKU"])) {
                $jsParams["TREE_PROPS"] = $arItem["OFFERS_SKU"];
                $jsParams['OFFER_SELECTED'] = $arItem["OFFER_SELECTED"];
              }
              $elementCount += 1;
              $count += 1;
              ?>
              <?php if ($count % 4 === 0) : ?>
              
              <?php endif; ?>
            <?php endforeach; ?>
            <?php
            
            
            unset($rowItems);
            
            unset($itemParameters);
            unset($areaIds);
            
            unset($generalParams);
            ?>
            <!-- items-container -->
            <?php
          } else {
            // load css for bigData/deferred load
            $APPLICATION->IncludeComponent(
              'bitrix:catalog.item',
              '',
              array(),
              $component,
              array('HIDE_ICONS' => 'Y')
            );
          }
        ?>
      </div>
    </div>
  </div>

<?php
  if ($showLazyLoad) {
    ?>
    <div class="row bx-<?= $arParams['TEMPLATE_THEME'] ?>">
      <div class="btn btn-default btn-lg center-block" style="margin: 15px;"
           data-use="show-more-<?= $navParams['NavNum'] ?>">
        <?= $arParams['MESS_BTN_LAZY_LOAD'] ?>
      </div>
    </div>
    <?php
  }
  
  if ($showBottomPager) {
    ?>
    <div class="clearfix"></div>
    <div data-pagination-num="<?= $navParams['NavNum'] ?>">
      <!-- pagination-container -->
      <?= $arResult['NAV_STRING'] ?>
      <!-- pagination-container -->
    </div>
    <?php
  }
  
  $signer = new \Bitrix\Main\Security\Sign\Signer;
  $signedTemplate = $signer->sign($templateName, 'catalog.section');
  $signedParams = $signer->sign(base64_encode(serialize($arResult['ORIGINAL_PARAMETERS'])), 'catalog.section');
  if ($_GET["brand"]) {
    $title = "Товары бренда " . $_GET["brand"];
    $APPLICATION->SetTitle($title);
  }
  if ($_GET["new"] === "y") {
    $title = "Новинки";
    $APPLICATION->SetTitle($title);
  }
?>
<script>
  BX.message({
    BTN_MESSAGE_BASKET_REDIRECT: '<?=GetMessageJS('CT_BCS_CATALOG_BTN_MESSAGE_BASKET_REDIRECT')?>',
    BASKET_URL: '<?=$arParams['BASKET_URL']?>',
    ADD_TO_BASKET_OK: '<?=GetMessageJS('ADD_TO_BASKET_OK')?>',
    TITLE_ERROR: '<?=GetMessageJS('CT_BCS_CATALOG_TITLE_ERROR')?>',
    TITLE_BASKET_PROPS: '<?=GetMessageJS('CT_BCS_CATALOG_TITLE_BASKET_PROPS')?>',
    TITLE_SUCCESSFUL: '<?=GetMessageJS('ADD_TO_BASKET_OK')?>',
    BASKET_UNKNOWN_ERROR: '<?=GetMessageJS('CT_BCS_CATALOG_BASKET_UNKNOWN_ERROR')?>',
    BTN_MESSAGE_SEND_PROPS: '<?=GetMessageJS('CT_BCS_CATALOG_BTN_MESSAGE_SEND_PROPS')?>',
    BTN_MESSAGE_CLOSE: '<?=GetMessageJS('CT_BCS_CATALOG_BTN_MESSAGE_CLOSE')?>',
    BTN_MESSAGE_CLOSE_POPUP: '<?=GetMessageJS('CT_BCS_CATALOG_BTN_MESSAGE_CLOSE_POPUP')?>',
    COMPARE_MESSAGE_OK: '<?=GetMessageJS('CT_BCS_CATALOG_MESS_COMPARE_OK')?>',
    COMPARE_UNKNOWN_ERROR: '<?=GetMessageJS('CT_BCS_CATALOG_MESS_COMPARE_UNKNOWN_ERROR')?>',
    COMPARE_TITLE: '<?=GetMessageJS('CT_BCS_CATALOG_MESS_COMPARE_TITLE')?>',
    PRICE_TOTAL_PREFIX: '<?=GetMessageJS('CT_BCS_CATALOG_PRICE_TOTAL_PREFIX')?>',
    RELATIVE_QUANTITY_MANY: '<?=CUtil::JSEscape($arParams['MESS_RELATIVE_QUANTITY_MANY'])?>',
    RELATIVE_QUANTITY_FEW: '<?=CUtil::JSEscape($arParams['MESS_RELATIVE_QUANTITY_FEW'])?>',
    BTN_MESSAGE_COMPARE_REDIRECT: '<?=GetMessageJS('CT_BCS_CATALOG_BTN_MESSAGE_COMPARE_REDIRECT')?>',
    BTN_MESSAGE_LAZY_LOAD: '<?=CUtil::JSEscape($arParams['MESS_BTN_LAZY_LOAD'])?>',
    BTN_MESSAGE_LAZY_LOAD_WAITER: '<?=GetMessageJS('CT_BCS_CATALOG_BTN_MESSAGE_LAZY_LOAD_WAITER')?>',
    SITE_ID: '<?=CUtil::JSEscape($component->getSiteId())?>'
  });
  var <?=$obName?> = new JCCatalogSectionComponent({
    siteId: '<?=CUtil::JSEscape($component->getSiteId())?>',
    componentPath: '<?=CUtil::JSEscape($componentPath)?>',
    navParams: <?=CUtil::PhpToJSObject($navParams)?>,
    deferredLoad: false,
    initiallyShowHeader: '<?=!empty($arResult['ITEM_ROWS'])?>',
    bigData: <?=CUtil::PhpToJSObject($arResult['BIG_DATA'])?>,
    lazyLoad: !!'<?=$showLazyLoad?>',
    loadOnScroll: !!'<?=($arParams['LOAD_ON_SCROLL'] === 'Y')?>',
    template: '<?=CUtil::JSEscape($signedTemplate)?>',
    ajaxId: '<?=CUtil::JSEscape($arParams['AJAX_ID'] ?? '')?>',
    parameters: '<?=CUtil::JSEscape($signedParams)?>',
    container: '<?=$containerName?>'
  });
</script>
<?php else : ?>
  <div class="r-catalog-top">
  <h1>Ничего не найдено.</h1>
  <a href="/" class="first-b main-color button-def shine big" style="text-decoration: underline; margin-top:
  24px; background: #000 !important;">Вернуться в каталог</a>
  </div>
<?php endif; ?>
<!-- component-end -->

<script>
  window.addEventListener("DOMContentLoaded", () => {
    const articleNode = document.querySelector(".article-in-catalog")
    if (articleNode) {
      const item = articleNode.querySelector("[data-entity=item]")
      item.addEventListener("mouseenter", function () {
        this.classList.add("hover")
      })
      item.addEventListener("mouseleave", function () {
        this.classList.remove("hover")
      })
    }
  })
</script>