<?php
?>

<div class="k1-modal k1-modal-feedback k1-modal-card d-f ai-c jc-c">
  <div class="k1-modal__body p-r">
    <div class="k1-modal__close">
      <span></span>
      <span></span>
    </div>
    <div class="k1-modal__content">
      <h4 class="k1-modal__title">Стол заказов</h4>
      <?$APPLICATION->IncludeComponent(
        "bitrix:form.result.new",
        "form1",
        Array(
          "CACHE_TIME" => "3600",
          "CACHE_TYPE" => "A",
          "CHAIN_ITEM_LINK" => "",
          "CHAIN_ITEM_TEXT" => "",
          "EDIT_URL" => "",
          "IGNORE_CUSTOM_TEMPLATE" => "N",
          "LIST_URL" => "",
          "SEF_MODE" => "N",
          "SUCCESS_URL" => "",
          "USE_EXTENDED_ERRORS" => "N",
          "VARIABLE_ALIASES" => Array("RESULT_ID"=>"RESULT_ID","WEB_FORM_ID"=>"WEB_FORM_ID"),
          "WEB_FORM_ID" => "3",
          "AJAX_MODE" => "Y"
        )
      );?>
    </div>
  </div>
</div>

<script>
  window.addEventListener("load", () => {
    new Modal("feedback");
    new PhoneMask({
      mask: "+7 (xxx) xxx xx xx"
    })
  })
</script>