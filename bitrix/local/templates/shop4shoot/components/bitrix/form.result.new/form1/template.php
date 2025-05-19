<?
  if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
  
  if ($arResult["isFormErrors"] == "Y"):?>
    <?= $arResult["FORM_ERRORS_TEXT"]; ?>
  <?php endif; ?>
<div style="color: green; text-align: center; margin: 2rem 0">
  <?= $arResult["FORM_NOTE"] ?>
</div>
<?php if ($arResult["isFormNote"] != "Y") {
  ?>
  <div class="k1-form">
    <div class="k1-form-description">
      <p>
        Как оформить заказ:
      </p>
      <ul>
        <li>
          Вы заполняете форму ниже, где даете краткое описание товара, а также, по возможности даете ссылку с данными о
          товаре в сети Интернет, фото товара и любую другую доступную информацию. А также указываете ваши контактные
          данные.
        </li>
        <li>
          Мы оперативно находим товар в Европе или Америке и высылаем вам информацию по его стоимости и срокам доставки.
        </li>
        <li>
          Если вас устраивают условия, вы делаете 50% предоплату, и мы привозим товар в указанный вами пункт назначения.
          Окончательный расчет происходит в момент передачи товара.
        </li>
      </ul>
    </div>
    <?= $arResult["FORM_HEADER"] ?>
    <input type="hidden" name="pageURL" value="">
    <input type="hidden" name="recaptcha">
    <?php foreach ($arResult["QUESTIONS"] as $FIELD_SID => $arQuestion) : ?>
      <?php
      switch ($FIELD_SID) {
        case "FEEDBACK_FORM_PHOTO": ?>
          <div class="k1-form-row">
            <?= $arQuestion["CAPTION"] ?>
            <label>
              <div>
                <span class="k1-form-file-fake">
                  Прикрепить фото
                </span>
              </div>
              <input type="file" name="files[]" multiple="multiple">
            </label>
          </div>
          <?php break;
        case "FEEDBACK_FORM_DOCUMENT" : ?>
          <div class="k1-form-row">
            <?= $arQuestion["CAPTION"] ?>
            <label>
              <div>
                <span class="k1-form-file-fake">
                  Прикрепить документ
                </span>
              </div>
              <?= $arQuestion["HTML_CODE"] ?>
            </label>
          </div>
          <?php break;
        case "FEEDBACK_FORM_POLICY" : ?>
          <div class="k1-form-row k1-form-checkbox">
            <label>
              <?= $arQuestion["HTML_CODE"] ?>
              <?= $arQuestion["CAPTION"] ?>
            </label>
          </div>
          <?php break;
        default : ?>
          <div class="k1-form-row" data-test="<?= $FIELD_SID ?>">
            <?php //= $arQuestion["REQUIRED"] == "Y" ? "*" : ""?><!--</strong>-->
            <label style="margin-top: 1rem;">
              <?= $arQuestion["HTML_CODE"] ?>
            </label>
          </div>
        <?php } // switch ($FIELD_SID) ?>
    <?php endforeach; // $arResult["QUESTIONS"] as $FIELD_SID => $arQuestion ?>
    
    <div class="k1-form-row">
      <label class="big button-def left elips main-btn shine main-color">
        <input type="submit" name="web_form_apply" value="Отправить"/>
      </label>
    </div>
    
    <?= $arResult["FORM_FOOTER"] ?>
  </div>
  <?
} //endif (isFormNote)

?>

<script>
  new K1FormHandler();
  new PhoneMask({
    mask: "+7 (xxx) xxx xx xx"
  });
  const captchaFields = document.querySelectorAll("input[data-captcha=Y]")
  captchaFields.forEach(input => {
    input.addEventListener("blur", function() {
      const form = input.closest("form")
      grecaptcha.ready(function () {
        grecaptcha.execute("6LcdiTIpAAAAACNK-831fEFD9N-hU1Kx2y6N3KI2", {action: "submit"}).then(function (token) {
          form.querySelector("input[name=recaptcha]").value = token
        });
      });
    })
  })
</script>
