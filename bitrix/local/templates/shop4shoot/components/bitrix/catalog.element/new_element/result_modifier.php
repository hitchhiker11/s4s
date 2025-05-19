<? if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();

/**
 * @var CBitrixComponentTemplate $this
 * @var CatalogElementComponent $component
 */



  $arMenu = Array();
  $arTmpMenu = Array();
  $arTmpMenuSort = Array();
  
  $arSort = Array();
  
  $arBlocks = false;
//advantages
  if($arResult["PROPERTIES"]["SHOWMENU_BLOCK2"]["VALUE"] == "Y" && !empty($arResult["PROPERTIES"]["ADVANTAGES"]["VALUE"]))
  {
    $arTmpMenu["advantages"]["NAME"] = $arResult["PROPERTIES"]["MENUTITLE_BLOCK2"]["~VALUE"];
    $arTmpMenuSort["advantages"] = ((strlen($arResult["PROPERTIES"]["POSITION_BLOCK2"]["VALUE"]) > 0) ? $arResult["PROPERTIES"]["POSITION_BLOCK2"]["VALUE"] : 10);
    
    $arBlocks = true;
  }
  
  $arSort["advantages"] = ((strlen($arResult["PROPERTIES"]["POSITION_BLOCK2"]["VALUE"]) > 0) ? $arResult["PROPERTIES"]["POSITION_BLOCK2"]["VALUE"] : 10);



//chars
  if($arResult["PROPERTIES"]["SHOWMENU_BLOCK3"]["VALUE"] == "Y" && ($arResult["CHARS"]["COUNT"]>0 || !empty($arResult["PROPERTIES"]["FILES"]["VALUE"])))
  {
    $arTmpMenu["chars"]["NAME"] = $arResult["PROPERTIES"]["MENUTITLE_BLOCK3"]["~VALUE"];
    $arTmpMenuSort["chars"] = ((strlen($arResult["PROPERTIES"]["POSITION_BLOCK3"]["VALUE"]) > 0) ? $arResult["PROPERTIES"]["POSITION_BLOCK3"]["VALUE"] : 10);
    
    $arBlocks = true;
  }


//video
  if($arResult["PROPERTIES"]["SHOWMENU_BLOCK4"]["VALUE"] == "Y" && !empty($arResult["PROPERTIES"]["VIDEO"]["VALUE"]))
  {
    $arTmpMenu["video"]["NAME"] = $arResult["PROPERTIES"]["MENUTITLE_BLOCK4"]["~VALUE"];
    $arTmpMenuSort["video"] = ((strlen($arResult["PROPERTIES"]["POSITION_BLOCK4"]["VALUE"]) > 0) ? $arResult["PROPERTIES"]["POSITION_BLOCK4"]["VALUE"] : 10);
    
    $arBlocks = true;
  }
  
  $arSort["video"] = ((strlen($arResult["PROPERTIES"]["POSITION_BLOCK4"]["VALUE"]) > 0) ? $arResult["PROPERTIES"]["POSITION_BLOCK4"]["VALUE"] : 10);


//similar
  if($arResult["PROPERTIES"]["SHOWMENU_BLOCK5"]["VALUE"] == "Y" && !empty($arResult["PROPERTIES"]["SIMILAR"]["VALUE"]))
  {
    $arTmpMenu["similar"]["NAME"] = $arResult["PROPERTIES"]["MENUTITLE_BLOCK5"]["~VALUE"];
    $arTmpMenuSort["similar"] = ((strlen($arResult["PROPERTIES"]["POSITION_BLOCK5"]["VALUE"]) > 0) ? $arResult["PROPERTIES"]["POSITION_BLOCK5"]["VALUE"] : 10);
    
    $arBlocks = true;
  }
  
  $arSort["similar"] = ((strlen($arResult["PROPERTIES"]["POSITION_BLOCK5"]["VALUE"]) > 0) ? $arResult["PROPERTIES"]["POSITION_BLOCK5"]["VALUE"] : 10);


//stuff
  if($arResult["PROPERTIES"]["SHOWMENU_BLOCK6"]["VALUE"] == "Y" && !empty($arResult["PROPERTIES"]["STUFF"]["VALUE"]))
  {
    $arTmpMenu["stuff"]["NAME"] = $arResult["PROPERTIES"]["MENUTITLE_BLOCK6"]["~VALUE"];
    $arTmpMenuSort["stuff"] = ((strlen($arResult["PROPERTIES"]["POSITION_BLOCK6"]["VALUE"]) > 0) ? $arResult["PROPERTIES"]["POSITION_BLOCK6"]["VALUE"] : 10);
    
    $arBlocks = true;
  }
  
  $arSort["stuff"] = ((strlen($arResult["PROPERTIES"]["POSITION_BLOCK6"]["VALUE"]) > 0) ? $arResult["PROPERTIES"]["POSITION_BLOCK6"]["VALUE"] : 10);


//reviews
  if($arResult["PROPERTIES"]["SHOWMENU_BLOCK7"]["VALUE"] == "Y" && !empty($arResult["PROPERTIES"]["REVIEWS"]["VALUE"]))
  {
    $arTmpMenu["reviews"]["NAME"] = $arResult["PROPERTIES"]["MENUTITLE_BLOCK7"]["~VALUE"];
    $arTmpMenuSort["reviews"] = ((strlen($arResult["PROPERTIES"]["POSITION_BLOCK7"]["VALUE"]) > 0) ? $arResult["PROPERTIES"]["POSITION_BLOCK7"]["VALUE"] : 10);
    
    $arBlocks = true;
  }
  
  $arSort["reviews"] = ((strlen($arResult["PROPERTIES"]["POSITION_BLOCK7"]["VALUE"]) > 0) ? $arResult["PROPERTIES"]["POSITION_BLOCK7"]["VALUE"] : 10);




//faq
  if($arResult["PROPERTIES"]["SHOWMENU_BLOCK8"]["VALUE"] == "Y" && !empty($arResult["PROPERTIES"]["FAQ"]["VALUE"]))
  {
    $arTmpMenu["faq"]["NAME"] = $arResult["PROPERTIES"]["MENUTITLE_BLOCK8"]["~VALUE"];
    $arTmpMenuSort["faq"] = ((strlen($arResult["PROPERTIES"]["POSITION_BLOCK8"]["VALUE"]) > 0) ? $arResult["PROPERTIES"]["POSITION_BLOCK8"]["VALUE"] : 10);
    
    $arBlocks = true;
  }
  
  $arSort["faq"] = ((strlen($arResult["PROPERTIES"]["POSITION_BLOCK8"]["VALUE"]) > 0) ? $arResult["PROPERTIES"]["POSITION_BLOCK8"]["VALUE"] : 10);



//text
  if($arResult["PROPERTIES"]["SHOWMENU_BLOCK9"]["VALUE"] == "Y" && strlen($arResult["DETAIL_TEXT"]) > 0)
  {
    $arTmpMenu["text"]["NAME"] = $arResult["PROPERTIES"]["MENUTITLE_BLOCK9"]["~VALUE"];
    $arTmpMenuSort["text"] = ((strlen($arResult["PROPERTIES"]["POSITION_BLOCK9"]["VALUE"]) > 0) ? $arResult["PROPERTIES"]["POSITION_BLOCK9"]["VALUE"] : 10);
    
    $arBlocks = true;
  }
  
  $arSort["text"] = ((strlen($arResult["PROPERTIES"]["POSITION_BLOCK9"]["VALUE"]) > 0) ? $arResult["PROPERTIES"]["POSITION_BLOCK9"]["VALUE"] : 10);


//text2
  if($arResult["PROPERTIES"]["SHOWMENU_BLOCK12"]["VALUE"] == "Y" && isset($arResult["PROPERTIES"]["DETAIL_TEXT_BLOCK12"]["VALUE"]["TEXT"]))
  {
    $arTmpMenu["text2"]["NAME"] = $arResult["PROPERTIES"]["MENUTITLE_BLOCK12"]["~VALUE"];
    $arTmpMenuSort["text2"] = ((strlen($arResult["PROPERTIES"]["POSITION_BLOCK12"]["VALUE"]) > 0) ? $arResult["PROPERTIES"]["POSITION_BLOCK12"]["VALUE"] : 10);
    
    $arBlocks = true;
  }
  
  $arSort["text2"] = ((strlen($arResult["PROPERTIES"]["POSITION_BLOCK12"]["VALUE"]) > 0) ? $arResult["PROPERTIES"]["POSITION_BLOCK12"]["VALUE"] : 10);

//text3
  if($arResult["PROPERTIES"]["SHOWMENU_BLOCK13"]["VALUE"] == "Y" && isset($arResult["PROPERTIES"]["DETAIL_TEXT_BLOCK13"]["VALUE"]["TEXT"]))
  {
    $arTmpMenu["text3"]["NAME"] = $arResult["PROPERTIES"]["MENUTITLE_BLOCK13"]["~VALUE"];
    $arTmpMenuSort["text3"] = ((strlen($arResult["PROPERTIES"]["POSITION_BLOCK13"]["VALUE"]) > 0) ? $arResult["PROPERTIES"]["POSITION_BLOCK13"]["VALUE"] : 10);
    
    $arBlocks = true;
  }
  
  $arSort["text3"] = ((strlen($arResult["PROPERTIES"]["POSITION_BLOCK13"]["VALUE"]) > 0) ? $arResult["PROPERTIES"]["POSITION_BLOCK13"]["VALUE"] : 10);


//gallery
  if($arResult["PROPERTIES"]["SHOWMENU_BLOCK10"]["VALUE"] == "Y" && !empty($arResult["PROPERTIES"]["GALLERY"]["VALUE"]))
  {
    $arTmpMenu["gallery"]["NAME"] = $arResult["PROPERTIES"]["MENUTITLE_BLOCK10"]["~VALUE"];
    $arTmpMenuSort["gallery"] = ((strlen($arResult["PROPERTIES"]["POSITION_BLOCK10"]["VALUE"]) > 0) ? $arResult["PROPERTIES"]["POSITION_BLOCK10"]["VALUE"] : 10);
    
    $arBlocks = true;
  }

//main
  if($arResult["PROPERTIES"]["SHOWMENU_BLOCK1"]["VALUE"] == "Y")
  {
    $arMenu["main"]["NAME"] = $arResult["PROPERTIES"]["MENUTITLE_BLOCK1"]["~VALUE"];
  }
  
  function cmp($a, $b)
  {
    if ($a == $b) {
      return 0;
    }
    return ($a < $b) ? -1 : 1;
  }
  uasort($arTmpMenuSort, "cmp");
  uasort($arSort, "cmp");
  foreach($arTmpMenuSort as $key=>$value)
    $arMenu[$key] = $arTmpMenu[$key];
  $arResult["SIDE_MENU"] = $arMenu;
$component = $this->getComponent();
$arParams = $component->applyTemplateModifications();

