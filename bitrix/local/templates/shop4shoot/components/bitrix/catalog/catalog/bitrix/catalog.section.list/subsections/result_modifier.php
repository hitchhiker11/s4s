<?if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();?>

<?

if(!empty($arResult["SECTIONS"]))
{
	$arSectionsID = array();
	$arSections = array();

	foreach($arResult["SECTIONS"] as $key=>$arSection)
	{
		$arSectionsID[]=$arSection['ID'];
		$arSections[$arSection['ID']]=$arSection;
	}



	$arSelect = Array("ID", "UF_*");
	$arFilter = Array('IBLOCK_ID'=>$arParams["IBLOCK_ID"], "ID" => $arSectionsID);
	$db_list = CIBlockSection::GetList(Array(), $arFilter, false, $arSelect);


	while($ar_result = $db_list->GetNext())
	{
		$arSection = array();

		if(is_array($arSections[$ar_result['ID']]))
			$arSection = array_merge($arSections[$ar_result['ID']], $ar_result);

		if(!empty($arSection))
			$arSections[$ar_result['ID']] = $arSection;
	}

	if(!empty($arSections))
		$arResult["SECTIONS"] = array_values($arSections);

}
?>