<?if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();

if(!empty($arResult["ITEMS"]))
{


foreach($arResult["ITEMS"] as $key => $arItem)
{
	if($arItem["CODE"]=="IN_STOCK"){
		sort($arResult["ITEMS"][$key]["VALUES"]);
		if($arResult["ITEMS"][$key]["VALUES"])
			$arResult["ITEMS"][$key]["VALUES"][0]["VALUE"]=$arItem["NAME"];
	}
	if($arParams["HIDDEN_PROP"] && in_array($arItem["CODE"], $arParams["HIDDEN_PROP"]))
		unset($arResult["ITEMS"][$key]);
	if(!isset($arItem["NAME"]))
		unset($arResult["ITEMS"][$key]);
}

$arResult["SHOW_FILTER"] = false;
foreach($arResult["ITEMS"] as $key=>$arItem)
{
	if(isset($arItem["PRICE"])){
		if ($arItem["VALUES"]["MAX"]["VALUE"] - $arItem["VALUES"]["MIN"]["VALUE"] <= 0)
			continue;

		$arResult["SHOW_FILTER"] = true;
	}
}

foreach($arResult["ITEMS"] as $key=>$arItem)
{
	if(empty($arItem["VALUES"]) || isset($arItem["PRICE"]))
		continue;

	if( $arItem["DISPLAY_TYPE"] == "A" && ($arItem["VALUES"]["MAX"]["VALUE"] - $arItem["VALUES"]["MIN"]["VALUE"] <= 0) )
		continue;

	$arResult["SHOW_FILTER"] = true;
}
global $sotbitFilterResult;
$sotbitFilterResult = $arResult;

}
