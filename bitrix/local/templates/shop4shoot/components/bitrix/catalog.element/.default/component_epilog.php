<? if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();?>

<?php

?>

<?\Bitrix\Main\Page\Frame::getInstance()->startDynamicWithID("area");?>

<?

if(strlen($GLOBALS["TITLE"]) <= 0)
    $GLOBALS["TITLE"] = $arResult["IPROPERTY_VALUES"]["ELEMENT_META_TITLE"];

if(strlen($GLOBALS["KEYWORDS"]) <= 0)
    $GLOBALS["KEYWORDS"] = $arResult["IPROPERTY_VALUES"]["ELEMENT_META_KEYWORDS"];

if(strlen($GLOBALS["DESCRIPTION"]) <= 0)
    $GLOBALS["DESCRIPTION"] = $arResult["IPROPERTY_VALUES"]["ELEMENT_META_DESCRIPTION"];

if(strlen($GLOBALS["H1"]) <= 0)
    $GLOBALS["H1"] = $arResult["IPROPERTY_VALUES"]["ELEMENT_PAGE_TITLE"];
     
?>

<script>
	
	$(document).ready(function($) {
		
		<?foreach ($arResult["SECTIONS_ID"] as $value):?>

			$(".section-menu-id-<?=$value?>").addClass('selected');
			
		<?endforeach;?>

	});

</script>

<?\Bitrix\Main\Page\Frame::getInstance()->finishDynamicWithID("area");?>