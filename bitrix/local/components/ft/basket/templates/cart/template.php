<?php
  /** @var array $arResult */
  /** @var CBitrixBasketComponent $component */
  
  use \Bitrix\Main\Localization\Loc;
  Loc::loadLanguageFile(__FILE__);
  $kJSParams = $component->getJSParams();
?>

<div class="body cart-body-height <?= $kJSParams["nodes"]["basketWrapper"] ?>"
     data-k-entity="<?= $kJSParams["nodes"]["basketWrapper"] ?>">
  
  <table class="main-table mobile-break pad-break">
    <tbody>
    <tr>
      <td class="left-p col-md-8 col-xs-12">
        <div class="product-area">
          <div class="area_for_list">
            <table class="product mobile-break" data-k-entity="<?= $kJSParams["nodes"]["productWrapper"] ?>"></table>
          </div>
        </div>
        <div class="buttons cart-buttons-height hidden-xs">
          <table class="mobile-break">
            <tbody>
            <tr>
              <td class="left">
                <a href="/" class="r-button continue-shopping">Продолжить покупки</a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </td>
      <td
        class="right-p col-md-4 col-xs-12"
        data-k-entity="<?= $kJSParams["nodes"]["basketTotal"] ?>"
      >
        <noindex>
          <div class="buttons buttons-2 cart-buttons-height visible-xs">
            <table class="mobile-break">
              <tbody>
              <tr>
                <td class="left">
                  <a class="r-button">Продолжить покупки</a>
                </td>
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

<div class="body" data-k-entity="<?= $kJSParams["nodes"]["basketEmpty"] ?>">
  <a href="/cart/" class="first-b main-color button-def elips shine big">
    Перейти в каталог
  </a>
</div>
<?php
//$this->SetViewTarget("header-bg");
//echo "/bitrix/templates/concept_kraken_s1/images/cart/cartpage_bg.jpg";
//$this->EndViewTarget();
?>
<script>
  new KBasket(<?= CUtil::PhpToJSObject($kJSParams, false, true) ?>)
</script>
