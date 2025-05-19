<?
  if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();
  /** @var CBitrixComponent $this */
  /** @var array $arParams */
  /** @var array $arResult */
  /** @var string $componentPath */
  /** @var string $componentName */
  /** @var string $componentTemplate */
  /** @global CDatabase $DB */
  /** @global CUser $USER */
  /** @global CMain $APPLICATION */
  
  /** @global CIntranetToolbar $INTRANET_TOOLBAR */
  global $INTRANET_TOOLBAR;
  global $APPLICATION;
  global $KRAKEN_TEMPLATE_ARRAY;
  
  use Bitrix\Iblock;
  
  CModule::IncludeModule("iblock");
  
  if (!isset($arParams["CACHE_TIME"]))
    $arParams["CACHE_TIME"] = 36000000;
  
  
  $cur_page = $_SERVER["REQUEST_URI"];
  $cur_page_no_index = $APPLICATION->GetCurPage(false);
  
  
  $maxLevel = 3;
  
  $arLinks = $KRAKEN_TEMPLATE_ARRAY["MAIN_URLS"];
  
  /*$arLinks["catalog"] = "#SITE_DIR#catalog/";
  $arLinks["blog"] = "#SITE_DIR#blog/";
  $arLinks["news"] = "#SITE_DIR#news/";
  $arLinks["action"] = "#SITE_DIR#action/";*/
  
  
  $arCodes = array();
  
  $arCodes["catalog"] = "concept_kraken_site_catalog_";
  $arCodes["blog"] = "concept_kraken_site_history_";
  $arCodes["news"] = "concept_kraken_site_news_";
  $arCodes["action"] = "concept_kraken_site_action_";
  
  
  $arrUrls = array();
  
  
  if ($this->startResultCache($arParams["CACHE_TIME"], array())) {
    
    
    $arLands = array();
    
    $code = 'concept_kraken_site_' . SITE_ID;
    $arFilter1 = array('IBLOCK_CODE' => $code, "ACTIVE" => "");
    $dbResSect1 = CIBlockSection::GetList(array("left_margin" => "asc"), $arFilter1, false, array("ID", "SECTION_PAGE_URL"));
    
    while ($sectRes1 = $dbResSect1->GetNext())
      $arLands[$sectRes1["ID"]] = $sectRes1["SECTION_PAGE_URL"];
    
    
    $arCols = array();
    
    $rsData = CUserTypeEntity::GetList(array(), array("ENTITY_ID" => "IBLOCK_" . $KRAKEN_TEMPLATE_ARRAY["MENU_IBLOCK_ID"] . "_SECTION", "FIELD_NAME" => "UF_KRAKEN_MENU_COL"));
    if ($arRes = $rsData->Fetch()) {
      
      $dbRes = CUserFieldEnum::GetList(array(), array("USER_FIELD_ID" => $arRes["ID"]));
      
      while ($arRes = $dbRes->GetNext())
        $arCols[$arRes["ID"]] = $arRes;
      
    }
    
    $arTypes = array();
    
    $rsData = CUserTypeEntity::GetList(array(), array("ENTITY_ID" => "IBLOCK_" . $KRAKEN_TEMPLATE_ARRAY["MENU_IBLOCK_ID"] . "_SECTION", "FIELD_NAME" => "UF_KRAKEN_MENU_TYPE"));
    if ($arRes = $rsData->Fetch()) {
      
      $dbRes = CUserFieldEnum::GetList(array(), array("USER_FIELD_ID" => $arRes["ID"]));
      
      while ($arRes = $dbRes->GetNext())
        $arTypes[$arRes["ID"]] = $arRes;
      
    }
    
    
    if ($arParams["COMPONENT_TEMPLATE"] == "open_menu" || $arParams["COMPONENT_TEMPLATE"] == ".default") {
      
      $arViews = array();
      
      $rsData = CUserTypeEntity::GetList(array(), array("ENTITY_ID" => "IBLOCK_" . $KRAKEN_TEMPLATE_ARRAY["MENU_IBLOCK_ID"] . "_SECTION", "FIELD_NAME" => "UF_MENU_VIEW"));
      if ($arRes = $rsData->Fetch()) {
        
        $dbRes = CUserFieldEnum::GetList(array(), array("USER_FIELD_ID" => $arRes["ID"]));
        
        while ($arRes = $dbRes->GetNext())
          $arViews["ITEMS"][$arRes["ID"]] = $arRes;
      }
      $resetVar = is_array($arViews["ITEMS"]) ? $arViews["ITEMS"] : [];
      $firstItem = reset($resetVar);
      
      $arViews["DEFAULT"] = $firstItem["XML_ID"];
      
      unset($firstItem);
    }
    
    
    $arResult = array();
    
    $arFilter = array('IBLOCK_ID' => $KRAKEN_TEMPLATE_ARRAY["MENU_IBLOCK_ID"], "GLOBAL_ACTIVE" => "Y", "IBLOCK_ACTIVE" => "Y", "ACTIVE" => "Y", "<=" . "DEPTH_LEVEL" => $maxLevel);
    $dbResSect = CIBlockSection::GetList(array("left_margin" => "asc"), $arFilter, false, array("ID", "DEPTH_LEVEL", "NAME", "SECTION_PAGE_URL", "UF_*"));
    
    $selected = 0;
    
    while ($sectRes = $dbResSect->GetNext()) {
      
      if ($sectRes["UF_KRAKEN_MENU_COL"] && strlen($sectRes["UF_KRAKEN_MENU_COL"]) > 0)
        $sectRes["UF_KRAKEN_MENU_COL_VAL"] = $arCols[$sectRes["UF_KRAKEN_MENU_COL"]];
      
      if ($sectRes["UF_KRAKEN_MENU_TYPE"] && strlen($sectRes["UF_KRAKEN_MENU_TYPE"]) > 0)
        $sectRes["UF_KRAKEN_MENU_TYPE_VAL"] = $arTypes[$sectRes["UF_KRAKEN_MENU_TYPE"]];
      
      
      $menuElement = array();
      
      $menuElement["ID"] = $sectRes["ID"];
      $menuElement["NAME"] = $sectRes["~NAME"];
      $menuElement["LINK"] = $sectRes["UF_KRAKEN_MENU_LINK"];
      $menuElement["DEPTH_LEVEL"] = $sectRes["DEPTH_LEVEL"];
      $menuElement["TYPE"] = $sectRes["UF_KRAKEN_MENU_TYPE_VAL"]['XML_ID'];
      
      
      $menuElement["MENU_COLOR"] = $sectRes["~UF_KRAKEN_MENU_COLOR"];
      $menuElement["MENU_ICON"] = $sectRes["~UF_KRAKEN_MENU_ICON"];
      $menuElement["MENU_IC_US"] = $sectRes["~UF_KRAKEN_MENU_IC_US"];
      
      
      $hide_menu = false;
      
      if (isset($arViews)) {
        $menuElement["VIEW"] = ($arViews["ITEMS"][$sectRes["UF_MENU_VIEW"]]["XML_ID"] && strlen($arViews["ITEMS"][$sectRes["UF_MENU_VIEW"]]["XML_ID"]) > 0) ? $arViews["ITEMS"][$sectRes["UF_MENU_VIEW"]]["XML_ID"] : $arViews["DEFAULT"];
        
        
        $menuElement["MAX_QUANTITY_SECTION_SHOW"] = $KRAKEN_TEMPLATE_ARRAY["ITEMS"]["MENU_OTHER_COUNT_SHOW"]["VALUE"];
        
        if ($menuElement["TYPE"] == 'catalog') {
          $menuElement["MAX_QUANTITY_SECTION_SHOW"] = $KRAKEN_TEMPLATE_ARRAY["ITEMS"]["MENU_CATALOG_COUNT_SHOW"]["VALUE"];
          
          $hide_menu = ($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["HIDE_EMPTY_CATALOG"]["VALUE"]["ACTIVE"] == "Y") ? true : false;
          
          
          $menuElement["COL"] = $sectRes["UF_KRAKEN_MENU_COL_VAL"]['XML_ID'];
          
          if ($menuElement["VIEW"] == "view_2")
            $menuElement["COL"] = "catalog";
        } else {
          $menuElement["COL"] = $sectRes["UF_KRAKEN_MENU_COL_VAL"]['XML_ID'];
        }
      }
      
      
      $photo = 0;
      
      if ($sectRes["UF_PHX_MENU_PICT"])
        $photo = $sectRes["UF_PHX_MENU_PICT"];
      else if ($sectRes["PICTURE"])
        $photo = $sectRes["PICTURE"];
      
      
      if ($photo) {
        $img = CFile::ResizeImageGet($photo, array('width' => 100, 'height' => 100), BX_RESIZE_IMAGE_PROPORTIONAL, false);
        $menuElement["PICTURE_SRC"] = $img["src"];
      }
      
      
      if ($sectRes["UF_KRAKEN_M_BLANK"])
        $menuElement["BLANK"] = true;
      
      
      if ($menuElement["TYPE"] == 'none')
        $menuElement["NONE"] = true;
      
      
      if ($menuElement["TYPE"] == 'action')
        $menuElement["LINK"] = $arLinks[$menuElement["TYPE"]];
      
      if ($menuElement["TYPE"] == 'land') {
        
        if ($sectRes['UF_KRAKEN_LAND'] > 0)
          $menuElement["LINK"] = $arLands[$sectRes['UF_KRAKEN_LAND']];
        
        
      } else if ($menuElement["TYPE"] == 'form' || $menuElement["TYPE"] == 'modal' || $menuElement["TYPE"] == 'quiz') {
        $menuElement['NOLINK'] = true;
        $menuElement["NONE"] = true;
        
        
        $menuElement["FORM"] = $sectRes["UF_KRAKEN_M_FORM"];
        $menuElement["MODAL"] = $sectRes["UF_KRAKEN_M_MODAL"];
        $menuElement["QUIZ"] = $sectRes["UF_KRAKEN_M_QUIZ"];
        
        if (($menuElement["TYPE"] == 'form' &&
            ($sectRes["UF_KRAKEN_M_FORM"] && strlen($sectRes["UF_KRAKEN_M_FORM"]) > 0))
          || ($menuElement["TYPE"] == 'modal'
            && ($sectRes["UF_KRAKEN_M_MODAL"] && strlen($sectRes["UF_KRAKEN_M_MODAL"]) > 0))
          || ($menuElement["TYPE"] == 'quiz'
            && ($sectRes["UF_KRAKEN_M_QUIZ"] && strlen($sectRes["UF_KRAKEN_M_QUIZ"]) > 0)))
          $menuElement["NONE"] = false;
        
      }
      
      if ($menuElement["LINK"] && strlen($menuElement["LINK"]) > 0)
        $menuElement["LINK"] = str_replace("#SITE_DIR#", SITE_DIR, $menuElement["LINK"]);
      
      /*if(strlen($menuElement["LINK"]) > 0)
      {
          $selected = CMenu::IsItemSelected($menuElement["LINK"], $cur_page, $cur_page_no_index);

          if(strlen($menuElement["LINK"]) > 0)
          {
              if($selected > 0 && !empty($arrUrls) && in_array($menuElement["LINK"], $arrUrls))
                  $selected = 0;
              
              if($selected > 0)
                  $arrUrls[] = $menuElement["LINK"];
          }

          $menuElement['SELECTED'] = $selected;
      }*/
      
      
      $arSections["land_" . $menuElement["ID"]] = $menuElement;
      
      
      $lvl = $maxLevel - intval($menuElement["DEPTH_LEVEL"]);
      $step = $menuElement["DEPTH_LEVEL"];
      
      
      if ($menuElement["TYPE"] == 'catalog' || $menuElement["TYPE"] == 'blog' || $menuElement["TYPE"] == 'news') {
        
        $arSections["land_" . $menuElement["ID"]]["LINK"] = $arLinks[$menuElement["TYPE"]];
        
        
        if ($arSections["land_" . $menuElement["ID"]]["LINK"]
          && strlen($arSections["land_" . $menuElement["ID"]]["LINK"]) > 0)
          $arSections["land_" . $menuElement["ID"]]["LINK"] = str_replace("#SITE_DIR#", SITE_DIR, $arSections["land_" . $menuElement["ID"]]["LINK"]);
        
        /*if(strlen($arSections["land_".$menuElement["ID"]]["LINK"]) > 0)
        {
            $selected = CMenu::IsItemSelected($arSections["land_".$menuElement["ID"]]["LINK"], $cur_page, $cur_page_no_index);
            

            if(strlen($arSections["land_".$menuElement["ID"]]["LINK"]) > 0)
            {

                if($selected > 0 && !empty($arrUrls) && in_array($arSections["land_".$menuElement["ID"]]["LINK"], $arrUrls))
                    $selected = 0;
                
                if($selected > 0)
                    $arrUrls[] = $arSections["land_".$menuElement["ID"]]["LINK"];

            }


            $arSections["land_".$menuElement["ID"]]['SELECTED'] = $selected;
        }*/
        
        
        $type = "concept_kraken_" . SITE_ID;
        $code = $arCodes[$menuElement["TYPE"]] . SITE_ID;
        
        
        $iblock = CIBlock::GetList(array(), array("TYPE" => $type, "CODE" => $code), true);
        $arIBlock = $iblock->Fetch();
        
        $arSelect = array("ID", "NAME", "SECTION_PAGE_URL", "DEPTH_LEVEL", "ELEMENT_CNT", "DETAIL_PICTURE", "UF_*");
        $arFilter1 = array('IBLOCK_ID' => $arIBlock["ID"], "GLOBAL_ACTIVE" => "Y", "IBLOCK_ACTIVE" => "Y", "ACTIVE" => "Y", "<=" . "DEPTH_LEVEL" => $lvl, "CNT_ACTIVE" => "Y");
        
        $cnt = ($KRAKEN_TEMPLATE_ARRAY['CTLG_HIDE_COUNT_GOODS']['VALUE'][0] == "Y" && !$hide_menu) ? false : true;
        
        
        $dbResSect1 = CIBlockSection::GetList(array("left_margin" => "asc"), $arFilter1, $cnt, $arSelect);
        
        while ($sectRes1 = $dbResSect1->GetNext()) {
          $menuElement = array();
          
          
          $menuElement["ID"] = $sectRes1["ID"];
          $menuElement["NAME"] = $sectRes1["~NAME"];
          $menuElement["LINK"] = $sectRes1["SECTION_PAGE_URL"];
          $menuElement["DEPTH_LEVEL"] = $sectRes1["DEPTH_LEVEL"] + $step;
          $menuElement["SHOW"] = $sectRes1["UF_KRAKEN_MAIN_MENU"];
          $menuElement["ADD"] = true;
          
          $menuElement["ELEMENT_CNT"] = $sectRes1["ELEMENT_CNT"];
          
          
          if ($hide_menu && $menuElement["ELEMENT_CNT"] <= 0)
            continue;
          
          if ($sectRes1["UF_KRAKEN_MENU_PICT"]) {
            $img = CFile::ResizeImageGet($sectRes1["UF_KRAKEN_MENU_PICT"], array('width' => 100, 'height' => 100), BX_RESIZE_IMAGE_PROPORTIONAL, false);
            $menuElement["PICTURE_SRC"] = $img["src"];
          }
          
          
          /*if(strlen($menuElement["LINK"]) > 0)
          {
              $selected = CMenu::IsItemSelected($menuElement["LINK"], $cur_page, $cur_page_no_index);
              

              if(strlen($menuElement["LINK"]) > 0)
              {
                  if($selected > 0 && !empty($arrUrls) && in_array($menuElement["LINK"], $arrUrls))
                      $selected = 0;

                  if($selected > 0)
                      $arrUrls[] = $menuElement["LINK"];
              }

              $menuElement['SELECTED'] = $selected;
          }*/
          
          
          $arSections[] = $menuElement;
          
        }
        
      }
      
      
    }
    
    
    foreach ($arSections as $key => $arItem) {
      
      if ($arItem["DEPTH_LEVEL"] == 1) {
        $main_key = $key;
        $arResult[$main_key] = $arItem;
      }
      
      if ($arItem["DEPTH_LEVEL"] == 2) {
        $main_key1 = $key;
        
        $arResult[$main_key]["SUB"][$main_key1] = $arItem;
        $arResult[$main_key]["LEVEL"] = 2;
        unset($arResult[$main_key1]);
        
        /*if($arItem["SELECTED"])
            $arResult[$main_key]["SELECTED"] = true;*/
      }
      
      if ($arItem["DEPTH_LEVEL"] == 3) {
        $main_key2 = $key;
        
        $arResult[$main_key]["SUB"][$main_key1]["SUB"][$main_key2] = $arItem;
        $arResult[$main_key]["LEVEL"] = 3;
        unset($arResult[$main_key2]);
        
        /*if($arItem["SELECTED"])
        {
            $arResult[$main_key]["SELECTED"] = true;
            $arResult[$main_key]["SUB"][$main_key1]["SELECTED"] = true;
        }*/
        
      }
      
    }
    
    
    foreach ($arResult as $key => $arItem) {
      if ($arItem["ADD"] && !$arItem["SHOW"]) {
        unset($arResult[$key]);
      } else {
        if (!empty($arItem["SUB"]) && is_array($arItem["SUB"])) {
          foreach ($arItem["SUB"] as $key1 => $arSub) {
            if ($arSub["ADD"] && !$arSub["SHOW"]) {
              unset($arResult[$key]["SUB"][$key1]);
            } else {
              if (!empty($arSub["SUB"]) && is_array($arSub["SUB"])) {
                foreach ($arSub["SUB"] as $key2 => $arSub2) {
                  if ($arSub2["ADD"] && !$arSub2["SHOW"]) {
                    unset($arResult[$key]["SUB"][$key1]["SUB"][$key2]);
                  }
                }
              }
            }
          }
        }
      }
      
    }
    
    $this->includeComponentTemplate();
    
  }

?>

