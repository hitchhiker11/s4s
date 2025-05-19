<? global $KRAKEN_TEMPLATE_ARRAY; ?>
  <div class="no-click-block"></div>
  
  <div class="wrapper-cart fly-basket">
    
    <input class="link_empty_cart" type="hidden" value="">
    
    <?
      /*<div class="area_for_widget hidden-xs">

      
  
      \Bitrix\Main\Page\Frame::getInstance()->startDynamicWithID("area-mini_cart");
          $APPLICATION->IncludeComponent(
              "concept:kraken.mini_cart",
              "widget",
              Array(
                  "CURRENT_SITE" => SITE_ID,
                  "MESSAGE_404" => "",
                  "SET_STATUS_404" => "N",
                  "SHOW_404" => "N",
                  "MODE" => $KRAKEN_TEMPLATE_ARRAY["CART_MINICART_MODE"]["VALUE"],
                  "DESC_EMPTY" => $KRAKEN_TEMPLATE_ARRAY["CART_MINICART_DESC_EMPTY"]["VALUE"],
                  "DESC_NOEMPTY" => $KRAKEN_TEMPLATE_ARRAY["CART_MINICART_DESC_NOEMPTY"]["VALUE"],
                  "LINK" => $KRAKEN_TEMPLATE_ARRAY["CART_MINICART_LINK_PAGE"]["VALUE"]
              )
          );
      \Bitrix\Main\Page\Frame::getInstance()->finishDynamicWithID("area-mini_cart");
      

      
  </div>*/ ?>
    
    <? if ($APPLICATION->GetCurDir() != SITE_DIR . "cart/"): ?>
      
      <div
        class="open-cart <?= $KRAKEN_TEMPLATE_ARRAY["CART_MINICART_MODE"]["VALUE"] ?> basket-count-control-widget-in-public hidden-xs">
        <div class="before_pulse"></div>
        <div class="after_pulse"></div>
        
        <span class="count basket-count-value">0</span>
        
        <? if ($KRAKEN_TEMPLATE_ARRAY["CART_MINICART_DESC_EMPTY"]["VALUE"]): ?><span
          class="desc-empty"><?= $KRAKEN_TEMPLATE_ARRAY["CART_MINICART_DESC_EMPTY"]["VALUE"] ?></span><? endif; ?>
        <? if ($KRAKEN_TEMPLATE_ARRAY["CART_MINICART_DESC_NOEMPTY"]["VALUE"]): ?><span
          class="desc-no-empty"><?= $KRAKEN_TEMPLATE_ARRAY["CART_MINICART_DESC_NOEMPTY"]["VALUE"] ?></span><? endif; ?>
        
        <? if (strlen($KRAKEN_TEMPLATE_ARRAY["CART_MINICART_LINK_PAGE"]["VALUE"]) > 0): ?><a class="cart_link scroll"
                                                                                             href="<?= $KRAKEN_TEMPLATE_ARRAY["CART_MINICART_LINK_PAGE"]["VALUE"] ?>"></a><? endif; ?>
      
      </div>
    
    <? endif; ?>
    
    
    <?
      if ($KRAKEN_TEMPLATE_ARRAY['CART_HEAD_BG']['VALUE'] > 0)
        $bg = CFile::ResizeImageGet($KRAKEN_TEMPLATE_ARRAY['CART_HEAD_BG']['VALUE'], array('width' => 1600, 'height' => 500), BX_RESIZE_IMAGE_PROPORTIONAL, false, false, false, 85);
    ?>
    
    
    <div class="cart-outer cart-parent col-lg-10 col-xs-12">
      
      <div class="cart-inner row">
        
        <div class="head cart-head-height"
             <? if ($KRAKEN_TEMPLATE_ARRAY['CART_HEAD_BG']['VALUE'] > 0): ?>style="background-image: url('<?= $bg["src"] ?>')"<? endif; ?>>
          <div class="incart-shadow"></div>
          
          <table>
            <tbody>
            <tr>
              <td class="col-md-2 col-sm-3 col-xs-0 hidden-xs cart-image">
                <div></div>
              </td>
              <td class="col-md-8 col-sm-6 col-xs-9 title"><?= $KRAKEN_TEMPLATE_ARRAY['CART_HEAD_TIT']['~VALUE'] ?></td>
              <td class="col-md-2 col-xs-3"></td>
            </tr>
            </tbody>
          </table>
          
          <a class="cancel-cart cart-close"></a>
        
        
        </div>
        
        <div class="body cart-body-height">
          
          <table class="main-table mobile-break pad-break">
            <tbody>
            <tr>
              <td class="left-p col-md-8 col-xs-12">
                <div class="product-area">
                  <div class="area_for_list">
                    <? /*
                                            \Bitrix\Main\Page\Frame::getInstance()->startDynamicWithID("area-cart-list");
                                                $APPLICATION->IncludeComponent(
                                                    "concept:kraken.cart",
                                                    "list",
                                                    Array(
                                                        "CURRENT_SITE" => SITE_ID,
                                                        "MESSAGE_404" => "",
                                                        "SET_STATUS_404" => "N",
                                                        "SHOW_404" => "N"
                                                    )
                                                );
                                            \Bitrix\Main\Page\Frame::getInstance()->finishDynamicWithID("area-cart-list");
                                        */ ?>
                  </div>
                
                </div>
                <?php /* ?>
                <div class="wrap-adv-table">
                  
                  <div class="row">
                    
                    <?
                      $code_adv = 'concept_kraken_site_advantages_' . SITE_ID;
                      $arFilter = array("IBLOCK_CODE" => $code_adv, "ID" => $KRAKEN_TEMPLATE_ARRAY['ADVS']['VALUE'], "ACTIVE_DATE" => "Y", "ACTIVE" => "Y");
                      $res = CIBlockElement::GetList(array(), $arFilter, false);
                      
                      $arAdvs = array();
                      
                      while ($ob = $res->GetNextElement()) {
                        $arFields = $ob->GetFields();
                        $arFields["PROPERTIES"] = $ob->GetProperties();
                        $arAdvs[] = $arFields;
                      }
                    ?>
                    
                    <? $total_count = count($arAdvs); ?>
                    
                    <div class="adv-table clearfix">
                      
                      <? if (!empty($arAdvs)): ?>
                      
                      <? foreach ($arAdvs
                        
                        as $key => $arAdv): ?>
                      <?
                        $row = 3;
                        $class = "col-sm-4 col-xs-12";
                        
                        
                        if ($total_count == 2) {
                          $row = 2;
                          $class = "col-sm-6 col-xs-12";
                        }
                        
                        if ($total_count == 1) {
                          $row = 1;
                          $class = "col-xs-12";
                        }
                      
                      ?>
                      
                      <div class="<?= $class ?> adv-cell">
                        <table>
                          <tr>
                            
                            <td class="img">
                              
                              <? if ($arAdv["PREVIEW_PICTURE"] > 0): ?>
                                
                                <? $file = CFile::ResizeImageGet($arAdv["PREVIEW_PICTURE"], array('width' => 100, 'height' => 100), BX_RESIZE_IMAGE_PROPORTIONAL, false); ?>
                                
                                <img class="img-responsive lazyload" data-src="<?= $file["src"] ?>" alt=""/>
                              
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
                      
                      
                      <? if (($key + 1) % $row == 0): ?>
                    </div>
                  <? endif; ?>
                    
                    <? if (($key + 1) % $row == 0 && ($key + 1) != $total_count): ?>
                    <div class="adv-table clearfix">
                      <? endif; ?>
                      
                      <? endforeach; ?>
                      
                      <? endif; ?>
                    
                    </div> <!-- adv-table -->
                  
                  
                  </div>
                
                </div>
                <?php */ ?>
                
                <div class="buttons cart-buttons-height hidden-xs">
                  <table class="mobile-break">
                    <tbody>
                    <tr>
                      <td class="left">
                        <a
                          class="button-def secondary elips big cart-close"><?= GetMessage("KRAKEN_INCLUDE_CART_CATALOG_CONTINUE") ?></a>
                      </td>
                      
                      <?
                        if (strlen($KRAKEN_TEMPLATE_ARRAY['AGREEMENTS']["VALUE"]) > 0 && $KRAKEN_TEMPLATE_ARRAY['AGREEMENTS']["VALUE"] != "N")
                          $par_condition = "class='open-info call-modal callagreement from-modal from-modalform' data-call-modal='agreement" . $KRAKEN_TEMPLATE_ARRAY['AGREEMENTS']["VALUE"] . "'";
                        
                        if (strlen($KRAKEN_TEMPLATE_ARRAY['CART_LINK_CONDITIONS']["VALUE"]) > 0)
                          $par_condition = "class='open-info' target='_blank' href='" . $KRAKEN_TEMPLATE_ARRAY['CART_LINK_CONDITIONS']["VALUE"] . "' ";
                      ?>
                      
                      <? if (isset($par_condition)): ?>
                        <td class="right">
                          <a <?= $par_condition ?>><span
                              class="bord-bot"><? if (strlen($KRAKEN_TEMPLATE_ARRAY['CART_BTN_NAME_CONDITIONS']["VALUE"]) > 0) echo $KRAKEN_TEMPLATE_ARRAY['CART_BTN_NAME_CONDITIONS']["VALUE"]; else echo GetMessage("KRAKEN_INCLUDE_CART_CATALOG_DELIVERY"); ?></span></a>
                        </td>
                      <? endif; ?>
                    </tr>
                    </tbody>
                  </table>
                </div>
              
              </td>
              <td class="right-p col-md-4 col-xs-12">
                
                <div class="info-table active">
                  
                  <div class="area_for_total">
                    <? /*
                                            \Bitrix\Main\Page\Frame::getInstance()->startDynamicWithID("area-cart-total");
                                                $APPLICATION->IncludeComponent(
                                                    "concept:kraken.cart",
                                                    "total",
                                                    Array(
                                                        "CURRENT_SITE" => SITE_ID,
                                                        "MESSAGE_404" => "",
                                                        "SET_STATUS_404" => "N",
                                                        "SHOW_404" => "N"
                                                    )
                                                );
                                            \Bitrix\Main\Page\Frame::getInstance()->finishDynamicWithID("area-cart-total");
                                        */ ?>
                  </div>
                  
                  <div class="buttons">
                    
                    <? if ($KRAKEN_TEMPLATE_ARRAY['FORMS']['VALUE_ORDER'] > 0): ?>
                      
                      <a href="<?= SITE_DIR ?>cart/"
                         class="first-b main-color button-def <?= $KRAKEN_TEMPLATE_ARRAY["BTN_VIEW"]["VALUE"] ?> shine big">
                        <? if (strlen($KRAKEN_TEMPLATE_ARRAY["CART_BTN_ORDER_NAME"]["~VALUE"]) > 0) echo $KRAKEN_TEMPLATE_ARRAY["CART_BTN_ORDER_NAME"]["~VALUE"]; else echo GetMessage("KRAKEN_INCLUDE_CART_CATALOG_ORDER"); ?>
                      </a>
                    <? endif; ?>
                    <?php if (false ) :?>
                      <? if ($KRAKEN_TEMPLATE_ARRAY['FORMS']['VALUE_FAST_ORDER'] > 0): ?>
                        
                        <a class="sec-b call-modal cart-form"
                           data-call-modal="form<?= $KRAKEN_TEMPLATE_ARRAY['FORMS']['VALUE_FAST_ORDER'] ?>"
                           data-header="<?= GetMessage("KRAKEN_INCLUDE_CART_HEADER_FAST_ORDER") ?>">
  
                                                  <span class="bord-bot">
                                              
                                                  <? if (strlen($KRAKEN_TEMPLATE_ARRAY["CART_BTN_FAST_ORDER_NAME"]["~VALUE"]) > 0) echo $KRAKEN_TEMPLATE_ARRAY["CART_BTN_FAST_ORDER_NAME"]["~VALUE"]; else echo GetMessage("KRAKEN_INCLUDE_CART_CATALOG_CLICK"); ?>
  
                                                  </span>
                        </a>
                      <? endif; ?>
                    <? endif; ?>
                  
                  </div>
                  
                  <? if (strlen($KRAKEN_TEMPLATE_ARRAY['CART_COMMENT']['~VALUE']) > 0): ?>
                    
                    <div class="comment">
                      <?= $KRAKEN_TEMPLATE_ARRAY['CART_COMMENT']['~VALUE'] ?>
                    </div>
                  
                  <? endif; ?>
                  
                  <div class="clear">
                    <a class="clear-cart action-clear-cart"><?= GetMessage("KRAKEN_INCLUDE_CART_CATALOG_CLEAR") ?></a>
                  </div>
                
                </div>
                
                <div class="form-order row">
                  <div class="areacart-form cart-order clearfix"></div>
                </div>
                
                <div class="style-cart-back cart-back"></div>
                
                <noindex>
                  
                  <div class="buttons buttons-2 cart-buttons-height visible-xs">
                    <table class="mobile-break">
                      <tbody>
                      <tr>
                        <td class="left">
                          <a
                            class="button-def secondary elips big cart-close"><?= GetMessage("KRAKEN_INCLUDE_CART_CATALOG_CONTINUE") ?></a>
                        </td>
                        
                        <?
                          if (strlen($KRAKEN_TEMPLATE_ARRAY['AGREEMENTS']["VALUE"]) > 0 && $KRAKEN_TEMPLATE_ARRAY['AGREEMENTS']["VALUE"] != "N")
                            $par_condition = "class='open-info call-modal callagreement from-modal from-modalform' data-call-modal='agreement" . $KRAKEN_TEMPLATE_ARRAY['AGREEMENTS']["VALUE"] . "'";
                          
                          if (strlen($KRAKEN_TEMPLATE_ARRAY['CART_LINK_CONDITIONS']["VALUE"]) > 0)
                            $par_condition = "class='open-info' target='_blank' href='" . $KRAKEN_TEMPLATE_ARRAY['CART_LINK_CONDITIONS']["VALUE"] . "' ";
                        ?>
                        
                        <? if (isset($par_condition)): ?>
                          <td class="right">
                            <a <?= $par_condition ?>><span
                                class="bord"><? if (strlen($KRAKEN_TEMPLATE_ARRAY['CART_BTN_NAME_CONDITIONS']["VALUE"]) > 0) echo $KRAKEN_TEMPLATE_ARRAY['CART_BTN_NAME_CONDITIONS']["VALUE"]; else echo GetMessage("KRAKEN_INCLUDE_CART_CATALOG_DELIVERY"); ?></span></a>
                          </td>
                        <? endif; ?>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                
                </noindex>
              </td>
            </tr>
            </tbody>
          </table>
          
          <div class="clearfix"></div>
        
        </div>
      
      </div>
    
    </div>
  
  
  </div>


<? /*\Bitrix\Main\Page\Frame::getInstance()->startDynamicWithID("area-script-cart");

$trans = CKraken::getHostTranslit();

$KRAKEN_CART = $APPLICATION->get_cookie('_kraken_cart_'.SITE_ID."_".$trans, "");
$KRAKEN_CART = unserialize($KRAKEN_CART);
?>

<script type="text/javascript">
$(document).ready(
    function()
    {

        $(".click_cart").removeClass('added');

        <?if(!empty($KRAKEN_CART)):?>

            <?foreach($KRAKEN_CART as $arItem):?>
                $(".click_cart[data-cart-id='<?=$arItem["id"]?>']").addClass('added');
            <?endforeach;?>
            
        <?endif;?>
    }
);
</script>

<?\Bitrix\Main\Page\Frame::getInstance()->finishDynamicWithID("area-script-cart");*/ ?>