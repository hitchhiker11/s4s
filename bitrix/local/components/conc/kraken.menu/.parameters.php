<?
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();

if(!CModule::IncludeModule("iblock"))
	return;
/*$arTypesEx = CIBlockParameters::GetIBlockTypes(array("-"=>" "));

$arIBlocks=array();
$db_iblock = CIBlock::GetList(array("SORT"=>"ASC"), array("SITE_ID"=>$_REQUEST["site"], "TYPE" => ($arCurrentValues["IBLOCK_TYPE"]!="-"?$arCurrentValues["IBLOCK_TYPE"]:"")));
while($arRes = $db_iblock->Fetch())
	$arIBlocks[$arRes["ID"]] = "[".$arRes["ID"]."] ".$arRes["NAME"];
*/
$arComponentParameters = array(
	"GROUPS" => array(
		"CACHE_SETTINGS" => array(
			"NAME" => GetMessage("KRAKEN_COMP_GROUP_CACHE_SETTINGS"),
			"SORT" => 600
		),
	),
	"PARAMETERS" => array(

		/*"IBLOCK_TYPE" => array(
			"PARENT" => "BASE",
			"NAME" => GetMessage("KRAKEN_T_IBLOCK_DESC_LIST_TYPE"),
			"TYPE" => "LIST",
			"VALUES" => $arTypesEx,
			"DEFAULT" => "news",
			"REFRESH" => "Y",
		),
		"IBLOCK_ID" => array(
			"PARENT" => "BASE",
			"NAME" => GetMessage("KRAKEN_T_IBLOCK_DESC_LIST_ID"),
			"TYPE" => "LIST",
			"VALUES" => $arIBlocks,
			"DEFAULT" => '={$_REQUEST["ID"]}',
			"ADDITIONAL_VALUES" => "Y",
			"REFRESH" => "Y",
		),*/
		"MENU_CACHE_TYPE" => array(
			"PARENT" => "CACHE_SETTINGS",
			"NAME" => GetMessage("KRAKEN_COMP_PROP_CACHE_TYPE"),
			"TYPE" => "LIST",
			"VALUES" => array(
				"A" => GetMessage("KRAKEN_COMP_PROP_CACHE_TYPE_AUTO"),
				"Y" => GetMessage("KRAKEN_COMP_PROP_CACHE_TYPE_YES"),
				"N" => GetMessage("KRAKEN_COMP_PROP_CACHE_TYPE_NO"),
			),
			"DEFAULT" => "N",
			"ADDITIONAL_VALUES" => "N",
		),

		"MENU_CACHE_TIME" => array(
			"PARENT" => "CACHE_SETTINGS",
			"NAME" => GetMessage("KRAKEN_COMP_PROP_CACHE_TIME"),
			"TYPE" => "STRING",
			"MULTIPLE" => "N",
			"DEFAULT" => 3600,
			"COLS" => 5,
		),

		"MENU_CACHE_USE_GROUPS" => array(
			"PARENT" => "CACHE_SETTINGS",
			"NAME" => GetMessage("CKRAKEN_P_BM_MENU_CACHE_USE_GROUPS"),
			"TYPE" => "CHECKBOX",
			"DEFAULT" => "Y",
		),

	)
);
