<? if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die(); ?>
<? $this->setFrameMode(true); ?>

<?
  global $KRAKEN_TEMPLATE_ARRAY;
  CKraken::includeCustomMessages();
?>
<? $show_setting = $KRAKEN_TEMPLATE_ARRAY["MODE_FAST_EDIT"]['VALUE'][0]; ?>
<? $admin_active = ($USER->isAdmin() || $APPLICATION->GetGroupRight("concept.kraken") > "R"); ?>
<?
  
  $block_name = htmlspecialcharsEx($arResult['~NAME']);
  
  
  $arWaterMark = array();
  
  if ($KRAKEN_TEMPLATE_ARRAY["CTLG_WATERMARK"]["VALUE"] > 0) {
    
    $arWaterMark = array(
      array(
        "name" => "watermark",
        "position" => "center",
        "type" => "image",
        "size" => "real",
        "file" => $_SERVER["DOCUMENT_ROOT"] . CFile::GetPath($KRAKEN_TEMPLATE_ARRAY["CTLG_WATERMARK"]["VALUE"]),
        //"fill" => "resize",
      )
    );
  }
  
  $btn_name_main = $KRAKEN_TEMPLATE_ARRAY["CTLG_BTN"]["~VALUE"];
  
  if (strlen($arResult["PROPERTIES"]["BUTTON_NAME"]["VALUE"]) > 0)
    $btn_name_main = $arResult["PROPERTIES"]["BUTTON_NAME"]["~VALUE"];
  
  
  $permPriceDiffAndReqPrice = false;
  $permShowFastOrder = false;
  $permCartOn = false;
  
  if (isset($arResult["FIRST_ITEM"]["DISCOUNT"]["VALUE"]))
    $permPriceDiffAndReqPrice = true;
  
  
  if ($arResult["PROPERTIES"]["DONT_SHOW_FORM"]["VALUE"] != "Y" && $arResult["FORM_FAST_ORDER"] != "N" && strlen($arResult["BTN_FAST_ORDER_NAME"]) > 0)
    $permShowFastOrder = true;
  
  if ($KRAKEN_TEMPLATE_ARRAY["CART_ON"]["VALUE"][0] == "Y" && $arResult["PROPERTIES"]["CART_ADD_ON"]["VALUE"] == "Y")
    $permCartOn = true;
?>


<? $this->SetViewTarget('catalog-left-menu'); ?>
<? if (!empty($arResult["SIDE_MENU"])): ?>
  <ul class='nav'>
    
    <? foreach ($arResult["SIDE_MENU"] as $key => $value): ?>
      
      <? if (strlen($value["NAME"]) > 0): ?>
        <li>
          <a href="#<?= $key ?>" class='scroll <? if ($key == "main"): ?>review<? endif; ?>'><?= $value["NAME"] ?></a>
        </li>
      <? endif; ?>
    
    <? endforeach; ?>
    
    <li class="back">
      <a
        href="<?= $arResult["SECTION"]["SECTION_PAGE_URL"] ?>"></a>
    </li>
  
  </ul>
<? endif; ?>
<? $this->EndViewTarget(); ?>


<? $this->SetViewTarget('empl-banner'); ?>


<?php
  if (gettype($arParams["EMPL_BANNER"]) === "string" && strlen($arParams["EMPL_BANNER"]) > 0): ?>
    
    <? $APPLICATION->IncludeComponent(
      "concept:kraken.news-list",
      "empl",
      array(
        "COMPOSITE_FRAME_MODE" => "N",
        "ELEMENTS_ID" => $arParams["EMPL_BANNER"],
        "VIEW" => "flat-banner",
        "COLS" => "col-xs-12",
        "SORT_BY1" => "SORT",
        "SORT_ORDER1" => "ASC",
      )
    ); ?>
  
  <? endif; ?>


<? $this->EndViewTarget(); ?>



<?
  $mainId = $this->GetEditAreaId($arResult['ID']) . '_detail';
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
    'DISCOUNT' => $mainId . '_price_discount',
    'DOTS' => $mainId . '_price_dots',
    'BTN_ADD2BASKET' => $mainId . '_add2basket',
    'BTN_FAST_ORDER' => $mainId . '_fast_order',
    'PRICE_COMMENT1' => $mainId . '_price_comment1',
    'CHARS' => $mainId . '_chars',
    'MAX_QUANTITY' => $mainId . '_max_quantity',
  );
?>


<div class="cart-info-block scroll-next-parent" id='main'>
  
  
  <div class="row clearfix">
    
    <div class="col-md-6 col-sm-5 col-xs-12 parent-show-pic">
      
      <div class="pics-block">
        
        <div id="<?= $itemIds["GALLERY"] ?>">
          <table class='big-pic'>
            <tr>
              <td class="gallery-list">
                <? if (!empty($arResult["FIRST_ITEM"]["GALLERY"])): ?>
                  
                  <? foreach ($arResult["FIRST_ITEM"]["GALLERY"] as $key => $value): ?>
                    
                    <div class="item-show-pic <? if ($key == 0): ?>active<? endif; ?>" data-show-pic='img-<?= $key ?>'>
                      
                      <a href="<?= $value["BIG"] ?>" data-gallery="gal-item" class="cursor-loop"
                         title="<?= $value["TITLE"] ?>">
                        <img
                          class='img-responsive center-block <? if ($key == 0): ?>animate_to_box<? endif; ?> lazyload'
                          data-src="<?= $value["SMALL"] ?>" <? if ($key == 0): ?> data-cart-id-img="<?= $arResult["FIRST_ITEM"]["PRODUCT_ID"] ?>"<? endif; ?>
                          alt="<?= $value["ALT"] ?>"/>
                        
                        <link itemprop="image" href="<?= $value["BIG"] ?>">
                      </a>
                    
                    </div>
                  
                  <? endforeach; ?>
                
                <? else: ?>
                  
                  
                  <div class="item-show-pic active">
                    <img class='img-responsive center-block animate_to_box lazyload'
                         data-src="<?= SITE_TEMPLATE_PATH ?>/images/ufo.jpg"
                         data-cart-id-img="<?= $arResult["FIRST_ITEM"]["PRODUCT_ID"] ?>" alt="<?= $value["ALT"] ?>">
                    
                    <link itemprop="image" href="<?= SITE_TEMPLATE_PATH ?>/images/ufo.jpg">
                  </div>
                
                <? endif; ?>
              
              </td>
            </tr>
          </table>
          
          
          <div class="tabs-pic">
            
            <div
              class="row gallery-control <?= (!empty($arResult["FIRST_ITEM"]["GALLERY"]) && count($arResult["FIRST_ITEM"]["GALLERY"]) > 1) ? "" : "hidden" ?>">
              
              <? foreach ($arResult["FIRST_ITEM"]["GALLERY"] as $key => $value): ?>
                
                <div class="col-xs-3 pic-item">
                  
                  <div class="mini-pic click-show-pic <? if ($key == 0): ?>active<? endif; ?>"
                       data-show-pic='img-<?= $key ?>' title="<?= $value["TITLE"] ?>">
                    <table>
                      <tr>
                        <td>
                          <div class="pic-border">
                            <img data-src="<?= $value["CONTROL"] ?>" class="img-responsive center-block lazyload"
                                 alt="<?= $value["ALT"] ?>">
                            <div class="pic-shadow"></div>
                          </div>
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
                
                <?= (($key + 1) % 4 == 0) ? "<span class=\"clearfix\"></span>" : ""; ?>
              
              <? endforeach; ?>
            
            </div>
          
          </div>
        
        
        </div>
        
        
        <? if (!empty($arResult["PROPERTIES"]["LABELS"]["VALUE_XML_ID"])): ?>
          
          <div class="icons">
            <? foreach ($arResult["PROPERTIES"]["LABELS"]["VALUE_XML_ID"] as $xml_id): ?>
              <div class="icon ic_<?= $xml_id ?>"></div>
            <? endforeach; ?>
          </div>
        
        <? endif; ?>
      
      </div>
    
    </div>
    
    
    <div class="col-lg-6 col-md-6 col-sm-7 col-xs-12">
      
      <div class="desc-part">
        
        <div class="footer-mob-cell
                    <?= (strlen($arResult["FIRST_ITEM"]["ARTICLE"]) > 0) ? "" : "no-article" ?> <?= (strlen($arResult["FIRST_ITEM"]["ARTICLE"]) > 0 || strlen($arResult["FIRST_ITEM"]["AVAILABLE"]["VALUE"]) > 0 || strlen($arResult["FIRST_ITEM"]["PREVIEW_TEXT"]) > 0) ? "" : "hidden" ?>"
             id="<?= $itemIds["ARTICLE_AVAILABLE_TEXT"] ?>">
          
          <div class="info-stoke-wrap row clearfix">
            
            <div class="col-sm-8 col-xs-6 <?= (strlen($arResult["FIRST_ITEM"]["ARTICLE"]) > 0) ? "" : "hidden" ?>"
                 id="<?= $itemIds["ARTICLE_BLOCK"] ?>">
              <div class="article italic"
                   id="<?= $itemIds["ARTICLE"] ?>"><?= GetMessage("KRAKEN_TEMPLATES_CATALOG_ELEMENT_ARTICLE") ?>
                &nbsp;<?= $arResult["FIRST_ITEM"]["ARTICLE"] ?></div>
              
              <span itemprop="additionalProperty" itemscope="" itemtype="http://schema.org/PropertyValue">
                                <meta itemprop="name"
                                      content="<?= GetMessage("KRAKEN_TEMPLATES_CATALOG_ELEMENT_ARTICLE") ?>">
                                <meta itemprop="value" content="<?= $arResult["FIRST_ITEM"]["ARTICLE"] ?>">
                            </span>
            
            </div>
            <div
              class="stoke-wrap col-sm-4 col-xs-6 <?= (strlen($arResult["FIRST_ITEM"]["AVAILABLE"]["VALUE"]) > 0) ? "" : "hidden" ?>"
              id="<?= $itemIds["AVAILABLE_BLOCK"] ?>">
              
              <div class="stoke <?= $arResult["FIRST_ITEM"]["AVAILABLE"]["VALUE_XML_ID"] ?>"
                   id="<?= $itemIds["AVAILABLE"] ?>">
                <?php global $USER; ?>
                <?php if ($USER->isAdmin()) : ?>
                  <?php if ($arResult["PROPERTIES"]["QUANTITY"] && $arResult["PROPERTIES"]["QUANTITY"]["VALUE"]) : ?>
                    <span id="<?= $itemIds["MAX_QUANTITY"] ?>"
                          style="margin-left: 5px;"><?= $arResult["PROPERTIES"]["QUANTITY"]["VALUE"] ?></span> шт.
                  <?php else : ?>
                    <?= (strlen($arResult["FIRST_ITEM"]["AVAILABLE"]["VALUE"]) > 0) ? $arResult["FIRST_ITEM"]["AVAILABLE"]["VALUE"] : "" ?>
                  <?php endif; ?>
                <?php else : ?>
                  <?= (strlen($arResult["FIRST_ITEM"]["AVAILABLE"]["VALUE"]) > 0) ? $arResult["FIRST_ITEM"]["AVAILABLE"]["VALUE"] : "" ?>
                <?php endif; ?>
              
              </div>
            
            </div>
          
          </div>
          
          
          <div class="preview-desc-wrap <?= (strlen($arResult["FIRST_ITEM"]["PREVIEW_TEXT"]) > 0) ? "" : "hidden" ?>"
               id="<?= $itemIds["PREVIEW_TEXT_BLOCK"] ?>">
            
            <div class="preview-desc" id="<?= $itemIds["PREVIEW_TEXT"] ?>"
                 itemprop="description"><?= (strlen($arResult["FIRST_ITEM"]["PREVIEW_TEXT"]) > 0) ? $arResult["FIRST_ITEM"]["PREVIEW_TEXT"] : "" ?></div>
            
            <? if ($arResult["BLOCKS"]): ?>
              <a
                class="style-scroll-ar-down scroll-next"><span><?= GetMessage("KRAKEN_TEMPLATES_CATALOG_ELEMENT_KNOW_MORE") ?></span></a>
            <? endif; ?>
          
          </div>
        
        
        </div>
        
        <?php
          $isAvailable = true;
          
          if (!$arResult["HAVEOFFERS"]) {
            $isAvailable = isGoodAvailable($arResult["ID"]);
          } else {
            foreach ($arResult["PRODUCT_INFO"] as &$info) {
              $info["IS_AVAILABLE"] = isGoodAvailable($info["PRODUCT_ID"]) ? "Y" : "N";
            }
          }
        ?>
        
        <? if ($arResult["HAVEOFFERS"] && !empty($arResult["OFFERS_SKU"])): ?>
          <div class="sku-block" id="<?= $itemIds["SKU_ID"] ?>">
            <? foreach ($arResult['OFFERS_SKU'] as $skuProperty): ?>
              
              <? if (!empty($skuProperty['VALUES'])): ?>
                
                <div class="sku-row clearfix">
                  <div class="sku-wr-title">
                    <div class="sku-title"><?= $skuProperty["NAME"] ?><? if (strlen($skuProperty["HINT"])): ?>
                        <i class="hint-sku fa fa-question-circle hidden-xs" data-toggle="tooltip"
                           data-placement="bottom" title=""
                           data-original-title='<?= str_replace("'", "\"", $skuProperty["HINT"]) ?>'></i>
                      <? endif; ?></div>
                  </div>
                  
                  <? if ($skuProperty["VIEW"] == 'pic' || $skuProperty["VIEW"] == 'pic_with_info'): ?>
                    
                    <ul class="sku-props">
                      
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
                        
                        <li title='<?= str_replace("'", "\"", $skuPropertyVal['NAME']) ?>' class="detail-color"
                            
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
                            <li class="" title='<?= str_replace("'", "\"", $skuPropertyVal['NAME']) ?>'
                                data-treevalue="<?= $skuProperty["ID"] ?>_<?= $skuPropertyVal['ID'] ?>"
                                data-onevalue="<?= $skuPropertyVal['ID'] ?>"
                            
                            ><?= $skuPropertyVal['NAME'] ?></li>
                          <? endforeach; ?>
                        
                        <? endif; ?>
                      
                      </ul>
                      
                      <div class="ar-down"></div>
                    
                    </div>
                  
                  
                  <? else: ?>
                    
                    <ul class="sku-props">
                      
                      <? if (!empty($skuProperty['VALUES'])): ?>
                        
                        <? foreach ($skuProperty['VALUES'] as $skuPropertyVal): ?>
                          <li title='<?= str_replace("'", "\"", $skuPropertyVal['NAME']) ?>' class="detail-text"
                              
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
        
        <div class="head-mob-cell">
          
          <div class="price-info-wrap">
            
            <? if ($arResult["HAVEOFFERS"] || $arResult["FIRST_ITEM"]["CAN_BUY"] == "Y"): ?>
              
              <div
                class="price-info-wrap-top <? if ($permShowFastOrder && $permCartOn): ?>two-btns<? endif; ?> <?= ($arResult["FIRST_ITEM"]["CAN_BUY"] == "Y") ? "" : "hidden" ?>"
                id="<?= $itemIds["PRICE_BLOCK_ID"] ?>">
                
                <div class="price-info-top">
                  
                  <div class="updesc <?= (strlen($arResult["FIRST_ITEM"]["PRICE_COMMENT1"]) > 0) ? "" : "hidden" ?>"
                       id="<?= $itemIds["PRICE_COMMENT1"] ?>"><?= (strlen($arResult["FIRST_ITEM"]["PRICE_COMMENT1"]) > 0) ? $arResult["FIRST_ITEM"]["PRICE_COMMENT1"] : "" ?></div>
                  
                  <div class="price-table">
                    
                    <? /*<div class="price price-cell <?=($arResult["FIRST_ITEM"]["REQUEST_PRICE"] == "Y")?"":"hidden"?>" id="<?=$itemIds["PRICE_REQUEST"]?>"><?=(strlen($arResult["FIRST_ITEM"]["PRICE"]["VALUE"])>0)? $arResult["FIRST_ITEM"]["PRICE"]["HTML_MD"]:""?></div>
                                        */ ?>
                    
                    
                    <div
                      class="price price-cell <? if ($arResult["FIRST_ITEM"]["OLD_PRICE"]["VALUE"] > 0): ?>red-color<? else: ?>big<? endif; ?>"
                      id="<?= $itemIds["PRICE_VALUE"] ?>">
                      
                      <?= $arResult["FIRST_ITEM"]["PRICE"]["HTML"]; ?>
                    
                    </div>
                    
                    <div
                      class="old-price price-cell <?= ($arResult["FIRST_ITEM"]["REQUEST_PRICE"] == "Y" || strlen($arResult["FIRST_ITEM"]["OLD_PRICE"]["VALUE"]) <= 0) ? "hidden" : "" ?>"
                      id="<?= $itemIds["OLDPRICE_VALUE"] ?>">
                      
                      <?= (strlen($arResult["FIRST_ITEM"]["OLD_PRICE"]["VALUE"]) > 0) ? $arResult["FIRST_ITEM"]["OLD_PRICE"]["HTML"] : "" ?>
                    
                    </div>
                  
                  </div>
                
                </div>
                
                
                <div class="price-dots <?= ($permPriceDiffAndReqPrice) ? "" : "hidden" ?>" id="<?= $itemIds["DOTS"] ?>">
                  <span class="left"></span>
                  <span class="right"></span>
                </div>
                
                <div class="price-info-bottom back">
                  
                  
                  <div class="updesc <?= ($permPriceDiffAndReqPrice) ? "" : "hidden" ?>"
                       id="<?= $itemIds["DISCOUNT"] ?>"><?= GetMessage("KRAKEN_TEMPLATES_CATALOG_ELEMENT_ECONOMY") ?>
                    &nbsp;<span class="total bold"><?= $arResult["FIRST_ITEM"]["DISCOUNT"]["HTML"] ?></span></div>
                  
                  
                  <? if (($permShowFastOrder) || ($permCartOn)): ?>
                    
                    <div
                      class="wrap-btn <? if (strlen($arResult["FIRST_ITEM"]["DISCOUNT"]["HTML"]) > 0): ?>marg<? endif; ?>">
                      
                      
                      <? if ($permCartOn): ?>
                        <?php if ($isAvailable): ?>
                          <a
                            class="button-def main-color <?= $KRAKEN_TEMPLATE_ARRAY["BTN_VIEW"]['VALUE'] ?> btn-add2basket"
                            id="<?= $itemIds["BTN_ADD2BASKET"] ?>"
                            data-product-id="<?= $arResult["FIRST_ITEM"]["PRODUCT_ID"] ?>">

                                                    <span class="first">
                                                       <span class="txt"><?= $arResult["BTN_ADD2BASKET_NAME"] ?></span>
                                                    </span>
                            
                            <span class="second">
                                                        <span
                                                          class="txt"><?= $arResult["BTN_ADDED2BASKET_NAME"] ?></span>
                                                    </span>
                          
                          </a>
                        <?php endif; ?>
                      
                      <? endif; ?>
                      
                      
                      <? if ($permShowFastOrder): ?>
                        
                        <?
                        $class_btn = "button-def fast-order-style shine main-color " . $KRAKEN_TEMPLATE_ARRAY["BTN_VIEW"]['VALUE'];
                        
                        if ($permCartOn)
                          $class_btn = "fast-order-style-sec";
                        ?>
                        
                        <a class="<?= $class_btn ?>" id="<?= $itemIds["BTN_FAST_ORDER"] ?>">
                          <? if ($permCartOn): ?>
                          <span
                            class="bord-bot"><? endif; ?><?= $arResult["BTN_FAST_ORDER_NAME"] ?><? if ($permCartOn): ?></span><? endif; ?>
                        </a>
                      
                      <? endif; ?>
                    </div>
                  
                  <? endif; ?>
                
                </div>
              
              </div>
            
            <? endif; ?>
            
            <? if (strlen($arResult["PROPERTIES"]["BTN_NAME"]["VALUE"]) > 0): ?>
              
              <?
              
              $arClass = array();
              $arClass = array(
                "XML_ID" => $arResult["PROPERTIES"]["BTN_TYPE"]["VALUE_XML_ID"],
                "FORM_ID" => $arResult["PROPERTIES"]["BTN_FORM"]["VALUE"],
                "MODAL_ID" => $arResult["PROPERTIES"]["BTN_MODAL"]["VALUE"],
                "QUIZ_ID" => $arResult["PROPERTIES"]["BTN_QUIZ"]["VALUE"]
              );
              
              $arAttr = array();
              $arAttr = array(
                "XML_ID" => $arResult["PROPERTIES"]["BTN_TYPE"]["VALUE_XML_ID"],
                "FORM_ID" => $arResult["PROPERTIES"]["BTN_FORM"]["VALUE"],
                "MODAL_ID" => $arResult["PROPERTIES"]["BTN_MODAL"]["VALUE"],
                "LINK" => $arResult["PROPERTIES"]["BTN_LINK"]["VALUE"],
                "BLANK" => $arResult["PROPERTIES"]["BTN_BLANK"]["VALUE_XML_ID"],
                "HEADER" => $block_name,
                "QUIZ_ID" => $arResult["PROPERTIES"]["BTN_QUIZ"]["VALUE"],
                "LAND_ID" => $arResult["PROPERTIES"]["BTN_LAND"]["VALUE"]
              );
              ?>
              
              <div class="wr-custom-btn">
                
                <a
                  class="button-def big main-color <?= $KRAKEN_TEMPLATE_ARRAY["BTN_VIEW"]['VALUE'] ?> <?= CKraken::buttonEditClass($arClass) ?>" <? if (strlen($arResult["PROPERTIES"]["BTN_ONCLICK"]["VALUE"]) > 0) {
                  $str_onclick = str_replace("'", "\"", $arResult["PROPERTIES"]["BTN_ONCLICK"]["VALUE"]);
                  
                  echo "onclick='" . $str_onclick . "'";
                  
                  $str_onclick = "";
                } ?>
                  
                  <?= CKraken::buttonEditAttr($arAttr) ?>
                >
                  
                  <?= $arResult["PROPERTIES"]["BTN_NAME"]["~VALUE"] ?>
                
                </a>
              
              </div>
            
            
            <? endif; ?>
            
            <? if (strlen($arResult["PROPERTIES"]["PRICE_COMMENT2"]["VALUE"]) > 0): ?>
              
              <div class="price-info-comment italic"><?= $arResult["PROPERTIES"]["PRICE_COMMENT2"]["~VALUE"] ?></div>
            
            <? endif; ?>
          
          </div>
        
        </div>
        
        <? if ($arResult["HAVEOFFERS"]): ?>
          
          <div itemprop="offers" itemscope itemtype="http://schema.org/AggregateOffer" style="display:none;">
            
            <? $prices = array(); ?>
            
            <? foreach ($arResult["OFFERS"] as $key => $arOffer): ?>
              
              <? $currency = $arOffer["PRODUCT_INFO"]["PRICE"]["CURRENCY"]; ?>
              
              <? if ($arOffer["PRODUCT_INFO"]["PRICE"]["VALUE"] > 0): ?>
                <? $prices[] = $arOffer["PRODUCT_INFO"]["PRICE"]["VALUE"]; ?>
              <? endif; ?>
              
              <div itemprop="offers" itemscope="" itemtype="http://schema.org/Offer" style="display:none;">
                
                <a itemprop="url" href="<?= $arOffer["PRODUCT_INFO"]["DETAIL_PAGE_URL"] ?>"></a>
                <meta itemprop="price" content="<?= $arOffer["PRODUCT_INFO"]["PRICE"]["VALUE"] ?>">
                <meta itemprop="priceCurrency" content="<?= $arOffer["PRODUCT_INFO"]["PRICE"]["CURRENCY"] ?>">
                
                <?
                  $avail = "";
                  
                  if ($arOffer["PRODUCT_INFO"]["AVAILABLE"]["VALUE_XML_ID"] == "in")
                    $avail = "InStock";
                  
                  elseif ($arOffer["PRODUCT_INFO"]["AVAILABLE"]["VALUE_XML_ID"] == "out")
                    $avail = "OutOfStock";
                  
                  elseif ($arOffer["PRODUCT_INFO"]["AVAILABLE"]["VALUE_XML_ID"] == "order")
                    $avail = "PreOrder";
                
                ?>
                
                <? if (strlen($avail) > 0): ?>
                  <link itemprop="availability" href="http://schema.org/<?= $avail ?>">
                <? endif; ?>
              
              </div>
            
            <? endforeach; ?>
            
            <? if (empty($prices)): ?>
              <? $prices = array("0"); ?>
            <? endif; ?>
            
            <meta itemprop="offerCount" content="<?= count($arResult["OFFERS"]) ?>">
            <meta itemprop="lowPrice" content="<?= min($prices) ?>">
            <meta itemprop="highPrice" content="<?= max($prices) ?>">
            <meta itemprop="priceCurrency" content="<?= $currency ?>">
          
          </div>
        
        <? else: ?>
          
          <div itemprop="offers" itemscope itemtype="http://schema.org/Offer" style="display:none;">
            
            <a itemprop="url" href="<?= $arResult["FIRST_ITEM"]["DETAIL_PAGE_URL"] ?>"></a>
            
            <?
              $avail = "";
              
              if ($arResult["FIRST_ITEM"]["AVAILABLE"]["VALUE_XML_ID"] == "in")
                $avail = "InStock";
              
              elseif ($arResult["FIRST_ITEM"]["AVAILABLE"]["VALUE_XML_ID"] == "out")
                $avail = "OutOfStock";
              
              elseif ($arResult["FIRST_ITEM"]["AVAILABLE"]["VALUE_XML_ID"] == "order")
                $avail = "PreOrder";
            
            ?>
            
            <? if (strlen($avail) > 0): ?>
              <link itemprop="availability" href="http://schema.org/<?= $avail ?>">
            <? endif; ?>
            
            <?= $arResult["FIRST_ITEM"]["PRICE"]["HTML_MD"]; ?>
          
          </div>
        
        <? endif; ?>
      
      
      </div>
    </div>
  </div>


</div>


<?
  
  $jsParams = array(
    'PRODUCT_TYPE' => ($arResult["HAVEOFFERS"]) ? "OFFERS" : "PRODUCT",
    'CONFIG' => array(
      'USE_ADD2BASKET' => $permCartOn,
      'USE_FAST_ORDER' => $permShowFastOrder,
      'USE_SKU' => true,
      'USE_SCROLL2CHARS' => $arResult["BLOCKS"],
      'EMPTY_SKU' => ($arResult["HAVEOFFERS"] && !empty($arResult["OFFERS_SKU"])) ? false : true
    ),
    'VISUAL' => $itemIds,
    'PRODUCT' => $arResult["PRODUCT_INFO"],
    'FAST_ORDER_FORM_ID' => $arResult["FORM_FAST_ORDER"]
  );
  
  if ($arResult["HAVEOFFERS"] && !empty($arResult["OFFERS_SKU"])) {
    $jsParams["TREE_PROPS"] = $arResult["OFFERS_SKU"];
    $jsParams['OFFER_SELECTED'] = $arResult["OFFER_SELECTED"];
  }


?>


<? foreach ($arResult["BLOCK_SORT"] as $main_key => $val): ?>
  
  
  <? if ($main_key == "advantages" && !empty($arResult["PROPERTIES"]["ADVANTAGES"]["VALUE"])): ?>
    
    <div class="cart-block clearfix" id="advantages">
      
      <? if ($arResult["PROPERTIES"]["HIDELINE_BLOCK2"]["VALUE"] != "Y"): ?>
        
        <div
          class="cart-title <? if (strlen($arResult["PROPERTIES"]["TITLE_BLOCK2"]["VALUE"]) <= 0): ?>empty-title<? endif; ?> clearfix">
          
          <? if (strlen($arResult["PROPERTIES"]["TITLE_BLOCK2"]["VALUE"]) > 0): ?>
            <div class="title"><?= $arResult["PROPERTIES"]["TITLE_BLOCK2"]["~VALUE"] ?></div>
          <? endif; ?>
          
          <div class="line"></div>
        
        </div>
      
      <? endif; ?>
      
      <div class="cart-advantage">
        <div class="row clearfix">
          
          <div class="adv-table">
            <? $total_count = count($arResult["PROPERTIES"]["ADVANTAGES"]["VALUE"]); ?>
            
            <? foreach ($arResult["PROPERTIES"]["ADVANTAGES"]["VALUE"] as $key => $arAdv): ?>
            
            <?
              
              
              $row = 4;
              $class = "col-lg-3 col-md-3 col-sm-4 col-xs-12";
              
              if ($total_count % 3 == 0) {
                $row = 3;
                $class = "col-lg-4 col-md-4 col-sm-4 col-xs-12";
              }
              
              if ($total_count == 2) {
                $row = 2;
                $class = "col-lg-6 col-md-6 col-sm-6 col-xs-12";
              }
              
              if ($total_count == 1) {
                $row = 1;
                $class = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
              }
            
            ?>
            
            
            <div class="<?= $class ?> adv-cell">
              <table>
                <tr>
                  
                  <td class="img">
                    
                    <? if ($arAdv["PREVIEW_PICTURE"] > 0): ?>
                      
                      <? $file = CFile::ResizeImageGet($arAdv["PREVIEW_PICTURE"], array('width' => 100, 'height' => 100), BX_RESIZE_IMAGE_PROPORTIONAL, false); ?>
                      
                      <img data-src="<?= $file["src"] ?>" class="img-responsive center-block lazyload" alt=""/>
                    
                    <? elseif (strlen($arAdv["PROPERTIES"]["ICON"]["VALUE"]) && $arAdv["PREVIEW_PICTURE"] <= 0): ?>
                      
                      <div class="icon">
                        <i class="<?= $arAdv["PROPERTIES"]["ICON"]["VALUE"] ?>"
                           <? if (strlen($arAdv["PROPERTIES"]["ICON"]["DESCRIPTION"]) > 0): ?>style="color: <?= $arAdv["PROPERTIES"]["ICON"]["DESCRIPTION"] ?>;"<? endif; ?>></i>
                      </div>
                    
                    <? else: ?>
                      
                      
                      <div class="icon default"></div>
                    
                    <? endif; ?>
                  
                  </td>
                  
                  <td class='text'><?= $arAdv["PROPERTIES"]["SIGN"]["~VALUE"] ?></td>
                
                </tr>
              </table>
            </div>
            
            
            <? if (($key + 1) % $row == 0 && ($total_count - 1) != $key): ?>
            
            <!-- <div class="clearfix"></div> -->
          
          </div> <!-- ^adv-table -->
          
          <div class="adv-table">
            
            <? endif; ?>
            
            
            <? /*if(($key+1)%2 == 0):?>
	                            <div class="clearfix visible-sm"></div>
	                        <?endif;*/ ?>
            
            <? endforeach; ?>
          
          </div> <!-- ^adv-table -->
        
        
        </div>
      </div>
    
    </div>
  
  <? endif; ?>
  
  
  <? if ($main_key == "chars" && (!empty($arResult["CHARS_SORT"]) || !empty($arResult["PROPERTIES"]["FILES"]["VALUE"]))): ?>
    
    
    <div class="cart-block clearfix" id='chars'>
      
      <? if ($arResult["PROPERTIES"]["HIDELINE_BLOCK3"]["VALUE"] != "Y"): ?>
        
        <div
          class="cart-title <? if (strlen($arResult["PROPERTIES"]["TITLE_BLOCK3"]["VALUE"]) <= 0): ?>empty-title<? endif; ?> clearfix">
          
          <? if (strlen($arResult["PROPERTIES"]["TITLE_BLOCK3"]["VALUE"]) > 0): ?>
            <div class="title"><?= $arResult["PROPERTIES"]["TITLE_BLOCK3"]["~VALUE"] ?></div>
          <? endif; ?>
          
          <div class="line"></div>
        </div>
      
      <? endif; ?>
      
      <div class="cart-char <? //=($arResult["CHARS"]["COUNT"]>0)?"":"hidden"?>">
        <div class="row clearfix">
          
          <? if (!empty($arResult["CHARS_SORT"])): ?>
            
            <div
              class="<? if (!empty($arResult["PROPERTIES"]["FILES"]["VALUE"])): ?>col-md-8 col-xs-12<? else: ?>col-xs-12<? endif; ?>">
              
              <div
                class="cart-char-table-wrap <? if (!empty($arResult["PROPERTIES"]["FILES"]["VALUE"])): ?>right-col<? endif; ?> show-hidden-parent">
                
                <? $countChars = 0; ?>
                
                <? foreach ($arResult["CHARS_SORT"] as $keyChar => $valueChar): ?>
                  
                  
                  <? if ($keyChar == "sku_chars"): ?>
                    
                    <div id="<?= $itemIds['CHARS'] ?>">
                      
                      <? if (!empty($arResult["FIRST_ITEM"]["SKU_CHARS"])): ?>
                        
                        <? foreach ($arResult["FIRST_ITEM"]["SKU_CHARS"] as $key => $value): ?>
                          
                          <table class='cart-char-table mobile-break show-hidden-child' itemprop="additionalProperty"
                                 itemscope="" itemtype="http://schema.org/PropertyValue">
                            <tr>
                              <td class="left" itemprop="name"><?= $value["NAME"] ?></td>
                              
                              <td class="dotted">
                                <div class="dotted"></div>
                              </td>
                              
                              <td class="right bold" itemprop="value"><?= $value["VALUE"] ?></td>
                            </tr>
                          </table>
                        
                        <? endforeach; ?>
                      
                      <? endif; ?>
                    
                    </div>
                  
                  <? elseif ($keyChar == "props_chars"): ?>
                    
                    <? if (!empty($arResult["PROPS_CHARS"])): ?>
                      
                      <? foreach ($arResult["PROPS_CHARS"] as $key => $value): ?>
                        
                        <table
                          class='cart-char-table props_chars_js mobile-break show-hidden-child <? if ($countChars >= 5): ?>hidden<? endif; ?>'
                          itemprop="additionalProperty" itemscope="" itemtype="http://schema.org/PropertyValue">
                          <tr>
                            <td class="left" itemprop="name"><?= $value["NAME"] ?></td>
                            
                            <td class="dotted">
                              <div class="dotted"></div>
                            </td>
                            
                            <td class="right bold" itemprop="value"><?= $value["DESCRIPTION"] ?></td>
                          </tr>
                        </table>
                        
                        <? $countChars++ ?>
                      
                      <? endforeach; ?>
                    
                    <? endif; ?>
                  
                  <? elseif ($keyChar == "prop_chars"): ?>
                    
                    <? if (!empty($arResult["PROP_CHARS"])): ?>
                      
                      <? foreach ($arResult["PROP_CHARS"] as $key => $value): ?>
                        
                        <table
                          class='cart-char-table prop_chars_js mobile-break show-hidden-child <? if ($countChars >= 5): ?>hidden<? endif; ?>'
                          itemprop="additionalProperty" itemscope="" itemtype="http://schema.org/PropertyValue">
                          <tr>
                            <td class="left" itemprop="name"><?= $value["NAME"] ?></td>
                            
                            <td class="dotted">
                              <div class="dotted"></div>
                            </td>
                            
                            <td class="right bold" itemprop="value"><?= $value["DESCRIPTION"] ?></td>
                          </tr>
                        </table>
                        
                        <? $countChars++ ?>
                      
                      <? endforeach; ?>
                    
                    <? endif; ?>
                  
                  <? endif; ?>
                
                
                <? endforeach; ?>
                
                
                
                <? if ($countChars > 5): ?>
                  
                  <div class="show-hidden-wrap">
                    <a
                      class="style-scroll-ar-down show-hidden"><span><?= GetMessage("KRAKEN_TEMPLATES_CATALOG_ELEMENT_SHOW_ALL") ?></span></a>
                  </div>
                
                <? endif; ?>
              
              
              </div>
            </div>
          
          <? endif; ?>
          
          
          <? if (!empty($arResult["PROPERTIES"]["FILES"]["VALUE"])): ?>
            
            <div class="col-md-4 col-xs-12">
              
              <? foreach ($arResult["PROPERTIES"]["FILES"]["VALUE"] as $k => $file): ?>
                
                <a target="_blank" href="<?= CFile::GetPath($file) ?>">
                  
                  <table class='info-desc'>
                    <tr>
                      
                      <td class='img'>
                        <div class="file-img"></div>
                      </td>
                      
                      <td class='desc-wrap'>
                        <div class="desc-top"><?= $arResult["PROPERTIES"]["FILES_DESC"]["VALUE"][$k] ?></div>
                        
                        <? if (strlen($arResult["PROPERTIES"]["FILES_DESC"]["DESCRIPTION"][$k]) > 0): ?>
                          <div class="desc-bot"><?= $arResult["PROPERTIES"]["FILES_DESC"]["DESCRIPTION"][$k] ?></div>
                        <? endif; ?>
                      </td>
                    
                    </tr>
                  </table>
                
                </a>
              
              <? endforeach; ?>
            
            </div>
          
          <? endif; ?>
        
        </div>
      </div>
    
    </div>
  
  <? endif; ?>
  
  <? if ($main_key == "video" && !empty($arResult["PROPERTIES"]["VIDEO"]["VALUE"])): ?>
    
    <div class="cart-block clerfix" id='video'>
      
      <? if ($arResult["PROPERTIES"]["HIDELINE_BLOCK4"]["VALUE"] != "Y"): ?>
        
        <div
          class="cart-title <? if (strlen($arResult["PROPERTIES"]["TITLE_BLOCK4"]["VALUE"]) <= 0): ?>empty-title<? endif; ?> clearfix">
          
          <? if (strlen($arResult["PROPERTIES"]["TITLE_BLOCK4"]["VALUE"]) > 0): ?>
            <div class="title"><?= $arResult["PROPERTIES"]["TITLE_BLOCK4"]["~VALUE"] ?></div>
          <? endif; ?>
          
          <div class="line"></div>
        
        </div>
      
      <? endif; ?>
      
      <div class="cart-video">
        
        <div class="row">
          
          <? foreach ($arResult["PROPERTIES"]["VIDEO"]["VALUE"] as $key => $video): ?>
            
            <div class="cart-video-item clearfix video-start-parent">
              <img class="lazyload img-for-lazyload video-start-js"
                   data-src="<?= SITE_TEMPLATE_PATH ?>/images/one_px.png">
              
              <div
                class="<? if (strlen($arResult["PROPERTIES"]["VIDEO_DESC"]["VALUE"][$key]) > 0 || strlen($arResult["PROPERTIES"]["VIDEO_DESC"]["DESCRIPTION"][$key]) > 0): ?>col-md-8 col-xs-12<? else: ?>col-xs-12<? endif; ?>">
                
                <div
                  class="videoframe-wrap <? if (strlen($arResult["PROPERTIES"]["VIDEO_DESC"]["VALUE"][$key]) > 0 || strlen($arResult["PROPERTIES"]["VIDEO_DESC"]["DESCRIPTION"][$key]) > 0): ?>right-col<? endif; ?>">
                  
                  
                  <? $iframe = CKraken::createVideo($video); ?>
                  
                  <div class="iframe-video-area" data-src="<?= htmlspecialcharsbx($iframe["HTML"]) ?>"></div>
                </div>
              
              </div>
              
              
              <? if (strlen($arResult["PROPERTIES"]["VIDEO_DESC"]["VALUE"][$key]) > 0 || strlen($arResult["PROPERTIES"]["VIDEO_DESC"]["DESCRIPTION"][$key]) > 0): ?>
                
                <div class="col-md-4 col-xs-12">
                  
                  <div class="video-text text-content">
                    
                    <? if (strlen(trim($arResult["PROPERTIES"]["VIDEO_DESC"]["VALUE"][$key])) > 0): ?>
                      <h4><?= $arResult["PROPERTIES"]["VIDEO_DESC"]["VALUE"][$key] ?></h4>
                    <? endif; ?>
                    
                    <? if (strlen($arResult["PROPERTIES"]["VIDEO_DESC"]["DESCRIPTION"][$key]) > 0): ?>
                      <p><?= $arResult["PROPERTIES"]["VIDEO_DESC"]["DESCRIPTION"][$key] ?></p>
                    <? endif; ?>
                  
                  </div>
                
                </div>
              
              <? endif; ?>
            
            </div>
          
          <? endforeach; ?>
        
        
        </div>
      </div>
    
    </div>
  
  <? endif; ?>
  
  
  <? if ($main_key == "similar" && !empty($arResult["PROPERTIES"]["SIMILAR"]["VALUE"])): ?>
    
    <div class="cart-block clearfix" id='similar'>
      
      <? if ($arResult["PROPERTIES"]["HIDELINE_BLOCK5"]["VALUE"] != "Y"): ?>
        
        <div
          class="cart-title <? if (strlen($arResult["PROPERTIES"]["TITLE_BLOCK5"]["VALUE"]) <= 0): ?>empty-title<? endif; ?> clearfix">
          
          <? if (strlen($arResult["PROPERTIES"]["TITLE_BLOCK5"]["VALUE"]) > 0): ?>
            <div class="title"><?= $arResult["PROPERTIES"]["TITLE_BLOCK5"]["~VALUE"] ?></div>
          <? endif; ?>
          
          <div class="line"></div>
        </div>
      
      <? endif; ?>
      
      <div class="cart-catalog-list-wrap">
        
        <?
          $GLOBALS['arFilterDetailSimilarCatalog'] = array("ID" => $arResult["PROPERTIES"]["SIMILAR"]["VALUE"]);
          
          $APPLICATION->IncludeComponent(
            "bitrix:catalog.section",
            "main",
            array(
              "FILTER_NAME" => "arFilterDetailSimilarCatalog",
              "IBLOCK_TYPE" => $KRAKEN_TEMPLATE_ARRAY['CATALOG']["IBLOCK_TYPE"],
              "IBLOCK_ID" => $KRAKEN_TEMPLATE_ARRAY['CATALOG']["IBLOCK_ID"],
              "SIDE_MENU" => true,
              "MAIN_BLOCK_ID" => $arResult["ID"],
            
            ),
            $component
          ); ?>
      
      
      </div>
    
    </div>
  
  <? endif; ?>
  
  
  <? if ($main_key == "stuff" && !empty($arResult["PROPERTIES"]["STUFF"]["VALUE"])): ?>
    
    <div class="cart-block clearfix" id='stuff'>
      
      
      <? if ($arResult["PROPERTIES"]["HIDELINE_BLOCK6"]["VALUE"] != "Y"): ?>
        
        <div
          class="cart-title <? if (strlen($arResult["PROPERTIES"]["TITLE_BLOCK6"]["VALUE"]) <= 0): ?>empty-title<? endif; ?> clearfix">
          
          <? if (strlen($arResult["PROPERTIES"]["TITLE_BLOCK6"]["VALUE"]) > 0): ?>
            <div class="title"><?= $arResult["PROPERTIES"]["TITLE_BLOCK6"]["~VALUE"] ?></div>
          <? endif; ?>
          
          <div class="line"></div>
        </div>
      
      <? endif; ?>
      
      <div class="empl-full cart-empl-full clearfix">
        
        <? $arEmpl = $arResult["PROPERTIES"]["STUFF"]["VALUE"]; ?>
        
        <? CKraken::admin_setting($arEmpl, false, $admin_active, $show_setting) ?>
        
        <? if (strlen($arEmpl["PROPERTIES"]["EMPL_DESC"]["~VALUE"]) > 0): ?>
          
          
          <div
            class="empl-desc col-lg-offset-4 col-md-offset-4 col-sm-offset-0 col-xs-offset-0 col-lg-8 col-md-8 col-sm-12 col-xs-12"
            title='<?= $arItem["PROPERTIES"]["EMPL_DESC"]["~VALUE"] ?>'><?= $arEmpl["PROPERTIES"]["EMPL_DESC"]["~VALUE"] ?></div>
        
        <? endif; ?>
        
        <div class="empl-table">
          
          <div class="empl-cell col-lg-4 col-md-4 col-sm-12 col-xs-12 left">
            
            
            <div class="bg-fone"></div>
            
            <div class="container-photo">
              
              
              <div class="wrap-photo">
                
                <? $mainimg["src"] = SITE_TEMPLATE_PATH . '/images/empl.jpg'; ?>
                
                <? if (strlen($arEmpl["PREVIEW_PICTURE"]) > 0): ?>
                  <? $mainimg = CFile::ResizeImageGet($arEmpl["PREVIEW_PICTURE"], array('width' => 350, 'height' => 350), BX_RESIZE_IMAGE_EXACT, false); ?>
                <? endif; ?>
                
                
                <img
                  class="img-responsive center-block <? if ($arItem["PROPERTIES"]["ANIMATE"]["VALUE"] == "Y"): ?>wow zoomIn<? endif; ?> lazyload"
                  data-src="<?= $mainimg["src"] ?>" alt=''>
                <div class="icon-center main-color"><span></span></div>
              </div>
              
              
              <? if (strlen($arEmpl["~DETAIL_TEXT"]) > 0): ?>
                <div class="empl-under-desc italic"><?= $arEmpl["~DETAIL_TEXT"] ?></div>
              <? endif; ?>
              
              <? if (strlen($arEmpl["DETAIL_PICTURE"]) > 0): ?>
                
                <? $underimg = CFile::ResizeImageGet($arEmpl["DETAIL_PICTURE"], array('width' => 600, 'height' => 400), BX_RESIZE_IMAGE_PROPORTIONAL, false); ?>
                
                <img data-src="<?= $underimg["src"] ?>" class="img-responsive center-block under lazyload" alt=''>
              
              <? endif; ?>
            
            </div>
          
          </div>
          
          <div class="empl-cell col-lg-8 col-md-8 col-sm-12 col-xs-12 center">
            <div class="empl-name bold"><?= $arEmpl["~NAME"] ?></div>
            
            <? if (strlen($arEmpl["~PREVIEW_TEXT"]) > 0): ?>
              <div class="line main-color"></div>
              <div class="empl-text"><?= $arEmpl["~PREVIEW_TEXT"] ?></div>
            <? endif; ?>
            
            <? if ((strlen($arEmpl["PROPERTIES"]["BUTTON_NAME"]["~VALUE"]) > 0) || strlen($arEmpl["PROPERTIES"]["EMPL_PHONE"]["~VALUE"]) > 0 || strlen($arEmpl["PROPERTIES"]["EMPL_EMAIL"]["~VALUE"]) > 0): ?>
              
              
              <div class="wrap-info">
                <div class="row">
                  
                  <div class="empl-table-in">
                    
                    <?
                      $class1 = 'col-lg-4 col-md-4 col-sm-12 col-xs-12';
                      
                      if ($show_menu)
                        $class1 = 'col-lg-6 col-md-6 col-sm-12 col-xs-12';
                    
                    ?>
                    
                    <? if (strlen($arEmpl["PROPERTIES"]["BUTTON_NAME"]["~VALUE"]) > 0): ?>
                      
                      <?
                      if ($arEmpl["PROPERTIES"]["BUTTON_FORM"]["VALUE"] > 0)
                        $form_id = $arEmpl["PROPERTIES"]["BUTTON_FORM"]["VALUE"];
                      
                      if ($arEmpl["PROPERTIES"]["BUTTON_TYPE"]["VALUE_XML_ID"] == "")
                        $arEmpl["PROPERTIES"]["BUTTON_TYPE"]["VALUE_XML_ID"] = "form";
                      
                      if ($arEmpl["PROPERTIES"]["BUTTON_TYPE"]["VALUE_XML_ID"] == "fast_order") {
                        $form_id = $KRAKEN_TEMPLATE_ARRAY['FORMS']['VALUE_CATALOG'];
                        
                        if ($arEmpl["PROPERTIES"]["BUTTON_FORM"]["VALUE"] > 0)
                          $form_id = $arEmpl["PROPERTIES"]["BUTTON_FORM"]["VALUE"];
                      }
                      
                      $arClass = array();
                      $arClass = array(
                        "XML_ID" => $arEmpl["PROPERTIES"]["BUTTON_TYPE"]["VALUE_XML_ID"],
                        "FORM_ID" => $form_id,
                        "MODAL_ID" => $arEmpl["PROPERTIES"]["BUTTON_MODAL"]["VALUE"],
                        "QUIZ_ID" => $arEmpl["PROPERTIES"]["BUTTON_QUIZ"]["VALUE"],
                        "CUR_ELEMENT_ID" => $arEmpl["PROPERTIES"]["BUTTON_CATALOG"]["VALUE"]
                      );
                      
                      $arAttr = array();
                      $arAttr = array(
                        "XML_ID" => $arEmpl["PROPERTIES"]["BUTTON_TYPE"]["VALUE_XML_ID"],
                        "FORM_ID" => $form_id,
                        "MODAL_ID" => $arEmpl["PROPERTIES"]["BUTTON_MODAL"]["VALUE"],
                        "LINK" => $arEmpl["PROPERTIES"]["BUTTON_LINK"]["VALUE"],
                        "BLANK" => $arEmpl["PROPERTIES"]["BUTTON_BLANK"]["VALUE_XML_ID"],
                        "HEADER" => $block_name,
                        "QUIZ_ID" => $arEmpl["PROPERTIES"]["BUTTON_QUIZ"]["VALUE"],
                        "LAND_ID" => $arEmpl["PROPERTIES"]["BUTTON_LAND"]["VALUE"],
                        "CUR_ELEMENT_ID" => $arEmpl["PROPERTIES"]["BUTTON_CATALOG"]["VALUE"],
                        "OFFER_ID" => $arEmpl["PROPERTIES"]["BUTTON_OFFER_ID"]["VALUE"]
                      );
                      ?>
                      
                      <div class="empl-cell-in <?= $class1 ?> left">
                        <a
                          
                          <?
                            if (strlen($arEmpl["PROPERTIES"]["BUTTON_ONCLICK"]["VALUE"]) > 0) {
                              $str_onclick = str_replace("'", "\"", $arEmpl["PROPERTIES"]["BUTTON_ONCLICK"]["VALUE"]);
                              echo "onclick='" . $str_onclick . "'";
                              $str_onclick = "";
                            }
                          ?>
                          
                          class="button-def main-color <?= $KRAKEN_TEMPLATE_ARRAY["BTN_VIEW"]['VALUE'] ?> <?= CKraken::buttonEditClass($arClass) ?>"
                          title='<?= $arEmpl["PROPERTIES"]["BUTTON_NAME"]["VALUE"] ?>'
                          
                          <?= CKraken::buttonEditAttr($arAttr) ?>
                        
                        >
                          
                          <? if ($arEmpl["PROPERTIES"]["BUTTON_TYPE"]["VALUE_XML_ID"] == "add_to_cart"): ?>
                            <?
                            
                            $btn_name2 = $KRAKEN_TEMPLATE_ARRAY["MESS"]["EMPL"]["BTN_ADDED_NAME"];
                            
                            if (strlen($KRAKEN_TEMPLATE_ARRAY["CART_BTN_ADDED_NAME"]["~VALUE"]) > 0)
                              $btn_name2 = $KRAKEN_TEMPLATE_ARRAY["CART_BTN_ADDED_NAME"]["~VALUE"];
                            ?>
                            
                            <span class="first">
                                                           <?= $arEmpl["PROPERTIES"]["BUTTON_NAME"]["~VALUE"] ?>
                                                        </span>
                            
                            <span class="second">
                                                            <?= $btn_name2 ?>
                                                        </span>
                          
                          <? else: ?>
                            
                            <?= $arEmpl['PROPERTIES']['BUTTON_NAME']['~VALUE'] ?>
                          
                          <? endif; ?>
                        
                        
                        </a>
                      </div>
                    <? endif; ?>
                    
                    
                    
                    
                    <? if (strlen($arEmpl["PROPERTIES"]["EMPL_PHONE"]["~VALUE"]) > 0 || strlen($arEmpl["PROPERTIES"]["EMPL_EMAIL"]["~VALUE"]) > 0): ?>
                      <div class="<?= $class1 ?> empl-cell-in center">
                        <? if (strlen($arEmpl["PROPERTIES"]["EMPL_PHONE"]["~VALUE"]) > 0): ?>
                          
                          <div class="empl-phone bold"><span
                              title='<?= $arEmpl["PROPERTIES"]["EMPL_PHONE"]["VALUE"] ?>'>

                                                        <? $phone = preg_replace('/[^0-9+]/', '', $arEmpl['PROPERTIES']['EMPL_PHONE']['VALUE']); ?>

                                                        <a
                                                          href="tel:<?= $phone ?>"><?= $arEmpl['PROPERTIES']['EMPL_PHONE']['~VALUE'] ?></a>

                                                    </span></div>
                        
                        <? endif; ?>
                        
                        <? if (strlen($arEmpl["PROPERTIES"]["EMPL_EMAIL"]["~VALUE"]) > 0): ?>
                          <div class="empl-email"><a href="mailto:<?= $arEmpl["PROPERTIES"]["EMPL_EMAIL"]["~VALUE"] ?>"><span
                                class="bord-bot"
                                title='<?= $arEmpl["PROPERTIES"]["EMPL_EMAIL"]["VALUE"] ?>'><?= $arEmpl["PROPERTIES"]["EMPL_EMAIL"]["~VALUE"] ?></span></a>
                          </div>
                        <? endif; ?>
                      </div>
                    <? endif; ?>
                  
                  
                  </div>
                
                </div>
              </div>
            
            <? endif; ?>
          </div>
        
        </div>
      
      </div>
    
    
    </div>
  
  <? endif; ?>
  
  
  <? if ($main_key == "reviews" && !empty($arResult["PROPERTIES"]["REVIEWS"]["VALUE"])): ?>
    
    <div class="cart-block clearfix" id='reviews'>
      
      <? if ($arResult["PROPERTIES"]["HIDELINE_BLOCK7"]["VALUE"] != "Y"): ?>
        
        <div
          class="cart-title <? if (strlen($arResult["PROPERTIES"]["TITLE_BLOCK7"]["VALUE"]) <= 0): ?>empty-title<? endif; ?> clearfix">
          
          <? if (strlen($arResult["PROPERTIES"]["TITLE_BLOCK7"]["VALUE"]) > 0): ?>
            <div class="title"><?= $arResult["PROPERTIES"]["TITLE_BLOCK7"]["~VALUE"] ?></div>
          <? endif; ?>
          
          <div class="line"></div>
        </div>
      
      <? endif; ?>
      
      <div class="news flat cart-news show-hidden-parent">
        
        <div class="row">
          
          
          <div class="wrap-elements">
            
            <? $class = "col-lg-4 col-md-4 col-sm-6 col-xs-12"; ?>
            
            <? foreach ($arResult["PROPERTIES"]["REVIEWS"]["VALUE"] as $k => $arNews): ?>
              
              <div class="<?= $class ?>">
                <div class="wrap-element">
                  
                  <div class="element">
                    <? CKraken::admin_setting($arNews, false, $admin_active, $show_setting) ?>
                    
                    <table>
                      <tr>
                        <td>
                          
                          <? $img["src"] = SITE_TEMPLATE_PATH . '/images/def_elem_nba.jpg'; ?>
                          
                          <? if (strlen($arNews["PREVIEW_PICTURE"]) > 0): ?>
                            <? $img = CFile::ResizeImageGet($arNews["PREVIEW_PICTURE"], array('width' => 600, 'height' => 400), BX_RESIZE_IMAGE_PROPORTIONAL, false); ?>
                          <? endif; ?>
                          
                          <a href='<?= $arNews["DETAIL_PAGE_URL"] ?>' class='hover_shine img-wrap'>
                            <div class='bg-img lazyload' data-src="<?= $img["src"] ?>">
                              
                              <div class="new-dark-shadow"></div>
                            
                            </div>
                            <div class="shine"></div>
                          </a>
                        
                        </td>
                      </tr>
                    </table>
                    
                    
                    <div class="wrap-text">
                      
                      
                      <? if ($arNews["IBLOCK_CODE"] != "concept_kraken_site_action_" . SITE_ID && $arResult["PARENT_ON"] == "Y"): ?>
                        <div class="section" title='<?= $arNews['SECTION_NAME'] ?>'>
                          
                          <?
                            
                            $name = "";
                            $link_news = "";
                            
                            if (strlen($arSection['BNA'][$arNews['IBLOCK_SECTION_ID']]['NAME']) > 0) {
                              
                              $name = $arSection['BNA'][$arNews['IBLOCK_SECTION_ID']]['~NAME'];
                              $link_news = $arSection['BNA'][$arNews['IBLOCK_SECTION_ID']]['SECTION_PAGE_URL'];
                            } else {
                              
                              $name_def = "NEWS";
                              $link_news = "/news/";
                              
                              if ($arNews["IBLOCK_CODE"] == "concept_kraken_site_history_" . SITE_ID) {
                                
                                $name_def = "BLOG";
                                $link_news = "/blog/";
                              }
                              
                              $name = GetMessage("KRAKEN_TEMPLATES_CATALOG_ELEMENT_DEF_" . $name_def);
                              
                            }
                          
                          ?>
                          
                          <a href='<?= $link_news ?>' class="wrap-link-sect"><?= $name ?></a>
                        </div>
                      
                      
                      <? endif; ?>
                      
                      <? if ($arNews["IBLOCK_CODE"] == "concept_kraken_site_action_" . SITE_ID): ?>
                        
                        <div class="date-action">
                          
                          <? if (getmicrotime() > MakeTimeStamp($arNews["ACTIVE_TO"]) && strlen($arNews["ACTIVE_TO"]) > 0): ?>
                            <span class="off"><?= GetMessage("KRAKEN_TEMPLATES_CATALOG_ELEMENT_ACT_OFF") ?></span>
                          <? else: ?>
                            
                            <? if (strlen($arNews["ACTIVE_TO"]) > 0): ?>
                              
                              <span
                                class="to"><?= GetMessage("KRAKEN_TEMPLATES_CATALOG_ELEMENT_ACT_ON_TO") ?><? echo CIBlockFormatProperties::DateFormat($KRAKEN_TEMPLATE_ARRAY['DATE_FORMAT']['VALUE'], MakeTimeStamp($arNews["ACTIVE_TO"], CSite::GetDateFormat())); ?></span>
                            
                            <? else: ?>
                              
                              <span><?= GetMessage("KRAKEN_TEMPLATES_CATALOG_ELEMENT_ACT_ON") ?></span>
                            
                            <? endif; ?>
                          
                          <? endif; ?>
                        
                        </div>
                      
                      <? endif; ?>
                      
                      
                      <a href='<?= $arNews["DETAIL_PAGE_URL"] ?>'>
                        <div class="new-name bold"><?= $arNews['~NAME'] ?></div>
                      </a>
                      
                      
                      <? if (strlen($arNews["ACTIVE_FROM"]) > 0): ?>
                        
                        
                        <div class="date">
                          <? if ($arNews["IBLOCK_CODE"] != "concept_kraken_site_action_" . SITE_ID): ?>
                            
                            <? if (strlen($arNews["ACTIVE_FROM"]) > 0): ?>
                              <?= CIBlockFormatProperties::DateFormat($KRAKEN_TEMPLATE_ARRAY['DATE_FORMAT']['VALUE'], MakeTimeStamp($arNews["ACTIVE_FROM"], CSite::GetDateFormat())); ?>
                            <? endif; ?>
                          
                          <? endif; ?>
                        </div>
                      
                      
                      <? endif; ?>
                      
                      
                      <? if (strlen($arNews["PROPERTIES"]["NEWS_DETAIL_TEXT"]["~VALUE"]['TEXT']) > 0): ?>
                        <a href='<?= $arNews["DETAIL_PAGE_URL"] ?>'>
                          <div class="new-text"><?= $arNews["PROPERTIES"]["NEWS_DETAIL_TEXT"]["~VALUE"]['TEXT'] ?></div>
                        </a>
                      <? endif; ?>
                    
                    </div>
                  
                  </div>
                  
                  <div class="new-shadow"></div>
                
                </div>
              
              </div>
              
              
              <? if (($k + 1) % 3 == 0): ?>
                <span class="clearfix hidden-sm"></span>
              <? endif; ?>
              
              <? if (($k + 1) % 2 == 0): ?>
                <span class="clearfix visible-sm"></span>
              <? endif; ?>
            
            
            <? endforeach; ?>
          
          </div>
        
        
        </div>
      
      </div>
    
    </div>
  
  <? endif; ?>
  
  
  <? if ($main_key == "faq" && !empty($arResult["PROPERTIES"]["FAQ"]["VALUE"])): ?>
    
    <div class="cart-block clearfix" id="faq">
      
      <? if ($arResult["PROPERTIES"]["HIDELINE_BLOCK8"]["VALUE"] != "Y"): ?>
        
        <div
          class="cart-title <? if (strlen($arResult["PROPERTIES"]["TITLE_BLOCK8"]["VALUE"]) <= 0): ?>empty-title<? endif; ?> clearfix">
          
          <? if (strlen($arResult["PROPERTIES"]["TITLE_BLOCK8"]["VALUE"]) > 0): ?>
            <div class="title"><?= $arResult["PROPERTIES"]["TITLE_BLOCK8"]["~VALUE"] ?></div>
          <? endif; ?>
          
          <div class="line"></div>
        
        </div>
      
      <? endif; ?>
      
      <div class="faq-block cart-faq-block">
        
        <? if (strlen($arResult["PROPERTIES"]["FAQ_PHOTO"]["VALUE"]) > 0 || strlen($arResult["PROPERTIES"]["FAQ_NAME"]["VALUE"]) > 0 || strlen($arResult["PROPERTIES"]["FAQ_POST"]["VALUE"]) > 0 || strlen($arResult["PROPERTIES"]["FAQ_BUTTON_NAME"]["VALUE"]) > 0): ?>
          
          <div class="faq-table clearfix">
            
            <?
              $class1 = "";
              $class2 = "col-sm-8 col-xs-12";
              $class3 = "col-sm-4 col-xs-12";
              
              if ($arResult["PROPERTIES"]["FAQ_PHOTO"]["VALUE"] > 0) {
                $class1 = "col-sm-2 col-xs-12";
                $class2 = "col-sm-6 col-xs-12 with-photo";
              }
            ?>
            
            
            <? if (strlen($arResult["PROPERTIES"]["FAQ_PHOTO"]["VALUE"]) > 0): ?>
              
              <div class="faq-cell <?= $class1 ?> left">
                <table>
                  <tr>
                    <td>
                      
                      <? $img_big = CFile::ResizeImageGet($arResult["PROPERTIES"]["FAQ_PHOTO"]["VALUE"], array('width' => 100, 'height' => 100), BX_RESIZE_IMAGE_EXACT, false); ?>
                      <img class="img-responsive center-block lazyload" data-src="<?= $img_big["src"] ?>" alt="">
                    
                    
                    </td>
                  </tr>
                </table>
              
              
              </div>
            <? endif; ?>
            
            
            <? if (strlen($arResult["PROPERTIES"]["FAQ_NAME"]["VALUE"]) > 0 || strlen($arResult["PROPERTIES"]["FAQ_POST"]["VALUE"]) > 0): ?>
              
              <div class="faq-cell <?= $class2 ?> center">
                <div class="wrap-faqtext">
                  
                  <? if (strlen($arResult["PROPERTIES"]["FAQ_NAME"]["VALUE"]) > 0): ?>
                    <div class="name bold"><?= $arResult["PROPERTIES"]["FAQ_NAME"]["VALUE"] ?></div>
                  <? endif; ?>
                  
                  <? if (strlen($arResult["PROPERTIES"]["FAQ_POST"]["VALUE"]) > 0): ?>
                    <div class="desc italic"><?= $arResult["PROPERTIES"]["FAQ_POST"]["VALUE"] ?></div>
                  <? endif; ?>
                
                </div>
              
              </div>
            
            <? endif; ?>
            
            <? if (strlen($arResult["PROPERTIES"]["FAQ_BUTTON_NAME"]["VALUE"]) > 0): ?>
              
              
              <div class="faq-cell <?= $class3 ?> right">
                
                <div class="main-button-wrap center">
                  
                  <a
                    class="big button-def main-color <?= $KRAKEN_TEMPLATE_ARRAY["BTN_VIEW"]['VALUE'] ?> callDialogForm faq-btn-form"
                    
                    data-main-id="<?= $arResult["ID"] ?>"
                    data-product-id="<?= $arResult["FIRST_ITEM"]["PRODUCT_ID"] ?>"
                    data-form-id="<?= $arResult["PROPERTIES"]["FAQ_FORM"]["VALUE"] ?>"
                    data-elementtype="CTL"
                    data-action="form"
                    
                    
                    data-header="<?= $block_name ?>"
                    data-call-modal="form<?= $arResult["PROPERTIES"]["FAQ_FORM"]["VALUE"] ?>"
                    title="<?= $arResult["PROPERTIES"]["FAQ_BUTTON_NAME"]["VALUE"] ?>"><?= $arResult["PROPERTIES"]["FAQ_BUTTON_NAME"]["VALUE"] ?></a>
                
                </div>
              
              </div>
            
            <? endif; ?>
          </div>
        
        <? endif; ?>
        
        <div class="quest-part">
          <div class="faq">
            
            <? foreach ($arResult["PROPERTIES"]["FAQ"]["VALUE"] as $key => $arQuestion): ?>
              
              
              <div
                class="faq-element quest-parent <? if ($key == 0 && $arResult["PROPERTIES"]["STUFF_HIDE_FIRST_ITEM"]["VALUE_XML_ID"] != "Y"): ?>active<? endif; ?>">
                <? CKraken::admin_setting($arQuestion, false, $admin_active, $show_setting) ?>
                
                <div class="question quest-click">
                  <span><?= $arQuestion["NAME"] ?></span>
                </div>
                
                <div class="text text-content italic quest-text"><?= $arQuestion["~PREVIEW_TEXT"] ?></div>
              </div>
            
            <? endforeach; ?>
          
          </div>
        </div>
      
      
      </div>
    
    </div>
  
  <? endif; ?>
  
  
  <? if ($main_key == "text" && strlen($arResult["DETAIL_TEXT"]) > 0): ?>
    
    <div class="cart-block clearfix" id="text">
      
      <? if ($arResult["PROPERTIES"]["HIDELINE_BLOCK9"]["VALUE"] != "Y"): ?>
        
        <div
          class="cart-title <? if (strlen($arResult["PROPERTIES"]["TITLE_BLOCK9"]["VALUE"]) <= 0): ?>empty-title<? endif; ?> clearfix">
          
          <? if (strlen($arResult["PROPERTIES"]["TITLE_BLOCK9"]["VALUE"]) > 0): ?>
            <div class="title"><?= $arResult["PROPERTIES"]["TITLE_BLOCK9"]["~VALUE"] ?></div>
          <? endif; ?>
          
          <div class="line"></div>
        </div>
      
      <? endif; ?>
      
      <div class="cart-simple-text text-content"><?= $arResult["~DETAIL_TEXT"] ?></div>
    
    </div>
  
  
  <? endif; ?>
  
  
  <? if ($main_key == "text2" && is_array($arResult["PROPERTIES"]["DETAIL_TEXT_BLOCK12"]["VALUE"]) > 0): ?>
    
    <div class="cart-block clearfix" id="text2">
      
      <? if ($arResult["PROPERTIES"]["HIDELINE_BLOCK12"]["VALUE"] != "Y"): ?>
        
        <div
          class="cart-title <? if (strlen($arResult["PROPERTIES"]["TITLE_BLOCK12"]["VALUE"]) <= 0): ?>empty-title<? endif; ?> clearfix">
          
          <? if (strlen($arResult["PROPERTIES"]["TITLE_BLOCK12"]["VALUE"]) > 0): ?>
            <div class="title"><?= $arResult["PROPERTIES"]["TITLE_BLOCK12"]["~VALUE"] ?></div>
          <? endif; ?>
          
          <div class="line"></div>
        </div>
      
      <? endif; ?>
      
      <? if (isset($arResult["PROPERTIES"]["DETAIL_TEXT_BLOCK12"]["VALUE"]["TEXT"])): ?>
        
        <div
          class="cart-simple-text text-content"><?= $arResult["PROPERTIES"]["DETAIL_TEXT_BLOCK12"]["~VALUE"]["TEXT"] ?></div>
      
      <? endif; ?>
    
    </div>
  
  
  <? endif; ?>
  
  <? if ($main_key == "text3" && is_array($arResult["PROPERTIES"]["DETAIL_TEXT_BLOCK13"]["VALUE"]) > 0): ?>
    
    <div class="cart-block clearfix" id="text3">
      
      <? if ($arResult["PROPERTIES"]["HIDELINE_BLOCK13"]["VALUE"] != "Y"): ?>
        
        <div
          class="cart-title <? if (strlen($arResult["PROPERTIES"]["TITLE_BLOCK13"]["VALUE"]) <= 0): ?>empty-title<? endif; ?> clearfix">
          
          <? if (strlen($arResult["PROPERTIES"]["TITLE_BLOCK13"]["VALUE"]) > 0): ?>
            <div class="title"><?= $arResult["PROPERTIES"]["TITLE_BLOCK13"]["~VALUE"] ?></div>
          <? endif; ?>
          
          <div class="line"></div>
        </div>
      
      <? endif; ?>
      
      <? if (isset($arResult["PROPERTIES"]["DETAIL_TEXT_BLOCK13"]["VALUE"]["TEXT"])): ?>
        
        <div
          class="cart-simple-text text-content"><?= $arResult["PROPERTIES"]["DETAIL_TEXT_BLOCK13"]["~VALUE"]["TEXT"] ?></div>
      
      <? endif; ?>
    
    </div>
  
  
  <? endif; ?>
  
  
  <? if ($main_key == "gallery" && !empty($arResult["PROPERTIES"]["GALLERY"]["VALUE"])): ?>
    
    <div class="cart-block clearfix" id="gallery">
      
      <? if ($arResult["PROPERTIES"]["HIDELINE_BLOCK10"]["VALUE"] != "Y"): ?>
        
        <div
          class="cart-title <? if (strlen($arResult["PROPERTIES"]["TITLE_BLOCK10"]["VALUE"]) <= 0): ?>empty-title<? endif; ?> clearfix">
          
          <? if (strlen($arResult["PROPERTIES"]["TITLE_BLOCK10"]["VALUE"]) > 0): ?>
            <div class="title"><?= $arResult["PROPERTIES"]["TITLE_BLOCK10"]["~VALUE"] ?></div>
          <? endif; ?>
          
          <div class="line"></div>
        </div>
      
      <? endif; ?>
      
      <div class="cart-simple-gllery">
        
        <? if ($arResult["PROPERTIES"]["GALLERY_COLS"]["VALUE_XML_ID"] == ""): ?>
          <? $arResult["PROPERTIES"]["GALLERY_COLS"]["VALUE_XML_ID"] = "four"; ?>
        <? endif; ?>
        
        <? if ($arResult["PROPERTIES"]["GALLERY_COLS"]["VALUE_XML_ID"] == "one"): ?>
          
          <div class="single-photos">
            
            <? foreach ($arResult["PROPERTIES"]["GALLERY"]["VALUE"] as $k => $photo): ?>
              
              <div class="photo-item row clearfix">
                
                <div
                  class="<? if (strlen($arResult["PROPERTIES"]["GALLERY"]["DESCRIPTION"][$k]) > 0): ?>col-md-8 col-xs-12<? else: ?>col-xs-12<? endif; ?>">
                  
                  <div
                    class="photo-wrap <? if (strlen($arResult["PROPERTIES"]["GALLERY"]["DESCRIPTION"][$k]) > 0): ?>right-col<? endif; ?>">
                    
                    <? $file = CFile::ResizeImageGet($photo, array('width' => 800, 'height' => 800), BX_RESIZE_IMAGE_PROPORTIONAL, false); ?>
                    <? $file_big = CFile::ResizeImageGet($photo, array('width' => 2000, 'height' => 1500), BX_RESIZE_IMAGE_PROPORTIONAL, false, $arWaterMark); ?>
                    
                    <a href="<?= $file_big["src"] ?>" data-gallery="gal-item-add" class="cursor-loop"
                       title="<?= $arResult["PROPERTIES"]["GALLERY"]["~DESCRIPTION"][$k] ?>">
                      <img class="img-responsive lazyload" data-src="<?= $file["src"] ?>" alt=""/>
                    </a>
                  
                  
                  </div>
                
                </div>
                
                
                <? if (strlen($arResult["PROPERTIES"]["GALLERY"]["DESCRIPTION"][$k]) > 0): ?>
                  
                  <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    
                    <div class="photo-text text-content">
                      
                      <? if (strlen($arResult["PROPERTIES"]["GALLERY"]["DESCRIPTION"][$k]) > 0): ?>
                        <p><?= $arResult["PROPERTIES"]["GALLERY"]["~DESCRIPTION"][$k] ?></p>
                      <? endif; ?>
                    
                    </div>
                  
                  </div>
                
                <? endif; ?>
              
              </div>
            
            
            <? endforeach; ?>
          
          </div>
        
        
        <? else: ?>
          
          <div class="row">
            
            <div class="gallery-block">
              
              <? $size_big = array('width' => 2000, 'height' => 1500); ?>
              
              <? if ($arResult["PROPERTIES"]["GALLERY_COLS"]["VALUE_XML_ID"] == "two"): ?>
                
                <? $class = "col-lg-6 col-md-6 col-sm-6 col-xs-6"; ?>
                <? $size = array('width' => 400, 'height' => 400); ?>
                
                <? $clear = 2; ?>
              
              <? endif; ?>
              
              <? if ($arResult["PROPERTIES"]["GALLERY_COLS"]["VALUE_XML_ID"] == "three"): ?>
                
                <? $class = "col-lg-4 col-md-4 col-sm-4 col-xs-6"; ?>
                <? $size = array('width' => 500, 'height' => 500); ?>
                
                <? $clear = 3; ?>
              
              <? endif; ?>
              
              <? if ($arResult["PROPERTIES"]["GALLERY_COLS"]["VALUE_XML_ID"] == "four"): ?>
                
                <? $class = "col-lg-3 col-md-3 col-sm-3 col-xs-6"; ?>
                <? $size = array('width' => 400, 'height' => 400); ?>
                
                <? $clear = 4; ?>
              
              <? endif; ?>
              
              <? if ($arResult["PROPERTIES"]["GALLERY_COLS"]["VALUE_XML_ID"] == "five"): ?>
                
                <? $class = "col-lg-five col-md-five col-sm-five col-xs-6"; ?>
                <? $size = array('width' => 300, 'height' => 300); ?>
                
                <? $clear = 5; ?>
              
              <? endif; ?>
              
              <? if ($arResult["PROPERTIES"]["GALLERY_COLS"]["VALUE_XML_ID"] == "six"): ?>
                
                <? $class = "col-lg-2 col-md-2 col-sm-2 col-xs-6"; ?>
                <? $size = array('width' => 200, 'height' => 200); ?>
                
                <? $clear = 6; ?>
              
              <? endif; ?>
              
              <? foreach ($arResult["PROPERTIES"]["GALLERY"]["VALUE"] as $k => $photo): ?>
                
                <div class="<?= $class ?>">
                  
                  <div class="gallery-img">
                    
                    <? $file = CFile::ResizeImageGet($photo, $size, BX_RESIZE_IMAGE_EXACT, false); ?>
                    <? $file_big = CFile::ResizeImageGet($photo, $size_big, BX_RESIZE_IMAGE_PROPORTIONAL, false, $arWaterMark); ?>
                    
                    <a href="<?= $file_big["src"] ?>" data-gallery="gal-item-add" class="cursor-loop"
                       title="<?= $arResult["PROPERTIES"]["GALLERY"]["~DESCRIPTION"][$k] ?>">
                      
                      <div class="corner-line"></div>
                      <img class="img-responsive center-block lazyload" data-src="<?= $file["src"] ?>" alt=""/>
                    
                    </a>
                  
                  </div>
                
                </div>
                
                
                <? if (($k + 1) % $clear == 0): ?>
                  <div class="clearfix hidden-xs"></div>
                <? endif; ?>
                
                <? if (($k + 1) % 2 == 0): ?>
                  <div class="clearfix visible-xs"></div>
                <? endif; ?>
              
              <? endforeach; ?>
            
            
            </div>
          
          </div>
        
        <? endif; ?>
      
      
      </div>
    
    </div>
  
  
  <? endif; ?>


<? endforeach; ?>


<script>
  
  BX.message({
    ECONOMY_MESSAGE: '<?=GetMessage("KRAKEN_TEMPLATES_CATALOG_ELEMENT_ECONOMY")?>',
    MORE: '<?=GetMessage("KRAKEN_TEMPLATES_CATALOG_ELEMENT_KNOW_MORE")?>',
    ARTICLE: '<?=GetMessage("KRAKEN_TEMPLATES_CATALOG_ELEMENT_ARTICLE")?>',
  });
  
  var <?=$obName?> = new JCCatalogElement(<?=CUtil::PhpToJSObject($jsParams, false, true)?>);
</script>