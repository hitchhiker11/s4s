<?php if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die(); ?>
<?php
  /**
   * @global CMain $APPLICATION
   * */
  $aMenuLinksExt = $APPLICATION->IncludeComponent("bitrix:menu.sections", "", array(
      "IBLOCK_TYPE" => "",
      "IBLOCK_ID" => "12",
      "DEPTH_LEVEL" => "2",
      "CACHE_TYPE" => "A",
      "CACHE_TIME" => "3600"
    )
  );
  var_dump($aMenuLinksExt);
  $aMenuLinks = array_merge($aMenuLinksExt, $aMenuLinks);
  echo '<pre>', print_r($aMenuLinks, true), '</pre>';
?>