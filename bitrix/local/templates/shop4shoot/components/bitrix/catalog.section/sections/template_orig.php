<?php if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

  use Bitrix\Main\Localization\Loc;
  use Bitrix\Catalog\ProductTable;
  
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
  $this->setFrameMode(true);
  
?>
<?php
  global $KRAKEN_TEMPLATE_ARRAY;
  CKraken::includeCustomMessages();
  if (!empty($arResult['NAV_RESULT']))
  {
    $navParams =  array(
      'NavPageCount' => $arResult['NAV_RESULT']->NavPageCount,
      'NavPageNomer' => $arResult['NAV_RESULT']->NavPageNomer,
      'NavNum' => $arResult['NAV_RESULT']->NavNum
    );
  }
  else
  {
    $navParams = array(
      'NavPageCount' => 1,
      'NavPageNomer' => 1,
      'NavNum' => $this->randString()
    );
  }
  $obName = 'ob'.preg_replace('/[^a-zA-Z0-9_]/', 'x', $this->GetEditAreaId($navParams['NavNum']));
?>

<?php
  //  $show_setting = $KRAKEN_TEMPLATE_ARRAY["MODE_FAST_EDIT"]['VALUE'][0];
  //  $admin_active = ($USER->isAdmin() || $APPLICATION->GetGroupRight("concept.kraken") > "R");
  $containerName = 'container-'.$navParams['NavNum'];
  $page = $APPLICATION->GetCurPage();
  $filter = $clear = array();
  //  preg_match("/\/filter\//", $page, $filter);
  //  preg_match("/\/clear\//", $page, $clear);
  
  $showSeoText = empty($filter) || !empty($clear);
?>
<?php $this->SetViewTarget('catalog-top-desc'); ?>
<?php if (strlen($arResult["UF_KRAKEN_CTLG_TOP_T"]) > 0 && $arResult["NAV_RESULT"]->NavPageNomer == 1 && $showSeoText): ?>
  <div class="top-description text-content"><?= $arResult["~UF_KRAKEN_CTLG_TOP_T"] ?></div>
<?php endif; ?>
<?php $this->EndViewTarget(); ?>
<?php $this->SetViewTarget('catalog-bottom-desc'); ?>
<?php if ($arResult["UF_KRAKEN_CTLG_TXT_P_ENUM"]["XML_ID"] == "short" && strlen($arResult["DESCRIPTION"]) > 0 && $arResult["NAV_RESULT"]->NavPageNomer == 1 && $showSeoText): ?>
  <div class="bottom-description text-content"><?= $arResult["DESCRIPTION"] ?></div>
<?php endif; ?>
<?php if ($arResult["UF_KRAKEN_CTLG_TXT_P_ENUM"]["XML_ID"] == "long" && strlen($arResult["DESCRIPTION"]) > 0 && $arResult["NAV_RESULT"]->NavPageNomer == 1 && $showSeoText): ?>
  <div class="bottom-description-full text-content">
    <div class="container">
      <?= $arResult["DESCRIPTION"] ?>
    </div>
  
  </div>

<?php endif; ?>

<?php $this->EndViewTarget();
  
  $elementEdit = CIBlock::GetArrayByID($arParams['IBLOCK_ID'], 'ELEMENT_EDIT');
  $elementDelete = CIBlock::GetArrayByID($arParams['IBLOCK_ID'], 'ELEMENT_DELETE');
  $elementDeleteParams = array('CONFIRM' => GetMessage('CT_BCS_TPL_ELEMENT_DELETE_CONFIRM'));
//echo '<pre>', print_r($arResult["ITEMS"], true), '</pre>';
//echo '<pre>', print_r($arResult["ITEMS"][0], true), '</pre>';
?>
<?php if (!empty($arResult["ITEMS"])): ?>
  <?php
  $two_cols = true;
  $areaIds = [];
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
  ?>
  <div class="catalog-block k1-catalog-block">
    <div class="element-list two-cols">
      <div class="row" data-entity="<?=$containerName?>">
        <!-- items-container -->
        <?php foreach ($arResult["ITEMS"] as $key => $arItem): ?>
          <?php $this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], $elementEdit); ?>
          <?php $this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], $elementDelete, $elementDeleteParams); ?>
          <?php
          $uniqueId = $arItem['ID'].'_'.md5($this->randString().$component->getAction());
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
          <div class="col-lg-4 col-md-4 col-sm-4 col-xs-<?= $KRAKEN_TEMPLATE_ARRAY["CATALOG_VIEW_XS"]["VALUE"] ?>">
          <?php $APPLICATION->IncludeComponent(
            'bitrix:catalog.item',
//            '',
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
            ),
            $component,
            array('HIDE_ICONS' => 'Y')
          );
          ?>
          </div>
          <?php /* ?>
          <div class="col-lg-4 col-md-4 col-sm-4 col-xs-<?= $KRAKEN_TEMPLATE_ARRAY["CATALOG_VIEW_XS"]["VALUE"] ?>">
            <div class="element-outer elem-hover" id="<?= $mainId ?>">
              <div class="element FLAT elem-hover-height-more">
                <div class="element-inner elem-hover-height">
                  <?php // CKraken::admin_setting($arItem, false, $admin_active, $show_setting) ?>
                  <div class="clearfix">
                    <div class="image-wrap"
                         id="<?= $itemIds["GALLERY"] ?>">
                      <table>
                        <tr>
                          <td class="gallery-list">
                            
                            <a href="<?= $arItem["DETAIL_PAGE_URL"] ?>">
                              
                              <img class="img-responsive center-block animate_to_box lazyload"
                                   src="<?= $arItem["DETAIL_PICTURE"]["SRC"] ?>"
                              />
                              <!--                                   data-src="-->
                              <?php //= $arItem["FIRST_ITEM"]["GALLERY"][0]["SMALL"] ?><!--"-->
                              <!--                                   data-cart-id-img="-->
                              <?php //= $arItem["FIRST_ITEM"]["PRODUCT_ID"] ?><!--"-->
                              <!--                                   alt="-->
                              <?php //= $arItem["FIRST_ITEM"]["GALLERY"][0]["ALT"] ?><!--"-->
                              <!--                                   title="-->
                              <?php //= $arItem["FIRST_ITEM"]["GALLERY"][0]["TITLE"] ?><!--"-->
                              <!--                              />-->
                            
                            
                            </a>
                          </td>
                        </tr>
                      </table>
                      <?php if (!empty($arItem["PROPERTIES"]["LABELS"]["VALUE_XML_ID"])): ?>
                        <div class="icons-wrap">
                          <?php foreach ($arItem["PROPERTIES"]["LABELS"]["VALUE_XML_ID"] as $k => $xml_id): ?>
                            <div class="icon ic_<?= $xml_id ?>"
                                 title="<?= $arItem["PROPERTIES"]["LABELS"]["VALUE"][$k] ?>">
                            </div>
                          <?php endforeach; ?>
                        </div>
                      <?php endif; ?>
                    </div>
                    <div class="bot-part ">
                      <div class="name">
                        <a href="<?= $arItem["FIRST_ITEM"]["DETAIL_PAGE_URL"] ?>" id="<?= $itemIds["NAME2DETAIL"] ?>">
                          <span><?= $arItem["NAME"] ?></span>
                        </a>
                      </div>
                      <div class="price-table <?= ($arItem["FIRST_ITEM"]["CAN_BUY"] == "Y") ? "" : "hidden" ?>"
                           id="<?= $itemIds["PRICE_BLOCK_ID"] ?>">
                        <div
                          class="price-cell old-price <?= ($arItem["FIRST_ITEM"]["REQUEST_PRICE"] == "Y" || strlen($arItem["FIRST_ITEM"]["OLD_PRICE"]["VALUE"]) <= 0) ? "hidden" : "" ?>"
                          id="<?= $itemIds["OLDPRICE_VALUE"] ?>">
                          <?= (strlen($arItem["FIRST_ITEM"]["OLD_PRICE"]["VALUE"]) > 0) ? $arItem["FIRST_ITEM"]["OLD_PRICE"]["HTML"] : "" ?>
                        </div>
                        <div
                          class="price-cell price <?php if ($arItem["FIRST_ITEM"]["OLD_PRICE"]["VALUE"] > 0): ?>red-color<?php endif; ?> <?= (strlen($arItem["FIRST_ITEM"]["PRICE"]["VALUE_FORMATED"]) <= 0) ? "hidden" : "" ?>"
                          id="<?= $itemIds["PRICE_VALUE"] ?>">
                          <?= (strlen($arItem["FIRST_ITEM"]["PRICE"]["VALUE_FORMATED"]) > 0) ? $arItem["FIRST_ITEM"]["PRICE"]["HTML"] : "" ?>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <?php ?>
                <div class="elem-hover-show">
                  <div class="info-panel">
                    <?php if ($arItem["HAVEOFFERS"] && !empty($arItem["OFFERS_SKU"])): ?>
                      <div class="sku-block hidden-xs" id="<?= $itemIds["SKU_ID"] ?>">
                        <?php foreach ($arItem['OFFERS_SKU'] as $skuProperty): ?>
                          <?php if (!empty($skuProperty['VALUES'])): ?>
                            <div class="sku-row clearfix">
                              <div class="sku-wr-title">
                                <div class="sku-title">
                                  <?= $skuProperty["NAME"] ?><?php if (strlen($skuProperty["HINT"])): ?>
                                    <i class="hint-sku fa fa-question-circle hidden-xs" data-toggle="tooltip"
                                       data-placement="bottom" title=""
                                       data-original-title='<?= CKraken::prepareText($skuProperty["HINT"]) ?>'>
                                    </i>
                                  <?php endif; ?>
                                </div>
                              </div>
                              <?php if ($skuProperty["VIEW"] == 'pic' || $skuProperty["VIEW"] == 'pic_with_info'): ?>
                                <ul class="sku-props clearfix">
                                  <?php foreach ($skuProperty['VALUES'] as $skuPropertyVal): ?>
                                    
                                    <?php
                                    $styleTab = "";
                                    $styleHoverBoard = "";
                                    
                                    if (isset($skuPropertyVal["PICT"]) || isset($skuPropertyVal["PICT_SEC"])) {
                                      if (isset($skuPropertyVal["PICT_SEC"])) {
                                        $styleHoverBoard .= "background-image: url('" . $skuPropertyVal['PICT_SEC']['BIG'] . "'); ";
                                        
                                        if (isset($skuPropertyVal["PICT"]))
                                          $styleTab .= "background-image: url('" . $skuPropertyVal['PICT']['SMALL'] . "'); ";
                                        else
                                          $styleTab .= "background-image: url('" . $skuPropertyVal['PICT_SEC']['SMALL'] . "'); ";
                                        
                                      } else if (isset($skuPropertyVal["PICT"])) {
                                        $styleTab .= "background-image: url('" . $skuPropertyVal['PICT']['SMALL'] . "'); ";
                                        $styleHoverBoard .= "background-image: url('" . $skuPropertyVal['PICT']['BIG'] . "'); ";
                                      }
                                    }
                                    if ($skuPropertyVal["COLOR"]) {
                                      $styleTab .= "background-color:" . $skuPropertyVal["COLOR"] . "; ";
                                      $styleHoverBoard .= "background-color:" . $skuPropertyVal["COLOR"] . "; ";
                                    }
                                    ?>
                                    <li title='<?= CKraken::prepareText($skuPropertyVal['NAME']) ?>'
                                        class="detail-color"
                                        data-treevalue="<?= $skuProperty["ID"] ?>_<?= $skuPropertyVal['ID'] ?>"
                                        data-onevalue="<?= $skuPropertyVal['ID'] ?>"
                                    >
                                      <div class="color" style="<?= $styleTab ?>"></div>
                                      <?php if ($skuProperty["VIEW"] == 'pic_with_info'): ?>
                                        <div class="wrapper-hover-board">
                                          <div class="img" style="<?= $styleHoverBoard ?>"></div>
                                          <div class="desc"><?= $skuPropertyVal['NAME'] ?></div>
                                          <div class="arrow"></div>
                                        </div>
                                      <?php endif; ?>
                                      <span class="active-flag"></span>
                                    </li>
                                  <?php endforeach; ?>
                                </ul>
                              <?php elseif ($skuProperty["VIEW"] == 'select'): ?>
                                <div class="wrapper-select-input">
                                  <ul class="sku-props select-input">
                                    <li
                                      class="area-for-current-value"><?= $KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["SKU_SELECT_TITLE"] ?></li>
                                    <?php if (!empty($skuProperty['VALUES'])): ?>
                                      <?php foreach ($skuProperty['VALUES'] as $skuPropertyVal): ?>
                                        <li class="" title='<?= CKraken::prepareText($skuPropertyVal['NAME']) ?>'
                                            data-treevalue="<?= $skuProperty["ID"] ?>_<?= $skuPropertyVal['ID'] ?>"
                                            data-onevalue="<?= $skuPropertyVal['ID'] ?>"
                                        ><?= $skuPropertyVal['NAME'] ?></li>
                                      <?php endforeach; ?>
                                    <?php endif; ?>
                                  </ul>
                                  <div class="ar-down"></div>
                                </div>
                              <?php else: ?>
                                <ul class="sku-props clearfix">
                                  <?php if (!empty($skuProperty['VALUES'])): ?>
                                    <?php foreach ($skuProperty['VALUES'] as $skuPropertyVal): ?>
                                      <li title='<?= CKraken::prepareText($skuPropertyVal['NAME']) ?>'
                                          class="detail-text"
                                          data-treevalue="<?= $skuProperty["ID"] ?>_<?= $skuPropertyVal['ID'] ?>"
                                          data-onevalue="<?= $skuPropertyVal['ID'] ?>"
                                      ><?= $skuPropertyVal['NAME'] ?></li>
                                    <?php endforeach; ?>
                                  <?php endif; ?>
                                </ul>
                              <?php endif; ?>
                            </div>
                          <?php endif; ?>
                        <?php endforeach; ?>
                      </div>
                    <?php endif; ?>
                  </div>
                  <?php
                    $isAvailable = true;
                    if (!$arItem["HAVEOFFERS"]) {
                      $isAvailable = isGoodAvailable($arItem["ID"]);
                    } else {
                      foreach ($arItem["PRODUCT_INFO"] as &$info) {
                        $info["IS_AVAILABLE"] = isGoodAvailable($info["PRODUCT_ID"]) ? "Y" : "N";
                      }
                    }
                  ?>
                  <div class="btn-detail-wrap">
                    <?php if ($arItem["HAVEOFFERS"]): ?>
                    <?php ?>
                    <div class="hidden-xs">
                      <?php endif; ?>
                      <?php if ($permCartOn = $KRAKEN_TEMPLATE_ARRAY["CART_ON"]["VALUE"][0] == "Y" && $arItem["PROPERTIES"]["CART_ADD_ON"]["VALUE"] == "Y"): ?>
                        <div class="def-wrap-btn <?= ($arItem["FIRST_ITEM"]["CAN_BUY"] == "Y") ? "" : "hidden"; ?>"
                             id="<?= $itemIds["WR_BTN_ADD2BASKET"] ?>">
                          <?php if ($isAvailable) : ?>
                            <a
                              class="button-def main-color <?= $KRAKEN_TEMPLATE_ARRAY["BTN_VIEW"]['VALUE'] ?> btn-add2basket"
                              id="<?= $itemIds["BTN_ADD2BASKET"] ?>"
                              data-product-id="<?= $arItem["FIRST_ITEM"]["PRODUCT_ID"] ?>">
                                <span class="first">
                                   <span
                                     class="txt"><?= $arItem["BTN_ADD2BASKET_NAME"] ?></span>
                                </span>
                              <span class="second">
                                  <span
                                    class="txt"><?= $arItem["BTN_ADDED2BASKET_NAME"] ?></span>
                              </span>
                            </a>
                          <?php endif; ?>
                        </div>
                      <?php endif; ?>
                      <?php
                        $permShowFastOrder = false;
                        if ($arItem["PROPERTIES"]["DONT_SHOW_FORM"]["VALUE"] != "Y" && $arResult["FORM_FAST_ORDER"] != "N" && strlen($arItem["BTN_FAST_ORDER_NAME"]) > 0)
                          $permShowFastOrder = true;
                      ?>
                      <?php if ($permShowFastOrder): ?>
                        <div class="def-wrap-btn <?= ($arItem["FIRST_ITEM"]["CAN_BUY"] == "Y") ? "" : "hidden"; ?>"
                             id="<?= $itemIds["WR_BTN_FAST_ORDER"] ?>">
                          <a class="button-def main-color <?= $KRAKEN_TEMPLATE_ARRAY["BTN_VIEW"]['VALUE'] ?>"
                             id="<?= $itemIds["BTN_FAST_ORDER"] ?>">
                            <?= $arItem["BTN_FAST_ORDER_NAME"] ?>
                          </a>
                        </div>
                      <?php endif; ?>
                      <?php if (strlen($KRAKEN_TEMPLATE_ARRAY["CTLG_MORE"]["VALUE"]) > 0): ?>
                        <a class="link-def" href="<?= $arItem["FIRST_ITEM"]["DETAIL_PAGE_URL"] ?>"
                           id="<?= $itemIds["BTN2DETAIL"] ?>">
                          <i class="ic-style fa fa-info" aria-hidden="true"></i><span
                            class="bord-bot"><?= $KRAKEN_TEMPLATE_ARRAY["CTLG_MORE"]["~VALUE"] ?></span>
                        </a>
                      <?php endif; ?>
                      <?php if ($arItem["HAVEOFFERS"]): ?>
                      <?php //if ($arItem["HAVEOFFERS"] && strlen($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["CATALOG_2DETAIL_BTN_NAME"]["VALUE"]) > 0): ?>
                    </div>
                  <?php ?>
                    <div class="def-wrap-btn visible-xs">
                      <a class="button-def main-color <?= $KRAKEN_TEMPLATE_ARRAY["BTN_VIEW"]['VALUE'] ?>"
                         href="<?= $arItem["FIRST_ITEM"]["DETAIL_PAGE_URL"] ?>">
                        <?= $KRAKEN_TEMPLATE_ARRAY["ITEMS"]["CATALOG_2DETAIL_BTN_NAME"]["~VALUE"] ?>
                      </a>
                    </div>
                  <?php endif; ?>
                  </div>
                </div>
                <?php ?>
              </div>
            </div>
          </div>
          <?php  */ ?>
        <?php if (($key + 1) % 2 == 0): ?>
          <div class="clearfix visible-xs"></div>
        <?php endif; ?>
        <?php if (($key + 1) % 3 == 0): ?>
          <div class="clearfix hidden-xs"></div>
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
        ?>
          <?php /* ?>
          <script>
            BX.message({
              ARTICLE: '<?=$KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["ARTICLE_SHORT"]?>',
            });
            var <?=$obName?> = new JCCatalogItem(<?=CUtil::PhpToJSObject($jsParams, false, true)?>);
          </script>
          <?php */ ?>
        <?php endforeach; ?>
        <!-- items-container -->
      </div>
    </div>
  </div>
  <?php
  $this->SetViewTarget("header-bg");
  echo $arResult["PICTURE"]["SRC"];
  $this->EndViewTarget();
  if ($arParams["DISPLAY_BOTTOM_PAGER"]): ?>
    <!-- pagination-container -->
    <?= $arResult["NAV_STRING"] ?>
    <!-- pagination-container -->
  <?php endif; ?>
<?php else: ?>
  <?php if ($arParams["FROM"] == "section"): ?>
    <?php
    $showAlert = true;
    if ($arParams["INCLUDE_SUBSECTIONS"] == "N") {
      $showAlert = false;
      $arSelect = array("ID");
      $arFilter = array("IBLOCK_ID" => $arParams["IBLOCK_ID"], "SECTION_ID" => $arParams["SECTION_ID"], "ACTIVE" => "Y", "SECTION_ACTIVE" => "Y", "SECTION_SCOPE" => "iblock", "INCLUDE_SUBSECTIONS" => "Y");
      $res = CIBlockElement::GetList(array("SORT" => "ASC"), $arFilter, false, array("nTopCount" => 1), $arSelect);
      if (intval($res->SelectedRowsCount()) <= 0)
        $showAlert = true;
      
    }
    ?>
    <?php if ($showAlert): ?>
      <div class="attention"><?= GetMessage("KRAKEN_TEMPLATES_CATALOG_SECTION_ATTENTION") ?></div>
      <style>
        .element-sort-wrap {
          display: none;
        }
      </style>
      <?php if ($admin_active): ?>
        <a target="_blank"
           href="/bitrix/admin/iblock_element_edit.php?IBLOCK_ID=<?= $arResult["IBLOCK_ID"] ?>&type=<?= $arResult["IBLOCK_TYPE_ID"] ?>&ID=0&lang=ru&IBLOCK_SECTION_ID=<?= $arResult["ID"] ?>&find_section_section=<?= $arResult["ID"] ?>&from=iblock_list_admin"
           class="button-def main-color big"><?= GetMessage("KRAKEN_TEMPLATES_CATALOG_SECTION_ADD") ?></a>
      <?php endif; ?>
    <?php endif; ?>
  <?php endif; ?>
<?php endif; ?>
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
    lazyLoad: false,
    loadOnScroll: !!'<?=($arParams['LOAD_ON_SCROLL'] === 'Y')?>',
    template: '<?=CUtil::JSEscape($signedTemplate)?>',
    ajaxId: '<?=CUtil::JSEscape($arParams['AJAX_ID'] ?? '')?>',
    parameters: '<?=CUtil::JSEscape($signedParams)?>',
    container: '<?=$containerName?>'
  });
</script>
<!-- component-end -->


