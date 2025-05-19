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
  $this->setFrameMode(true);
?>

<?php if (!empty($arResult["LABELS"] && !empty($arResult["ITEMS"]))): ?>
  <?php
  global $KRAKEN_TEMPLATE_ARRAY;
  CKraken::includeCustomMessages();
  ?>
  <?php $show_setting = $KRAKEN_TEMPLATE_ARRAY["MODE_FAST_EDIT"]['VALUE'][0]; ?>
  <?php $admin_active = ($USER->isAdmin() || $APPLICATION->GetGroupRight("concept.kraken") > "R"); ?>
  
  <div class="catalog-block with-tabs tab-control">
    <div class="container">
      <div class="row">
        <?php $counter = 0; ?>
        <div class="catalog-tabs hidden-sm hidden-xs clearfix">
          <?php foreach ($arResult["LABELS"] as $main_key => $id): ?>
            <div
              class="catalog-tab-element tab-menu col-lg-3 col-md-3 <?php if ($counter == 0): ?>active<?php endif; ?>"
              data-tab='id_<?= $main_key ?>'>
              <div class="name-wrap">
                <div class="name ic_<?= $main_key ?>">
                  <?= GetMessage("KRAKEN_TEMPLATES_CATALOG_SECTION_LABELS_SECTION_" . $main_key) ?> <span class='count'>(<?= count($arResult["ITEMS"][$id]) ?>)</span>
                </div>
                <div class="line"></div>
              </div>
            </div>
            <?php $counter++; ?>
          <?php endforeach; ?>
        </div>
      </div>
    </div>
    <div class="block-grey-line hidden-sm hidden-xs"></div>
    <?php
      $block_name = GetMessage('KRAKEN_TEMPLATES_CATALOG_SECTION_LABELS_SECTION');
      if (strlen($arResult['~NAME']) > 0)
        $block_name .= htmlspecialcharsEx(strip_tags(html_entity_decode($arResult['~NAME'])));
      else
        $block_name .= GetMessage('KRAKEN_TEMPLATES_CATALOG_SECTION_LABELS_SECTION_DEF');
    ?>
    <div class="catalog-content-wrap parent-tool-settings">
      <div class="container">
        <div class="tabb-content-wrap">
          <?php $counter = 0; ?>
          <?php foreach ($arResult["LABELS"] as $main_key => $id): ?>
            <div
              class="catalog-content tabb-content show-hidden-parent parent-slide-show <?php if ($counter == 0): ?>active<?php endif; ?>"
              data-tab='id_<?= $main_key ?>'>
              <div class="mob-title click-slide-show ">
                <?= GetMessage("KRAKEN_TEMPLATES_CATALOG_SECTION_LABELS_SECTION_" . $main_key) ?>
                <div class='main-color'></div>
                <span></span>
              </div>
              <div class="mob-show content-slide-show ">
                <?php
                  $two_cols = false;
                  if ($KRAKEN_TEMPLATE_ARRAY["CATALOG_VIEW_XS"]["VALUE"] == "")
                    $KRAKEN_TEMPLATE_ARRAY["CATALOG_VIEW_XS"]["VALUE"] = "6";
                  if ($KRAKEN_TEMPLATE_ARRAY["CATALOG_VIEW_XS"]["VALUE"] == "6")
                    $two_cols = true;
                ?>
                <div class="element-list <?php if ($two_cols): ?>two-cols<?php else: ?>one-col<?php endif; ?>">
                  <div class="row">
                    <?php if (!empty($arResult["ITEMS"][$id])): ?>
                      <?php foreach ($arResult["ITEMS"][$id] as $key => $arItem): ?>
                        <?php $this->AddEditAction($arItem['ID'], $arItem['EDIT_LINK'], $strElementEdit); ?>
                        <?php $this->AddDeleteAction($arItem['ID'], $arItem['DELETE_LINK'], $strElementDelete, $arElementDeleteParams); ?>
                        <?php
                        $mainId = $this->GetEditAreaId($arItem['ID']) . "_" . $arParams["MAIN_BLOCK_ID"] . "_" . $main_key;
                        $obName = 'ob' . preg_replace('/[^a-zA-Z0-9_]/', 'x', $mainId) . "_" . $arParams["MAIN_BLOCK_ID"] . $main_key;
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
                        <?php if ($arItem["PROPERTIES"]["RESIZE_IMAGES"]["VALUE_XML_ID"] == "")
                          $arItem["PROPERTIES"]["RESIZE_IMAGES"]["VALUE_XML_ID"] = "scale";
                        ?>
                        <div class="col-md-3 col-sm-4 col-xs-<?= $KRAKEN_TEMPLATE_ARRAY["CATALOG_VIEW_XS"]["VALUE"] ?>">
                          <div class="element-outer elem-hover" id="<?= $mainId ?>">
                            <div class="element FLAT elem-hover-height-more">
                              <div class="element-inner elem-hover-height">
                                <?php CKraken::admin_setting($arItem, false, $admin_active, $show_setting) ?>
                                <div class="<?php if (!$two_cols): ?>row<?php endif; ?> clearfix">
                                  <div class="image-wrap <?php if (!$two_cols): ?>col-sm-12 col-xs-5<?php endif; ?>"
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
                                    <?php if (!empty($arItem["PROPERTIES"]["LABELS"]["VALUE_XML_ID"])): ?>
                                      <div class="icons-wrap">
                                        <?php foreach ($arItem["PROPERTIES"]["LABELS"]["VALUE_XML_ID"] as $k => $xml_id): ?>
                                          <div class="icon ic_<?= $xml_id ?>"
                                               title="<?= $arItem["PROPERTIES"]["LABELS"]["VALUE"][$k] ?>"></div>
                                        <?php endforeach; ?>
                                      </div>
                                    <?php endif; ?>
                                  </div>
                                  <div
                                    class="bot-part <?php if (!$two_cols): ?>col-lg-12 col-md-12 col-sm-12 col-xs-7<?php endif; ?>">
                                    <div class="name">
                                      <a href="<?= $arItem["FIRST_ITEM"]["DETAIL_PAGE_URL"] ?>"
                                         id="<?= $itemIds["NAME2DETAIL"] ?>">
                                        <span><?= $arItem["FIRST_ITEM"]["NAME"] ?></span>
                                      </a>
                                    </div>
                                    <div
                                      class="price-table <?= ($arItem["FIRST_ITEM"]["CAN_BUY"] == "Y") ? "" : "hidden" ?>"
                                      id="<?= $itemIds["PRICE_BLOCK_ID"] ?>">
                                      <?php /*if($arItem["HAVEOFFERS"]):?>

                                                                                <div class="price-cell price bold <?=($arItem["FIRST_ITEM"]["REQUEST_PRICE"] == "Y")?"":"hidden"?>" id="<?=$itemIds["PRICE_REQUEST"]?>"><?=$KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["MESSAGE_REQUEST"]?></div>

                                                                            <?endif;*/ ?>
                                      
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
                              <div class="elem-hover-show">
                                <div class="info-panel">
                                  <?php if ($arItem["HAVEOFFERS"] && !empty($arItem["OFFERS_SKU"])): ?>
                                    <div class="sku-block hidden-xs" id="<?= $itemIds["SKU_ID"] ?>">
                                      <?php foreach ($arItem['OFFERS_SKU'] as $skuProperty): ?>
                                        <?php if (!empty($skuProperty['VALUES'])): ?>
                                          <div class="sku-row clearfix">
                                            <div class="sku-wr-title">
                                              <div
                                                class="sku-title"><?= $skuProperty["NAME"] ?><?php if (strlen($skuProperty["HINT"])): ?>
                                                  <i class="hint-sku fa fa-question-circle hidden-xs"
                                                     data-toggle="tooltip" data-placement="bottom" title=""
                                                     data-original-title='<?= CKraken::prepareText($skuProperty["HINT"]) ?>'></i>
                                                <?php endif; ?></div>
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
                                                      <li class=""
                                                          title='<?= CKraken::prepareText($skuPropertyVal['NAME']) ?>'
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
                                <div class="btn-detail-wrap">
                                  <?php if ($arItem["HAVEOFFERS"]): ?>
                                  <div class="hidden-xs">
                                    <?php endif; ?>
                                    <?php if ($permCartOn = $KRAKEN_TEMPLATE_ARRAY["CART_ON"]["VALUE"][0] == "Y" && $arItem["PROPERTIES"]["CART_ADD_ON"]["VALUE"] == "Y"): ?>
                                      <div
                                        class="def-wrap-btn <?= ($arItem["FIRST_ITEM"]["CAN_BUY"] == "Y") ? "" : "hidden"; ?>"
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
                                    <?php endif; ?>
                                    <?php
                                      $permShowFastOrder = false;
                                      if ($arItem["PROPERTIES"]["DONT_SHOW_FORM"]["VALUE"] != "Y" && $arResult["FORM_FAST_ORDER"] != "N" && strlen($arItem["BTN_FAST_ORDER_NAME"]) > 0)
                                        $permShowFastOrder = true;
                                    ?>
                                    <?php if ($permShowFastOrder): ?>
                                      <div
                                        class="def-wrap-btn <?= ($arItem["FIRST_ITEM"]["CAN_BUY"] == "Y") ? "" : "hidden"; ?>"
                                        id="<?= $itemIds["WR_BTN_FAST_ORDER"] ?>">
                                        <a
                                          class="button-def main-color <?= $KRAKEN_TEMPLATE_ARRAY["BTN_VIEW"]['VALUE'] ?>"
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
                                    <?php if ($arItem["HAVEOFFERS"] && strlen($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["CATALOG_2DETAIL_BTN_NAME"]["VALUE"]) > 0): ?>
                                  </div>
                                  <div class="def-wrap-btn visible-xs">
                                    <a class="button-def main-color <?= $KRAKEN_TEMPLATE_ARRAY["BTN_VIEW"]['VALUE'] ?>"
                                       href="<?= $arItem["FIRST_ITEM"]["DETAIL_PAGE_URL"] ?>">
                                      <?= $KRAKEN_TEMPLATE_ARRAY["ITEMS"]["CATALOG_2DETAIL_BTN_NAME"]["~VALUE"] ?>
                                    </a>
                                  </div>
                                <?php endif; ?>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      <?php if (($key + 1) % 4 == 0): ?>
                        <div class="clearfix visible-lg visible-md"></div>
                      <?php endif; ?>
                      <?php if (($key + 1) % 3 == 0): ?>
                        <div class="clearfix visible-sm"></div>
                      <?php endif; ?>
                      <?php if (($key + 1) % 2 == 0): ?>
                        <div class="clearfix visible-xs"></div>
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
                        <script>
                          BX.message({
                            ARTICLE: '<?=$KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["ARTICLE_SHORT"]?>',
                          });
                          var <?=$obName?> = new JCCatalogItem(<?=CUtil::PhpToJSObject($jsParams, false, true)?>);
                        </script>
                      <?php endforeach; ?>
                    <?php endif; ?>
                  </div>
                </div>
              </div>
            </div>
            <?php $counter++; ?>
          <?php endforeach; ?>
        </div>
      </div>
    </div>
  </div>
<?php endif; ?>