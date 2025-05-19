<?php
  
  use Bitrix\Sale;
  
  Bitrix\Main\Loader::includeModule("sale");
  Bitrix\Main\Loader::includeModule("catalog");
  
  global $KRAKEN_TEMPLATE_ARRAY, $APPLICATION;
  
  $basket = Sale\Basket::loadItemsForFUser(Sale\Fuser::getId(), Bitrix\Main\Context::getCurrent()->getSite());
  $isShowWidget = count($basket->toArray()) > 0;
  ?>
  <div class="no-click-block"></div>
  
  <div class="wrapper-cart fly-basket">
    <input class="link_empty_cart" type="hidden" value="">
    <div
        class="open-cart semi_show basket-count-control-widget-in-public cart-show  <?= $isShowWidget ? "no-empty" : ""
        ?>">
        <div class="before_pulse"></div>
        <div class="after_pulse"></div>
        <span class="count basket-count-value"><?= count($basket->toArray())?></span>
      <?php if ($KRAKEN_TEMPLATE_ARRAY["CART_MINICART_DESC_EMPTY"]["VALUE"]): ?><span
          class="desc-empty"><?= $KRAKEN_TEMPLATE_ARRAY["CART_MINICART_DESC_EMPTY"]["VALUE"] ?></span><?php endif; ?>
      <?php if ($KRAKEN_TEMPLATE_ARRAY["CART_MINICART_DESC_NOEMPTY"]["VALUE"]): ?><span
          class="desc-no-empty"><?= $KRAKEN_TEMPLATE_ARRAY["CART_MINICART_DESC_NOEMPTY"]["VALUE"] ?></span><?php endif; ?>
      <?php if (strlen($KRAKEN_TEMPLATE_ARRAY["CART_MINICART_LINK_PAGE"]["VALUE"]) > 0): ?><a class="cart_link scroll"
                                                                                              href="<?= $KRAKEN_TEMPLATE_ARRAY["CART_MINICART_LINK_PAGE"]["VALUE"] ?>"></a><?php endif; ?>
      </div>
    
    
    <?php
      if ($KRAKEN_TEMPLATE_ARRAY['CART_HEAD_BG']['VALUE'] > 0)
        $bg = CFile::ResizeImageGet($KRAKEN_TEMPLATE_ARRAY['CART_HEAD_BG']['VALUE'], array('width' => 1600, 'height' => 500), BX_RESIZE_IMAGE_PROPORTIONAL, false, false, false, 85);
    ?>
    
    
    <div class="cart-outer cart-parent col-lg-10 col-xs-12">
<!--    <div class="cart-outer cart-parent col-lg-10 col-xs-12 open on">-->
      
      <div class="cart-inner row">
        
        <div class="head cart-head-height"
             <?php if ($KRAKEN_TEMPLATE_ARRAY['CART_HEAD_BG']['VALUE'] > 0): ?>style="background-image: url('<?= $bg["src"] ?>')"<?php endif; ?>>
          <div class="incart-shadow"></div>
          
          <table>
            <tbody>
            <tr>
              <td class="col-md-2 col-sm-3 col-xs-0 hidden-xs cart-image">
                <div></div>
              </td>
              <td class="col-md-8 col-sm-6 col-xs-9 title">Ваш заказ готов к оформлению</td>
              <td class="col-md-2 col-xs-3"></td>
            </tr>
            </tbody>
          </table>
          
          <a class="cancel-cart cart-close"></a>
        
        
        </div>
        
          <?php
            $APPLICATION->IncludeComponent(
              "ft:basket",
              "cart",
              Array()
            ); ?>
          <div class="clearfix"></div>
        
      
      </div>
    
    </div>
  
  
  </div>
