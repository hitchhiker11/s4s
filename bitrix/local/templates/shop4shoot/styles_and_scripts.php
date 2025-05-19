<?php use \Bitrix\Main\Page\Asset as Asset;?>


<?php


$KrakenCssList = Array();
$KrakenCssTrueList = Array();

$KrakenCssList[] = SITE_TEMPLATE_PATH."/css/bootstrap.min.css";
$KrakenCssList[] = SITE_TEMPLATE_PATH."/css/font-awesome.css";
$KrakenCssList[] = SITE_TEMPLATE_PATH."/css/animate.min.css";
$KrakenCssList[] = SITE_TEMPLATE_PATH."/css/xloader.css";
$KrakenCssList[] = SITE_TEMPLATE_PATH."/css/blueimp-gallery.min.css";
$KrakenCssList[] = SITE_TEMPLATE_PATH."/slick/slick.css";
$KrakenCssList[] = SITE_TEMPLATE_PATH."/slick/slick-theme.css";
$KrakenCssList[] = SITE_TEMPLATE_PATH."/css/jquery.datetimepicker.min.css";
$KrakenCssList[] = SITE_TEMPLATE_PATH."/css/farbtastic.css";
$KrakenCssList[] = SITE_TEMPLATE_PATH."/css/concept.css";
$KrakenCssList[] = SITE_TEMPLATE_PATH."/css/custom.css";
$KrakenCssList[] = SITE_TEMPLATE_PATH."/css/style.css";

$KrakenCssTrueList[] = SITE_TEMPLATE_PATH."/css/jquery.countdown.css";
$KrakenCssTrueList[] = SITE_TEMPLATE_PATH."/css/responsive.css";

$KrakenCssFullList = array_merge($KrakenCssList, $KrakenCssTrueList);


global $KrakenJSFullList;

$KrakenJSFullList = Array();

$KrakenJSFullList[] = SITE_TEMPLATE_PATH."/js/jqueryConcept.min.js";
$KrakenJSFullList[] = SITE_TEMPLATE_PATH."/js/bootstrap.min.js";
$KrakenJSFullList[] = SITE_TEMPLATE_PATH."/js/jquery.plugin.min.js";
$KrakenJSFullList[] = SITE_TEMPLATE_PATH."/js/jquery.countdown.min.js";
$KrakenJSFullList[] = SITE_TEMPLATE_PATH."/lang/ru/jquery.countdown-ru.js";
$KrakenJSFullList[] = SITE_TEMPLATE_PATH."/js/device.min.js";
$KrakenJSFullList[] = SITE_TEMPLATE_PATH."/js/wow.js";
$KrakenJSFullList[] = SITE_TEMPLATE_PATH."/js/detectmobilebrowser.js";
$KrakenJSFullList[] = SITE_TEMPLATE_PATH."/js/jquery.enllax.js";
$KrakenJSFullList[] = SITE_TEMPLATE_PATH."/js/jquery.maskedinput-1.2.2.min.js";
$KrakenJSFullList[] = SITE_TEMPLATE_PATH."/js/jquery.blueimp-gallery.min.js";
$KrakenJSFullList[] = SITE_TEMPLATE_PATH."/slick/slick.min.js";
$KrakenJSFullList[] = SITE_TEMPLATE_PATH."/lang/ru/jquery.datetimepicker.full.min.js";
$KrakenJSFullList[] = SITE_TEMPLATE_PATH."/js/typed.min.js";
$KrakenJSFullList[] = SITE_TEMPLATE_PATH."/js/lazyload.min.js";
$KrakenJSFullList[] = SITE_TEMPLATE_PATH."/js/size-resize.js";
$KrakenJSFullList[] = SITE_TEMPLATE_PATH."/js/forms.js";
$KrakenJSFullList[] = SITE_TEMPLATE_PATH."/js/script.js";
$KrakenJSFullList[] = SITE_TEMPLATE_PATH."/js/custom.js";
?>


<?php CJSCore::Init(array("fx"));?>

<?php foreach($KrakenCssList as $css):?>
  <?php
  Asset::getInstance()->addCss($css);?>
<?php endforeach;?>

<?php foreach($KrakenCssTrueList as $css):?>
  <?php Asset::getInstance()->addCss($css, true);?>
<?php endforeach;?>


<?php foreach($KrakenJSFullList as $js):?>
  <?php Asset::getInstance()->addJs($js);?>
<?php endforeach;?>




<?php //\Bitrix\Main\Page\Frame::getInstance()->startDynamicWithID("composit_styles");?>

<?php /*if(!$OS):?>
        <?Asset::getInstance()->addJs(SITE_TEMPLATE_PATH."/js/smoothscroll.js");?>
    <?endif;*/?>

<!--    --><?php //if(CKraken::isAdmin()):?>
<!---->
<!--        --><?php //Asset::getInstance()->addCss(SITE_TEMPLATE_PATH."/css/fonts/fontAdmin.css", true);?>
<!--        --><?php //Asset::getInstance()->addCss(SITE_TEMPLATE_PATH."/css/settings.css");?>
<!---->
<!--        --><?php //Asset::getInstance()->addJs(SITE_TEMPLATE_PATH."/js/farbtastic.js");?>
<!--        --><?php //Asset::getInstance()->addJs(SITE_TEMPLATE_PATH."/js/zero-clipboard.js");?>
<!--        --><?php //Asset::getInstance()->addJs(SITE_TEMPLATE_PATH."/js/settings.js");?>
<!--        -->
<!--    --><?php //endif;?>
<!--    -->
<?php //\Bitrix\Main\Page\Frame::getInstance()->finishDynamicWithID("composit_styles");?>
