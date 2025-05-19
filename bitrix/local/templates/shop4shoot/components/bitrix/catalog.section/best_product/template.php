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


?>


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
      $defaultClasses = "col-lg-3 col-md-4 col-sm-4";
      if ($arParams["K_PRODUCT_ROW"] == 4) {
        $defaultClasses = "col-md-3 col-sm-4 col-xs-6";
      }
      ?>
      
      <?php
      $templateName = "bootstrap_v4";
      $APPLICATION->IncludeComponent(
        'bitrix:catalog.item',
        $templateName,
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
          "isGOAT" => "Y"
        ),
        $component,
        array('HIDE_ICONS' => 'Y')
      );
      ?>
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
      ?>
    
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

<?php
  
  $signer = new \Bitrix\Main\Security\Sign\Signer;
  $signedTemplate = $signer->sign($templateName, 'catalog.section');
  $signedParams = $signer->sign(base64_encode(serialize($arResult['ORIGINAL_PARAMETERS'])), 'catalog.section');
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
<!-- component-end -->
