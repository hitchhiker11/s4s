<?php
  /** @var array $arResult
   * @global CMain $APPLICATION
   * @var CBitrixBasketComponent $component
   */
  
  use \Bitrix\Main\Localization\Loc;
  
  Loc::loadLanguageFile(__FILE__);
  $kJSParams = $component->getJSParams();
?>
<div class="form-cart-wrap">
  <div class="container">
    <div class="row">
      <div class="form-cart-wrap-inner  body clearfix">
        <div class="body cart-body-height <?= $kJSParams["nodes"]["basketWrapper"] ?>"
             data-k-entity="<?= $kJSParams["nodes"]["basketWrapper"] ?>">
          
          <table class="main-table mobile-break pad-break">
            <tbody>
            <tr>
              <td class="left-p col-md-8 col-xs-12">
                <div class="product-area">
                  <div class="k1-test area_for_list">
                    <div class="k1-test"></div>
                    <table class="product mobile-break"
                           data-k-entity="<?= $kJSParams["nodes"]["productWrapper"] ?>"></table>
                    <div data-k-entity="<?= $kJSParams["nodes"]["basketTotal"] ?>"></div>
                    <div>
                      <p>
                        Доставка товара осуществляется по всей территории Российской Федерации через службы доставки СДЭК
                        и EMS. Оплата доставки за счет получателя.
                      </p>
                      <p>
                        Передача товара в службы доставки осуществляется в течение 3-х рабочих дней с момента оформления
                        заказа на сайте магазина.
                      </p>
                      <p>
                        Факт отправки товара подтверждается высланной на почту заказчику квитанцией приема товара
                        курьерской службой.
                      </p>
                      <p>
                        Свой вопрос по доставке вы можете задать по почте: <a href="mailto:shop@weapon-culture.ru">shop@weapon-culture.ru</a>
                      </p>
                    </div>
                    <div class="buttons cart-buttons-height hidden-xs">
                      <table class="mobile-break">
                        <tbody>
                        <tr>
                          <td class="right">
                            <div class="clear">
                              <a class="action-clear-cart clear-cart">Очистить корзину</a>
                            </div>
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </td>
              <td class="right-p col-md-4 col-xs-12">
                <?php
                  $APPLICATION->IncludeComponent(
                    "ft:order",
                    ".default", [],
                    false
                  );
                ?>
              </td>
            </tr>
            </tbody>
          </table>
          
          <div class="clearfix"></div>
        
        </div>
        
        <div class="body" data-k-entity="<?= $kJSParams["nodes"]["basketEmpty"] ?>">
          <div style="font-size: 24px;">
            Ваша корзина пуста
          </div>
          <a href="/" style="margin-top: 24px;" class="first-b main-color button-def elips shine big">
            Перейти в каталог
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
<?php
  $this->SetViewTarget("header-bg");
  echo "/bitrix/templates/concept_kraken_s1/images/cart/cartpage_bg.jpg";
  $this->EndViewTarget();
  $APPLICATION->SetTitle("Оформление заказа — Культура оружия");
  $APPLICATION->SetPageProperty("title", "Ваш заказ готов к оформлению");
?>
<script>
  new KBasket(<?= CUtil::PhpToJSObject($kJSParams, false, true) ?>)
</script>
<script>
  window.addEventListener("DOMContentLoaded", function () {
    const payForm = document.querySelector("[data-id=robokassa-form]")
    const timerNode = document.querySelector(".form-timer span")
    if (timerNode) {
      let timerValue = +timerNode.textContent
      setInterval(function () {
        timerValue--
        timerNode.textContent = timerValue.toString()
        if (timerValue < 1) {
          payForm.submit()
        }
      }, 1000)
    }
  })
</script>
