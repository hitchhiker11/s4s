<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
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
<?
  global $KRAKEN_TEMPLATE_ARRAY, $APPLICATION, $USER;
  CKraken::includeCustomMessages();

?>

<? $show_setting = $KRAKEN_TEMPLATE_ARRAY["MODE_FAST_EDIT"]['VALUE'][0]; ?>
<? $admin_active = ($USER->isAdmin() || $APPLICATION->GetGroupRight("concept.kraken") > "R"); ?>

<? if (!empty($arResult["ITEMS"])): ?>
  
  <?
  $two_cols = false;
  
  if ($KRAKEN_TEMPLATE_ARRAY["CATALOG_VIEW_XS"]["VALUE"] == "")
    $KRAKEN_TEMPLATE_ARRAY["CATALOG_VIEW_XS"]["VALUE"] = "6";
  
  
  if ($KRAKEN_TEMPLATE_ARRAY["CATALOG_VIEW_XS"]["VALUE"] == "6")
    $two_cols = true;
  
  
  $colsItem = "col-md-4 col-sm-6";
  
  $count = count($arResult["ITEMS"]);
  $classOffest = "";
  
  if (!isset($arParams["SEARCH_ELEMENTS_ID"])) {
    if (!$arParams["SIDE_MENU"]) {
      if ($count == 1)
        $classOffest = "col-lg-offset-four col-md-offset-four col-sm-offset-four";
      
      else if ($count == 2)
        $classOffest = "col-lg-offset-3 col-md-offset-3 col-sm-offset-0 col-xs-offset-0";
      
      else if ($count == 3)
        $classOffest = "col-lg-offset-one col-md-offset-one";
      
      
      $colsItem = "col-md-3 col-sm-4";
    }
  } else {
    $colsItem = "col-md-3 col-sm-4";
  }
  
  
  $btnShowItems = isset($arParams["SHOW_ITEMS_BTN"]);
  
  if ($btnShowItems)
    $show_count = intval($arParams["SHOW_ITEMS_BTN"]);
  
  
  ?>
  
  <?php if ($APPLICATION->GetCurPage() === "/search/catalog/") :
    $query = $_SERVER["QUERY_STRING"];
    $queriesArray = explode("&", $query);
    $replacedTags = [];
    foreach ($queriesArray as $q) {
      $qArr = explode("=", $q);
      if ($qArr[0] === "tag") {
        switch ($qArr[1]) {
          case "brand":
            $replacedTags[] = "бренд";
            break;
          case "spares":
            $replacedTags[] = "запчасти";
            break;
          case "equip":
            $replacedTags[] = "экипировка";
            break;
        }
      }
    }
    $replacedTags = implode(", ", $replacedTags);
    ?>
    <div style="margin-top: 50px;" class="k1-test">
      Представлены результаты поиска "<?= $_GET["q"] ?>"
      <?php if ($replacedTags) : ?>
        с фильтром «<?= $replacedTags ?>».
      <?php endif ?>
    </div>
  <?php endif ?>
  
  <div class="catalog-block k1-test <?= ($arParams["SIDE_MENU"]) ? "" : "col-xs-12" ?>">
    
    <div class="element-list <? if ($two_cols): ?>two-cols<? else: ?>one-col<? endif; ?> show-hidden-parent">
      <div class="row">
        
        <? foreach ($arResult["ITEMS"] as $key => $arItem): ?>
          
          <? $this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], $strElementEdit); ?>
          <? $this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], $strElementDelete, $arElementDeleteParams); ?>
          <?
          $mainId = $this->GetEditAreaId($arItem['ID']) . "_" . $arParams["MAIN_BLOCK_ID"];
          
          $obName = 'ob' . preg_replace('/[^a-zA-Z0-9_]/', 'x', $mainId) . "_" . $arParams["MAIN_BLOCK_ID"];
          
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
          );
          
          
          ?>
          
          <? if ($arItem["PROPERTIES"]["RESIZE_IMAGES"]["VALUE_XML_ID"] == "")
            $arItem["PROPERTIES"]["RESIZE_IMAGES"]["VALUE_XML_ID"] = "scale";
          ?>
          
          
          <div
            class="<?= $colsItem ?> col-xs-<?= $KRAKEN_TEMPLATE_ARRAY["CATALOG_VIEW_XS"]["VALUE"] ?> <?= ($key == 0) ? $classOffest : ""; ?>

                        show-hidden-child
                        <? if ($btnShowItems): ?>
                            <?= (($key + 1) > $show_count) ? "hidden" : "" ?>
                        <? endif; ?>
                        ">
            
            <div class="element-outer elem-hover" id="<?= $mainId ?>">
              
              <div class="element FLAT elem-hover-height-more">
                
                <div class="element-inner elem-hover-height">
                  
                  <? CKraken::admin_setting($arItem, false, $admin_active, $show_setting) ?>
                  
                  <div class="<? if (!$two_cols): ?>row<? endif; ?> clearfix">
                    
                    <div class="image-wrap <? if (!$two_cols): ?>col-sm-12 col-xs-5<? endif; ?>"
                         id="<?= $itemIds["GALLERY"] ?>">
                      
                      <table>
                        <tr>
                          <td class="gallery-list">
                            
                            <a href="<?= $arItem["FIRST_ITEM"]["DETAIL_PAGE_URL"] ?>">
                              <img class="img-responsive center-block animate_to_box lazyload"
                                   data-src="<?= $arItem["FIRST_ITEM"]["GALLERY"][0]["SMALL"] ?>"
                                   data-cart-id-img="<?= $arItem["FIRST_ITEM"]["PRODUCT_ID"] ?>"
                                   title="<?= $arItem["FIRST_ITEM"]["GALLERY"][0]["TITLE"] ?>"
                                   alt="<?= $arItem["FIRST_ITEM"]["GALLERY"][0]["ALT"] ?>"/>
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <? if (!empty($arItem["PROPERTIES"]["LABELS"]["VALUE_XML_ID"])): ?>
                        
                        <div class="icons-wrap">
                          
                          <? foreach ($arItem["PROPERTIES"]["LABELS"]["VALUE_XML_ID"] as $k => $xml_id): ?>
                            <div class="icon ic_<?= $xml_id ?>"
                                 title="<?= $arItem["PROPERTIES"]["LABELS"]["VALUE"][$k] ?>"></div>
                          <? endforeach; ?>
                        
                        </div>
                      
                      <? endif; ?>
                    </div>
                    
                    <div class="bot-part <? if (!$two_cols): ?>col-sm-12 col-xs-7<? endif; ?>">
                      
                      <div class="name">
                        <a href="<?= $arItem["FIRST_ITEM"]["DETAIL_PAGE_URL"] ?>" id="<?= $itemIds["NAME2DETAIL"] ?>">
                          <span><?= $arItem["FIRST_ITEM"]["NAME"] ?></span>
                        </a>
                      </div>
                      
                      
                      <div class="price-table <?= ($arItem["FIRST_ITEM"]["CAN_BUY"] == "Y") ? "" : "hidden" ?>"
                           id="<?= $itemIds["PRICE_BLOCK_ID"] ?>">
                        
                        <? /*if($arItem["HAVEOFFERS"]):?>

                                                    <div class="price-cell price bold <?=($arItem["FIRST_ITEM"]["REQUEST_PRICE"] == "Y")?"":"hidden"?>" id="<?=$itemIds["PRICE_REQUEST"]?>"><?=$KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["MESSAGE_REQUEST"]?></div>

                                                <?endif;*/ ?>
                        
                        <div
                          class="price-cell old-price <?= ($arItem["FIRST_ITEM"]["REQUEST_PRICE"] == "Y" || strlen($arItem["FIRST_ITEM"]["OLD_PRICE"]["VALUE"]) <= 0) ? "hidden" : "" ?>"
                          id="<?= $itemIds["OLDPRICE_VALUE"] ?>">
                          <?= (strlen($arItem["FIRST_ITEM"]["OLD_PRICE"]["VALUE"]) > 0) ? $arItem["FIRST_ITEM"]["OLD_PRICE"]["HTML"] : "" ?>
                        </div>
                        
                        <div
                          class="price-cell price <? if ($arItem["FIRST_ITEM"]["OLD_PRICE"]["VALUE"] > 0): ?>red-color<? endif; ?> <?= (strlen($arItem["FIRST_ITEM"]["PRICE"]["VALUE_FORMATED"]) <= 0) ? "hidden" : "" ?>"
                          id="<?= $itemIds["PRICE_VALUE"] ?>">
                          <?= (strlen($arItem["FIRST_ITEM"]["PRICE"]["VALUE_FORMATED"]) > 0) ? $arItem["FIRST_ITEM"]["PRICE"]["HTML"] : "" ?>
                        </div>
                      
                      </div>
                    
                    
                    </div>
                  
                  </div>
                
                </div>
                
                <div class="elem-hover-show">
                  
                  <div class="info-panel">
                    
                    <? if ($arItem["HAVEOFFERS"] && !empty($arItem["OFFERS_SKU"])): ?>
                      <div class="sku-block hidden-xs" id="<?= $itemIds["SKU_ID"] ?>">
                        <? foreach ($arItem['OFFERS_SKU'] as $skuProperty): ?>
                          
                          <? if (!empty($skuProperty['VALUES'])): ?>
                            
                            <div class="sku-row clearfix">
                              <div class="sku-wr-title">
                                <div
                                  class="sku-title"><?= $skuProperty["NAME"] ?><? if (strlen($skuProperty["HINT"])): ?>
                                    <i class="hint-sku fa fa-question-circle hidden-xs" data-toggle="tooltip"
                                       data-placement="bottom" title=""
                                       data-original-title='<?= CKraken::prepareText($skuProperty["HINT"]) ?>'></i>
                                  <? endif; ?></div>
                              </div>
                              
                              <? if ($skuProperty["VIEW"] == 'pic' || $skuProperty["VIEW"] == 'pic_with_info'): ?>
                                
                                <ul class="sku-props clearfix">
                                  
                                  <? foreach ($skuProperty['VALUES'] as $skuPropertyVal): ?>
                                    
                                    <?
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
                                      
                                      
                                      <? if ($skuProperty["VIEW"] == 'pic_with_info'): ?>
                                        
                                        <div class="wrapper-hover-board">
                                          <div class="img" style="<?= $styleHoverBoard ?>"></div>
                                          <div class="desc"><?= $skuPropertyVal['NAME'] ?></div>
                                          <div class="arrow"></div>
                                        </div>
                                      
                                      <? endif; ?>
                                      
                                      <span class="active-flag"></span>
                                    
                                    </li>
                                  
                                  
                                  <? endforeach; ?>
                                </ul>
                              
                              <? elseif ($skuProperty["VIEW"] == 'select'): ?>
                                
                                <div class="wrapper-select-input">
                                  
                                  <ul class="sku-props select-input">
                                    
                                    <li
                                      class="area-for-current-value"><?= $KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["SKU_SELECT_TITLE"] ?></li>
                                    
                                    <? if (!empty($skuProperty['VALUES'])): ?>
                                      
                                      <? foreach ($skuProperty['VALUES'] as $skuPropertyVal): ?>
                                        <li class="" title='<?= CKraken::prepareText($skuPropertyVal['NAME']) ?>'
                                            data-treevalue="<?= $skuProperty["ID"] ?>_<?= $skuPropertyVal['ID'] ?>"
                                            data-onevalue="<?= $skuPropertyVal['ID'] ?>"
                                        
                                        ><?= $skuPropertyVal['NAME'] ?></li>
                                      <? endforeach; ?>
                                    
                                    <? endif; ?>
                                  
                                  </ul>
                                  
                                  <div class="ar-down"></div>
                                
                                </div>
                              
                              
                              <? else: ?>
                                
                                <ul class="sku-props clearfix">
                                  
                                  <? if (!empty($skuProperty['VALUES'])): ?>
                                    
                                    <? foreach ($skuProperty['VALUES'] as $skuPropertyVal): ?>
                                      <li title='<?= CKraken::prepareText($skuPropertyVal['NAME']) ?>'
                                          class="detail-text"
                                          
                                          data-treevalue="<?= $skuProperty["ID"] ?>_<?= $skuPropertyVal['ID'] ?>"
                                          data-onevalue="<?= $skuPropertyVal['ID'] ?>"
                                      
                                      ><?= $skuPropertyVal['NAME'] ?></li>
                                    <? endforeach; ?>
                                  
                                  <? endif; ?>
                                </ul>
                              
                              
                              <? endif; ?>
                            
                            </div>
                          
                          <? endif; ?>
                        
                        <? endforeach; ?>
                      
                      </div>
                    <? endif; ?>
                  
                  </div>
                  
                  
                  <div class="btn-detail-wrap">
                    
                    <? if ($arItem["HAVEOFFERS"]): ?>
                    <div class="hidden-xs">
                      <? endif; ?>
                      
                      
                      
                      <? if ($permCartOn = $KRAKEN_TEMPLATE_ARRAY["CART_ON"]["VALUE"][0] == "Y" && $arItem["PROPERTIES"]["CART_ADD_ON"]["VALUE"] == "Y"): ?>
                        
                        <div class="def-wrap-btn <?= ($arItem["FIRST_ITEM"]["CAN_BUY"] == "Y") ? "" : "hidden"; ?>"
                             id="<?= $itemIds["WR_BTN_ADD2BASKET"] ?>">
                          
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
                        
                        </div>
                      
                      <? endif; ?>
                      
                      <?
                        
                        $permShowFastOrder = false;
                        
                        if ($arItem["PROPERTIES"]["DONT_SHOW_FORM"]["VALUE"] != "Y" && $arResult["FORM_FAST_ORDER"] != "N" && strlen($arItem["BTN_FAST_ORDER_NAME"]) > 0)
                          $permShowFastOrder = true;
                      ?>
                      
                      <? if ($permShowFastOrder): ?>
                        
                        <div class="def-wrap-btn <?= ($arItem["FIRST_ITEM"]["CAN_BUY"] == "Y") ? "" : "hidden"; ?>"
                             id="<?= $itemIds["WR_BTN_FAST_ORDER"] ?>">
                          
                          <a class="button-def main-color <?= $KRAKEN_TEMPLATE_ARRAY["BTN_VIEW"]['VALUE'] ?>"
                             id="<?= $itemIds["BTN_FAST_ORDER"] ?>">
                            <?= $arItem["BTN_FAST_ORDER_NAME"] ?>
                          </a>
                        </div>
                      
                      <? endif; ?>
                      
                      
                      <? if (strlen($KRAKEN_TEMPLATE_ARRAY["CTLG_MORE"]["VALUE"]) > 0): ?>
                        
                        <a class="link-def" href="<?= $arItem["FIRST_ITEM"]["DETAIL_PAGE_URL"] ?>"
                           id="<?= $itemIds["BTN2DETAIL"] ?>">
                          <i class="ic-style fa fa-info" aria-hidden="true"></i><span
                            class="bord-bot"><?= $KRAKEN_TEMPLATE_ARRAY["CTLG_MORE"]["~VALUE"] ?></span>
                        </a>
                      
                      <? endif; ?>
                      
                      <? if ($arItem["HAVEOFFERS"] && strlen($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["CATALOG_2DETAIL_BTN_NAME"]["VALUE"]) > 0): ?>
                    </div>
                    
                    <div class="def-wrap-btn visible-xs">
                      
                      <a class="button-def main-color <?= $KRAKEN_TEMPLATE_ARRAY["BTN_VIEW"]['VALUE'] ?>"
                         href="<?= $arItem["FIRST_ITEM"]["DETAIL_PAGE_URL"] ?>">
                        
                        <?= $KRAKEN_TEMPLATE_ARRAY["ITEMS"]["CATALOG_2DETAIL_BTN_NAME"]["~VALUE"] ?>
                      
                      </a>
                    
                    </div>
                  <? endif; ?>
                  
                  </div>
                
                </div>
              </div>
            
            </div>
          
          
          </div>
        
        
        <? if ($arParams["SIDE_MENU"]): ?>
        
        <? if (($key + 1) % 3 == 0): ?>
          <span class="clearfix hidden-sm hidden-xs"></span>
        <? endif; ?>
          
          <? if (($key + 1) % 2 == 0): ?>
          <span class="clearfix visible-sm visible-xs"></span>
        <? endif; ?>
        
        
        <? else: ?>
          
          <? if (($key + 1) % 4 == 0): ?>
          <span class="clearfix hidden-sm hidden-xs"></span>
        <? endif; ?>
          
          <? if (($key + 1) % 3 == 0): ?>
          <span class="clearfix visible-sm"></span>
        <? endif; ?>
          
          <? if (($key + 1) % 2 == 0): ?>
          <span class="clearfix visible-xs"></span>
        <? endif; ?>
        
        <? endif; ?>
        
        
        <?
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
          
          <script>
            
            BX.message({
              ARTICLE: '<?=$KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["ARTICLE_SHORT"]?>',
            });
            
            var <?=$obName?> = new JCCatalogItem(<?=CUtil::PhpToJSObject($jsParams, false, true)?>);
          </script>
        
        <? endforeach; ?>
        
        <div class="clearfix"></div>
        
        
        <? if (isset($arParams["SHOW_ITEMS_BTN"])): ?>
          <? if ($count > $show_count): ?>
            <div class="catalog-button-wrap center">
              <a class="button-def <?= $KRAKEN_TEMPLATE_ARRAY["BTN_VIEW"]["VALUE"] ?> secondary big show-hidden">
                <?= (strlen($arParams["SHOW_ITEMS_BTN_NAME"]) > 0) ? $arParams["SHOW_ITEMS_BTN_NAME"] : $KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["MESS_CATALOG_SHOW_ALL"] ?>
              </a>
            </div>
          
          <? endif; ?>
        <? endif; ?>
      
      
      </div>
    </div>
  
  </div>
  <div class="clearfix"></div>
  <? if ($arParams["DISPLAY_BOTTOM_PAGER"]): ?>
    <?= $arResult["NAV_STRING"] ?>
  <? endif; ?>
<?php else : ?>
  <div style="margin-top: 20px;display: flex;align-items: center;flex-direction: column; gap: 30px;">
    <span>Ничего не найдено.</span>
    <a href="/catalog/" class="button-def search-btn-style main-color">
      Вернуться в каталог
    </a>
  </div>
<? endif; ?>
