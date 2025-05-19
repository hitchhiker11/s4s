<div class="container">
<div style="max-width: 785px">
  <h4 style="line-height: 1.3;font-weight: bold; font-size: 32px; color: black; font-family: Arial, sans-serif;">
    Задайте свой вопрос
  </h4>
  <p style="font-size: 15px;line-height: 1.4;margin-top: 8px; color: black; font-family: Arial, sans-serif;">
    НА ВОПРОСЫ ГРАЖДАН ОТВЕЧАЮТ СОТРУДНИКИ ЦЕНТРА ЛИЦЕНЗИОННО-РАЗРЕШИТЕЛЬНОЙ РАБОТЫ ГЛАВНОГО УПРАВЛЕНИЯ РОСГВАРДИИ ПО Г.
    МОСКВЕ.
  </p>

<?php
    $APPLICATION->IncludeComponent(
      "bitrix:form.result.new",
      "form-in-blog",
      array(
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
        "VARIABLE_ALIASES" => array("RESULT_ID" => "RESULT_ID", "WEB_FORM_ID" => "WEB_FORM_ID"),
        "WEB_FORM_ID" => "2",
        "AJAX_MODE" => "Y" // режим AJAX
      )
    );
  ?>
</div>
</div>

