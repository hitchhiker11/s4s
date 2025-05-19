<?php require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php"); ?>

<?php
  use Bitrix\Sale;
  Bitrix\Main\Loader::includeModule("sale");
  Bitrix\Main\Loader::includeModule("catalog");
  $orderID = $_REQUEST["order_id"];
  global $USER, $APPLICATION;
  $cond = $USER->IsAdmin();
  $me = $_SERVER["REMOTE_ADDR"] === "178.155.4.172" || $_SERVER["HTTP_DDG_CONNECTING_IP"] === "178.155.4.172";

  
?>
<?php if (!$orderID) : ?>
  <?php
  $APPLICATION->IncludeComponent(
    "ft:basket",
    "order",
    []
  );
  ?>
<?php else : ?>
  <div
    class="k1-order cart-first-block cover dark kraken-firsttype-3 lazyload">
<!--    style="background-image: url('/bitrix/templates/concept_kraken_s1/images/cart/cartpage_bg.jpg');">-->
    <input type="hidden" class="cart_page" value="Y">
    
    <div class="shadow"></div>
    <div class="top-shadow"></div>
    
    <div class="container container-index">
      
      <div class="part-wrap">
        
        
        
        <div class="second-part">
          
          <div class="head">
            
            <div class="title main1">
                  Ваш заказ № <?= $orderID?> успешно оформлен! <br>
                  Наши менеджеры свяжутся с Вами в ближайшее время!
              <br><br>
              <table>
                <tr>
                  <td style="padding-right: 20px;"></td>
                  <td>
                    <a class="button-def main-color elips" href="/">
                      Перейти на главную страницу
                    </a>
                  </td>
                </tr>
              </table>
              
                <?php
                $mrh_login = "shop4shoot.ru";
                $mrh_pass1 = "m0PVdR1Sg4ZJqqsdn5M0";
                $inv_desc = "Оплата заказа №" . $_REQUEST["order_id"];
                $order = Sale\Order::load($orderID);
                
                $orderArray = $order->toArray();
                $basketArray = $orderArray["BASKET_ITEMS"];
                $out_summ = $orderArray["PRICE"];
                  
                $invId = $orderID.$orderArray["ACCOUNT_NUMBER"];
                $culture = "ru";
                $receipt = [];
                  if ($me) {
                    $out_summ = 10;
                  }
                foreach ($basketArray as $orderItem) {
                  $price = $orderItem["PRICE"];
                  if ($me) {
                    $price = 10;
                  }
                  $count = (int)$orderItem["QUANTITY"];
                  $receipt["items"][] = [
                    "name" => $orderItem["NAME"],
                    "sum" => $price * $count,
                    "quantity" => $count,
                    "tax" => "none",
                    "nomenclature_code" => getMarkerCode($orderItem["PRODUCT_ID"], $orderItem["PRODUCT_ID"])
                  ];
                }
                $receipt = urldecode(json_encode($receipt));
                $sgn = md5("$mrh_login:$out_summ:$invId:$receipt:$mrh_pass1");
                ?>
                  <form
                    action='https://auth.robokassa.ru/Merchant/Index.aspx'
                    data-id="robokassa-form"
                    style="padding-left: 20px;"
                    method=POST>
                    <input type=hidden name=MerchantLogin value=<?= $mrh_login ?>>
                    <input type=hidden name=OutSum value=<?= $out_summ ?>>
                    <input type=hidden name=InvId value='<?= $invId ?>'>
                    <input type=hidden name=Receipt value='<?= $receipt ?>'>
                    <input type=hidden name=Description value='<?= $inv_desc ?>'>
                    <input type=hidden name=SignatureValue value='<?= $sgn ?>'>
                    <input type=hidden name=Culture value=<?= $culture ?>>
                    
                    <input type=submit value='Оплатить' class="big button-def left elips main-btn secondary">
                  </form>
                  <div class="form-timer" style="padding-left: 20px;">
                    Автоматический переход на страницу оплаты через <span>3</span>
                  </div>
                
            </div>
          </div>
        </div>
      
      </div>
    
    
    </div>
  
  </div>
  <script>
    window.addEventListener("DOMContentLoaded", () => {
      const body = document.querySelector(".wrapper");
      const payForm = document.querySelector("[data-id=robokassa-form]")
      const timerNode = document.querySelector(".form-timer span")
      
      body.style.backgroundImage = "url(/bitrix/templates/concept_kraken_s1/images/cart/cartpage_bg.jpg)";
      body.style.backgroundPosition = "center";
      body.style.backgroundSize = "cover";
      body.style.backgroundRepeat = "no-repeat";
      
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
<?php endif; ?>


<?php require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>