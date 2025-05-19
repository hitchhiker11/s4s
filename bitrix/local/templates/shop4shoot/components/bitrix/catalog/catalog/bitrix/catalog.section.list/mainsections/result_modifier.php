<?if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true) die();?>

<?

if(!empty($arResult["SECTIONS"]))
{
	global $KRAKEN_TEMPLATE_ARRAY;
	$hide_menu = ($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["HIDE_EMPTY_CATALOG"]["VALUE"]["ACTIVE"] == "Y") ? true : false;


	$arSectionsID = array();
	$arSections = array();

	foreach($arResult["SECTIONS"] as $key=>$arSection)
	{
		if($hide_menu && intval($arSection["ELEMENT_CNT"]) <= 0)
		{
			unset($arResult["SECTIONS"][$key]);
            continue;
		}

		$arSectionsID[]=$arSection['ID'];
		$arSections[$arSection['ID']]=$arSection;
	}

	if(!empty($arSectionsID))
	{

		$arSelect = Array("ID", "UF_*");
		$arFilter = Array('IBLOCK_ID'=>$arParams["IBLOCK_ID"], "ID" => $arSectionsID);
		$db_list = CIBlockSection::GetList(Array(), $arFilter, false, $arSelect);


		while($ar_result = $db_list->GetNext())
		{
			if(is_array($arSections[$ar_result['ID']]))
				$arSection = array_merge($arSections[$ar_result['ID']], $ar_result);

			if(!empty($arSection))
				$arSections[$ar_result['ID']] = $arSection;
		}

		if(!empty($arSections))
			$arResult["SECTIONS"] = array_values($arSections);


	}
	/*foreach($arResult["SECTIONS"] as $key=>$arSection)
	{
		
		if($hide_menu && intval($arSection["ELEMENT_CNT"]) <= 0)
		{
			unset($arResult["SECTIONS"][$key]);
            continue;
		}
		
	    
	    $arSelect = Array("ID", "UF_*");
	    $arFilter = Array('IBLOCK_ID'=>$arParams["IBLOCK_ID"], "ID" => $arSection["ID"]);
	    $db_list = CIBlockSection::GetList(Array(), $arFilter, $cnt, $arSelect);
	    $ar_result = $db_list->GetNext();
	    
	    
	    $arSection = array_merge($arSection, $ar_result);
	    
	    if(!$arSection['UF_KRAKEN_MAIN_CTLG'])
	        unset($arResult["SECTIONS"][$key]);

	}*/

	$this->__component->arResultCacheKeys = array_merge($this->__component->arResultCacheKeys, array('SECTIONS'));
}

if(strlen($arResult["SECTION"]["SECTION_PAGE_URL"]) > 0)
    $arResult["SECTION_BACK"] = $arResult["SECTION"]["SECTION_PAGE_URL"];
else
    $arResult["SECTION_BACK"] = SITE_DIR."catalog/";
    
    

?>