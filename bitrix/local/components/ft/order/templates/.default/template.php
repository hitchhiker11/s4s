<?php
  /** @var array $arResult */
  
  use \Bitrix\Main\Localization\Loc;

  
  Loc::loadLanguageFile(__FILE__);
  

?>

<div class="form-order row">
  
  <form id="order-form" action="/" class="form-page-cart form-38 form-cart form-cart-style form send" method="post"
        role="form">
    <div class="col-xs-12 questions active">
      
      <div class="row">
        
        <div class="col-xs-12 title-form main1 clearfix">
          Оформление заказа
        </div>
        <div class="clearfix"></div>
        
        
        
        <div class="col-xs-12">
          <div class="input">
            <div class="bg"></div>
            <span class="desc">Имя</span>
            <input class="focus-anim require ym-record-keys input_38_0" name="name" type="text" placeholder="">
          
          </div>
        </div>
        
        
        <div class="col-xs-12">
          <div class="input">
            <div class="bg"></div>
            <span class="desc">Фамилия</span>
            <input class="focus-anim require ym-record-keys input_38_1" name="second-name" type="text">
          
          </div>
        </div>
        
        
        <div class="col-xs-12">
          <div class="input">
            <div class="bg"></div>
            <span class="desc">Отчество</span>
            <input class="focus-anim require ym-record-keys input_38_2" name="surname" type="text">
          
          </div>
        </div>
        
        
        <div class="col-xs-12">
          <div class="input">
            <div class="bg"></div>
            <span class="desc">Телефон</span>
            <input class="phone focus-anim require ym-record-keys input_38_3" name="phone" type="text">
          </div>
        </div>
        
        
        <div class="col-xs-12">
          <div class="input">
            <div class="bg"></div>
            <span class="desc">E-mail</span>
            <input class="focus-anim email require ym-record-keys input_38_4" name="email" type="email">
          
          </div>
        </div>
        
        
        <div class="col-xs-12">
          <div class="input input-textarea input_textarea_38_5">
            <div class="bg"></div>
            <span class="desc">Комментарий</span>
            <textarea class="focus-anim  ym-record-keys" name="comment"></textarea>
          </div>
        </div>
        
        
        <div class="col-xs-12 parent-choose-select">
          
          <div class="name-tit-choose bold">Выберите способ оплаты</div>
          
          <div class="input">
            
            <div class="form-select">
              <div class="ar-down"></div>
              <div class="select-list-choose">
                <span class="list-area"><?= $arResult["PAY_SYSTEMS"][0]["NAME"]?></span>
              </div>
              <div class="select-list">
                <?php foreach($arResult["PAY_SYSTEMS"] as $key => $pay) :?>
                <label>
                  <span class="name">
                    <input
                      class="opinion cart-choose-select"
                      data-choose-select="2"
                      type="radio"
                      name="pay"
                      <?= $key === 0 ? "checked" : ""?>
                      value="<?= $pay["ID"]?>">
                    <span class="text"><?= $pay["NAME"]?></span>
                  </span>
                </label>
                <?php endforeach; ?>
              </div>
            </div>
            <div class="inp-desc-style active inp-show-js" data-choose-select="2" style="display: none !important;">
              Ссылка на оплату будет отправлена вам на e-mail после оформления заказа
            </div>
          </div>
        </div>
        <div class="col-xs-12 parent-choose-select">
          <div class="name-tit-choose bold">Выберите способ доставки</div>
          <div class="input">
            <div class="form-select">
              <div class="ar-down"></div>
              <div class="select-list-choose first">
                <span class="list-area"><?= $arResult["DELIVERY_SYSTEMS"][0]["NAME"]?></span>
              </div>
              <div class="select-list">
                <?php foreach($arResult["DELIVERY_SYSTEMS"] as $key => $delivery) :?>
                <label>
                  <span class="name">
                    <input
                      class="opinion cart-choose-select"
                      type="radio"
                      name="delivery"
                      <?= $key === 0 ? "checked" : ""?>
                      value="<?= $delivery["ID"]?>">
                    <span class="text"><?= $delivery["NAME"]?></span>
                  </span>
                </label>
                <?php endforeach; ?>
              </div>
            </div>
            
            <div class="inp-desc-style active inp-show-js">
              Оплата производится получателем
            </div>
            
          </div>
          
          
          <div class="input kraken-inp input-textarea inp-show-js inp-show-js-padding " data-choose-select="4">
            <div class="bg"></div>
            <span class="desc inp-show-js-length">Адрес доставки</span>
            <textarea class="focus-anim " name="delivery-address"
                      rows="5"></textarea>
          </div>
          
        </div>
        
        <div class="col-xs-12">
          <div class="input-btn">
<!--            <div class="load">-->
<!--              <div class="xLoader form-preload">-->
<!--                <div class="audio-wave"><span></span><span></span><span></span><span></span><span></span></div>-->
<!--              </div>-->
<!--            </div>-->
<!--            -->
            <button class="r-button">
              Оплатить заказ
            </button>
          </div>
        </div>
      </div>
    
    </div>
    
<!--    <div class="col-xs-12 thank">-->
<!--      Спасибо! Мы с вами свяжемся в ближайшее время-->
<!--    </div>-->
  
  </form>
</div>
<?php
  //  echo '<pre>', print_r($arResult, true), '</pre>';

?>
<script>
  window.addEventListener("DOMContentLoaded", () => {
    new Order();
  })
</script>
