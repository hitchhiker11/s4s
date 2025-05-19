<?if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();?>

<?
    
    $arResult["MENU_COL_1"] = array();
    $arResult["MENU_COL_2"] = array();
    $arResult["MENU_COL_3"] = array();
    $arResult["MENU_COL_4"] = array();
    

    $mainCount = 1;

    foreach ($arResult as $key => $arItem){

        // menu in colls
        if($arItem['COL'] == 'first')
            $arResult["MENU_COL_1"][] = $arItem;
        
        elseif($arItem['COL'] == 'second')
            $arResult["MENU_COL_2"][] = $arItem;
        
        elseif($arItem['COL'] == 'third')
            $arResult["MENU_COL_3"][] = $arItem;
        
        elseif($arItem['COL'] == 'fourth')
            $arResult["MENU_COL_4"][] = $arItem;

        elseif($arItem['COL'] == 'catalog')
            $arResult["MENU_CATALOG"] = $arItem;

        else
        {
            $arResult["MENU_COL_$mainCount"][] = $arItem;
            $mainCount++;
        }

        if($mainCount > 4) 
            $mainCount=1;

        // ^menu in colls  
       
        
    }
        
   
?>