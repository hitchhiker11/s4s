<? if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die(); ?>

<?
  if (!empty($arResult["SECTIONS"])) {
    global $KRAKEN_TEMPLATE_ARRAY;
    $hide_menu = ($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["HIDE_EMPTY_CATALOG"]["VALUE"]["ACTIVE"] == "Y") ? true : false;
    
    foreach ($arResult["SECTIONS"] as $key => $arSection) {
      
      if ($arSection["DEPTH_LEVEL"] > 2) {
        unset($arResult["SECTIONS"][$key]);
      } else {
        if ($hide_menu && intval($arSection["ELEMENT_CNT"]) <= 0)
          continue;
        
        $arSelect = array("ID", "UF_*");
        $arFilter = array('IBLOCK_ID' => $arParams["IBLOCK_ID"], "ID" => $arSection["ID"]);
        $db_list = CIBlockSection::GetList(array(), $arFilter, false, $arSelect);
        $ar_result = $db_list->GetNext();
        
        
        if (strlen($ar_result["UF_KRAKEN_CTLG_SIZE"]) > 0) {
          $arSection["UF_KRAKEN_CTLG_SIZE_ENUM"] = CUserFieldEnum::GetList(array(), array(
            "ID" => $ar_result["UF_KRAKEN_CTLG_SIZE"],
          ))->GetNext();
          
        }
        
        $arSection = array_merge($arSection, $ar_result);
       
        
        if ($arSection["DEPTH_LEVEL"] == 1) {
          $main_key = $key;
          $arResult["SECTIONS"][$main_key] = $arSection;
          
        }
        
        if ($arSection["DEPTH_LEVEL"] == 2) {
          $main_key1 = $key;
          
          $arResult["SECTIONS"][$main_key]["SUB"][$main_key1] = $arSection;
          unset($arResult["SECTIONS"][$main_key1]);
        }
        
        
      }
      
    }
    
    foreach ($arResult["SECTIONS"] as $key => $arSection) {
      
//      if ($arSection['UF_KRAKEN_MAIN_CTLG'] == 0)
//        unset($arResult["SECTIONS"][$key]);
      
      
      /*if(!empty($arSection["SUB"]) && is_array($arSection["SUB"]))
      {
          foreach($arSection["SUB"] as $k=>$arSection1)
          {
              if($arSection['UF_KRAKEN_MAIN_CTLG'] == 0)
                  unset($arResult["SECTIONS"][$key]["SUB"][$k]);
          }
      }*/
    }
    
    
    $arSizes = array();
    
    $rsData = CUserTypeEntity::GetList(array(), array("ENTITY_ID" => "IBLOCK_" . $arParams["IBLOCK_ID"] . "_SECTION", "LANG" => "ru", "FIELD_NAME" => "UF_KRAKEN_CTLG_SIZE"));
    
    while ($arRes = $rsData->Fetch()) {
      $rsList = CUserFieldEnum::GetList(array("SORT" => "ASC"), array(
        "USER_FIELD_ID" => $arRes["ID"],
      ));
      
      while ($arList = $rsList->GetNext()) {
        $arSizes[$arList["XML_ID"]] = $arList["ID"];
      }
      
      
    }
    
    
    $arResult["SIZES"] = $arSizes;
    
  }
?>