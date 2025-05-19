<?php require($_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php'); ?>
  <?php if ($_SERVER["REMOTE_ADDR"] === "95.174.99.161" || $_SERVER["HTTP_DDG_CONNECTING_IP"] === "95.174.99.161") {
  	echo '<pre>', print_r("test", true), '</pre>';
    die(132);
  }
  
  ?>
  
<?php require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>
