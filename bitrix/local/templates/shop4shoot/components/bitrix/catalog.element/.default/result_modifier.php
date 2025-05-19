<? if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) die();?>

<?
global $KRAKEN_TEMPLATE_ARRAY, $DB;
CKraken::getMess(array("catalog"));
CKraken::includeCustomMessages();
CKraken::getHIBlockOptions();


$section_id = $arResult["IBLOCK_SECTION_ID"];

$arResult["SECTIONS_ID"] = array();

while($section_id != 0)
{
    $res = CIBlockSection::GetByID($section_id);
    if($ar_res = $res->GetNext())
        $arResult["SECTIONS_ID"][] = $ar_res["ID"];

    $section_id = $ar_res["IBLOCK_SECTION_ID"];
}

if(empty($arResult["PROPERTIES"]))
{
    $arFilter = Array("IBLOCK_ID"=>$arResult["IBLOCK_ID"], "ID" => $arResult["ID"]);
    $res = CIBlockElement::GetList(Array("SORT"=>"ASC"), $arFilter, false);

    while($ob = $res->GetNextElement())
    {
        $arResult["PROPERTIES"] = $ob->GetProperties();
    }
}



$arResult["OFFERS"] = $arResult["OFFERS_SKU"] = array();


if(strlen($arResult["PROPERTIES"]["OFFERS"]["VALUE"])>0)
{
    CKraken::getIblockIDs(
        array(
            "CODES" => array("concept_kraken_site_catalog_offers_".SITE_ID), 
            "SITE_ID"=>SITE_ID
        )
    );

    
    $arFilter = Array("IBLOCK_ID"=>$KRAKEN_TEMPLATE_ARRAY['OFFERS']["IBLOCK_ID"], "SECTION_ID" => $arResult["PROPERTIES"]["OFFERS"]["VALUE"], "ACTIVE"=>"Y", "SECTION_ACTIVE"=>"Y");
    $res = CIBlockElement::GetList(Array("SORT"=>"ASC"), $arFilter, false);

    while($ob = $res->GetNextElement())
    {
        $item = $ob->GetFields();
        $item["PROPERTIES"] = $ob->GetProperties(); 
        $arResult["OFFERS"][] = $item;
    }
    
    
}
CKraken::getProductPropsList(SITE_ID);



$arResult["HAVEOFFERS"] = !empty($arResult["OFFERS"]);


$skuCharsFlag = false;

if($arResult["HAVEOFFERS"])
{

    
    CKraken::getSkuList(SITE_ID);


    $arSku = CKraken::getSkuOffers($arResult["OFFERS"]);

    $isEmptySku = empty($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["SKU_LIST"]["VALUE_SKU"]);
    $isEmptySkuValues = empty($arSku["OFFERS_VALUES"]);
    $isEmptySkuShowDetail = empty($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["SKU_LIST"]["VALUE_SHOW_DETAIL"]);
    

    if(!$isEmptySkuValues)
    {
        foreach ($arResult["OFFERS"] as $keyOffer => $arOffer)
        {
            if(!$isEmptySku)
            {
                foreach ($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["SKU_LIST"]["VALUE_SKU"] as $idProp => $codeProp)
                {
                    if(strlen($arSku["OFFERS_VALUES"][$keyOffer]["TREE"][$idProp]["VALUE"])>0)
                    {
                        $arResult["OFFERS"][$keyOffer]["TREE"]["PROP_".$idProp]=$arSku["OFFERS_VALUES"][$keyOffer]["TREE"][$idProp]["ID"];
                        $arResult["OFFERS"][$keyOffer]["TREE_NAME"][]=$arSku["OFFERS_VALUES"][$keyOffer]["TREE"][$idProp]["NAME"];
                        $arResult["OFFERS"][$keyOffer]["TREE_VALUE"][]=$arSku["OFFERS_VALUES"][$keyOffer]["TREE"][$idProp]["VALUE"]; 
                        $arResult["OFFERS"][$keyOffer]["TREE_NAME_VALUE"][]=$arSku["OFFERS_VALUES"][$keyOffer]["TREE"][$idProp]["NAME"].":&nbsp;".$arSku["OFFERS_VALUES"][$keyOffer]["TREE"][$idProp]["VALUE"];

                        $skuCharsFlag = true;
                    }
                }
            }

            if(!$isEmptySkuShowDetail)
            {
                foreach ($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["SKU_LIST"]["VALUE_SHOW_DETAIL"] as $idProp => $codeProp)
                {
                    if(strlen($arSku["OFFERS_VALUES"][$keyOffer]["TREE"][$idProp]["VALUE"])>0)
                    {
                        $arResult["OFFERS"][$keyOffer]["SKU_CHARS"][]=
                            array(
                                "NAME"=>$arSku["OFFERS_VALUES"][$keyOffer]["TREE"][$idProp]["NAME"],
                                "VALUE"=>$arSku["OFFERS_VALUES"][$keyOffer]["TREE"][$idProp]["VALUE"],
                                "NAME_VALUE"=>$arSku["OFFERS_VALUES"][$keyOffer]["TREE"][$idProp]["NAME"].":&nbsp;".$arSku["OFFERS_VALUES"][$keyOffer]["TREE"][$idProp]["VALUE"]
                            ); 
                    }
                }
            }
        }
    }


    $arResult["OFFERS_SKU"] = $arSku["VALUE_SKU"];
}


$arResult["FIRST_ITEM"] = array();



if($arResult["HAVEOFFERS"])
{    
    foreach ($arResult["OFFERS"] as $keyOffer => $arOffer)
    {
        $arResult["OFFERS"][$keyOffer] = array_merge(
            $arResult["OFFERS"][$keyOffer], CKraken::getProductInfoFormated(
                array(
                    "ITEM"=>$arOffer,
                    "IS_OFFER"=>"Y",
                    "MAIN_GALLERY"=>$arResult["PROPERTIES"]["MORE_PHOTO"],
                    "DETAIL_PAGE_URL"=>$arResult["DETAIL_PAGE_URL"],
                    "MAIN_ID"=>$arResult["ID"],
                    "MAIN_NAME"=>$arResult["~NAME"],
                    "MAIN_PRICE_COMMENT1"=>$arResult["PROPERTIES"]["PRICE_COMMENT1"]["~VALUE"],
                    "MAIN_PREVIEW_TEXT"=>$arResult["~PREVIEW_TEXT"],
                    "COOKIE_BASKET"=>$KRAKEN_TEMPLATE_ARRAY["BASKET"]["ITEMS"],
                    "CART_PRICE_STEP"=> $arResult["PROPERTIES"]["CART_PRICE_STEP"]["VALUE"],
                    "CART_MIN_COUNT"=> $arResult["PROPERTIES"]["CART_MIN_COUNT"]["VALUE"],
                    "IPROPERTY_VALUES"=>$arResult["IPROPERTY_VALUES"],
                    "DETAIL" => "Y"
                )
            )
        );

    }

    $arResult["OFFER_SELECTED"] = 0;
    
    if(isset($_GET["oID"]))
    {
        foreach ($arResult["OFFERS"] as $keyOffer=> $arOffer)
        {
            if($arOffer["ID"]==$_GET["oID"])
            {
                $arResult["OFFER_SELECTED"] = $keyOffer;
                break;
            }
        }

    }

    $arResult["FIRST_ITEM"] = $arResult["OFFERS"][$arResult["OFFER_SELECTED"]]["PRODUCT_INFO"];


    foreach ($arResult["OFFERS"] as $arOffer)
    {
		$arResult["PRODUCT_INFO"][] = $arOffer["PRODUCT_INFO"];
	}

    
}
else
{
//    $arResult = array_merge($arResult, CKraken::getProductInfoFormated(
//        array(
//            "ITEM"=>$arResult,
//            "COOKIE_BASKET"=>$KRAKEN_TEMPLATE_ARRAY["BASKET"]["ITEMS"],
//            "DETAIL" => "Y"
//        )));
//    $arResult["FIRST_ITEM"] = $arResult["PRODUCT_INFO"];
}

$GLOBALS["OG_IMAGE_DEF"]=$arResult["FIRST_ITEM"]["GALLERY"][0]["SMALL"];


$arResult["FORM_FAST_ORDER"] = ($arResult["PROPERTIES"]["ORDER_FORM"]["VALUE"]>0) ? $arResult["PROPERTIES"]["ORDER_FORM"]["VALUE"] : $KRAKEN_TEMPLATE_ARRAY['FORMS']['VALUE_CATALOG'];



$arResult["BTN_ADD2BASKET_NAME"] = GetMessage("KRAKEN_TEMPLATES_CATALOG_ELEMENT_BTN_ADD_NAME");

if(strlen($arResult["PROPERTIES"]["CART_BTN_NAME"]["~VALUE"]) > 0)
    $arResult["BTN_ADD2BASKET_NAME"] = $arResult["PROPERTIES"]["CART_BTN_NAME"]["~VALUE"];

else if(strlen($KRAKEN_TEMPLATE_ARRAY["CART_BTN_ADD_NAME"]["~VALUE"]) > 0)
    $arResult["BTN_ADD2BASKET_NAME"] = $KRAKEN_TEMPLATE_ARRAY["CART_BTN_ADD_NAME"]["~VALUE"];





$arResult["BTN_ADDED2BASKET_NAME"] = GetMessage("KRAKEN_TEMPLATES_CATALOG_ELEMENT_BTN_ADDED_NAME");

if(strlen($arResult["PROPERTIES"]["CART_BTN_NAME_ADDED"]["~VALUE"]) > 0)
    $arResult["BTN_ADDED2BASKET_NAME"] = $arResult["PROPERTIES"]["CART_BTN_NAME_ADDED"]["~VALUE"];

else if(strlen($KRAKEN_TEMPLATE_ARRAY["CART_BTN_ADDED_NAME"]["~VALUE"]) > 0)
    $arResult["BTN_ADDED2BASKET_NAME"] = $KRAKEN_TEMPLATE_ARRAY["CART_BTN_ADDED_NAME"]["~VALUE"];




$arResult["BTN_FAST_ORDER_NAME"] = $KRAKEN_TEMPLATE_ARRAY["CTLG_BTN"]["~VALUE"];

if(strlen($arResult["PROPERTIES"]["BUTTON_NAME"]["VALUE"]) > 0)
    $arResult["BTN_FAST_ORDER_NAME"] = $arResult["PROPERTIES"]["BUTTON_NAME"]["~VALUE"];




//advantages
$parent_section_id = $arResult["IBLOCK_SECTION_ID"];

$arResult["CATALOG_ADV"] = array();

while($parent_section_id != 0 && $arResult["PROPERTIES"]["PARENT_ADV"]["VALUE"] == "Y")
{
    $arSelect = Array("ID", "DETAIL_PICTURE", "IBLOCK_SECTION_ID", "UF_*");
    $arFilter = Array("IBLOCK_ID"=>$arParams["IBLOCK_ID"], "ID"=>$parent_section_id, "ACTIVE"=>"Y", "GLOBAL_ACTIVE"=>"Y");
    $db_list = CIBlockSection::GetList(Array(), $arFilter, false, $arSelect);
    
    while($ar_res = $db_list->GetNext())
    {
        if(empty($arResult["CATALOG_ADV"]))
            $arResult["CATALOG_ADV"] = $ar_res["UF_KRAKEN_CTLG_ADV"];

        $parent_section_id = $ar_res["IBLOCK_SECTION_ID"];

    }
    
}


if(!empty($arResult["PROPERTIES"]["ADVANTAGES"]["VALUE"]))
    $arResult["CATALOG_ADV"] = array_merge($arResult["CATALOG_ADV"], $arResult["PROPERTIES"]["ADVANTAGES"]["VALUE"]);




$arResult["PROPS_CHARS"] = array();
$arResult["PROP_CHARS"] = array();

$arSortChars = array();


if(!empty($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["PRODUCT_PROPS_LIST_DETAIL"]["VALUE_RES"]))
{

    $arPropG = $arPropE = array();


    foreach ($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["PRODUCT_PROPS_LIST_DETAIL"]["VALUE_RES"] as $key => $value)
    {
        $item = (isset($arResult["PROPERTIES"][$key]))? $arResult["PROPERTIES"][$key] : $arResult["PROPERTIES"][$value];


        if($item["PROPERTY_TYPE"] == "E")
        {
            if(is_array($item["VALUE"]))
            {
                foreach ($item["VALUE"] as $keyValue => $itemValue){
                    $arPropE[] = $itemValue;
                }
            }
            else
                $arPropE[] = $item["VALUE"];
        }

        else if($item["PROPERTY_TYPE"] == "G")
        {
            if(is_array($item["VALUE"]))
            {
                foreach ($item["VALUE"] as $keyValue => $itemValue){
                    $arPropG[] = $itemValue;
                }
            }
            else
                $arPropG[] = $item["VALUE"];
        }
    }



    if(!empty($arPropE))
    {
        $arFilter = Array("ID"=> $arPropE, "ACTIVE"=>"Y");
        $res = CIBlockElement::GetList(Array(), $arFilter, false, false, array("ID", "NAME", "DETAIL_PAGE_URL"));

        $arPropEres = array();

        while($ob = $res->GetNext()){ 
            $arPropEres[$ob["ID"]] = "<a href=\"".$ob["DETAIL_PAGE_URL"]."\" target=\"_blank\">".strip_tags($ob["~NAME"])."</a>";
        }
    }

    if(!empty($arPropG))
    {
        $arFilter = Array('ID' => $arPropG, "ACTIVE"=>"Y");
        $resSect = CIBlockSection::GetList(Array("SORT"=>"ASC"), $arFilter, false, array("ID", "NAME", "SECTION_PAGE_URL"));

        $arPropGres = array();
        while($ob = $resSect->GetNext())
        {
            $arPropGres[$ob["ID"]] = "<a href=\"".$ob["SECTION_PAGE_URL"]."\" target=\"_blank\">".strip_tags($ob["~NAME"])."</a>";
        }

    }



    foreach ($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["PRODUCT_PROPS_LIST_DETAIL"]["VALUE_RES"] as $key => $value)
    {

        $item = (isset($arResult["PROPERTIES"][$key]))? $arResult["PROPERTIES"][$key] : $arResult["PROPERTIES"][$value];


        if($item["PROPERTY_TYPE"]=="S" && $item["USER_TYPE"]=="directory")
        {
            if(is_array($item["~VALUE"]))
            {
                foreach ($item["~VALUE"] as $keyValue => $itemValue){
                    $item["~VALUE"][$keyValue] = $KRAKEN_TEMPLATE_ARRAY["SKU_PROP_LIST"][$item["USER_TYPE_SETTINGS"]["TABLE_NAME"]]["VALUES"][$itemValue]["NAME"];
                }
            }
            else
                $item["~VALUE"] = $KRAKEN_TEMPLATE_ARRAY["SKU_PROP_LIST"][$item["USER_TYPE_SETTINGS"]["TABLE_NAME"]]["VALUES"][$item["VALUE"]]["NAME"];
        }
        else if($item["PROPERTY_TYPE"] == "E")
        {
            if(is_array($item["~VALUE"]))
            {
                foreach ($item["~VALUE"] as $keyValue => $itemValue){

                    if(array_key_exists($itemValue, $arPropEres))
                        $item["~VALUE"][$keyValue] = $arPropEres[$itemValue];
                    else
                        unset($item["~VALUE"][$keyValue]);
                }

            }
            else
            {
                if(array_key_exists($item["~VALUE"], $arPropEres))
                    $item["~VALUE"] = $arPropEres[$item["~VALUE"]];
                else
                    unset($item["~VALUE"]);
            }

        }

        else if($item["PROPERTY_TYPE"] == "G")
        {
            if(is_array($item["~VALUE"]))
            {
                foreach ($item["~VALUE"] as $keyValue => $itemValue){

                    if(array_key_exists($itemValue, $arPropGres))
                        $item["~VALUE"][$keyValue] = $arPropGres[$itemValue];
                    else
                        unset($item["~VALUE"][$keyValue]);
                }

            }
            else
            {

                if(array_key_exists($item["~VALUE"], $arPropGres))
                    $item["~VALUE"] = $arPropGres[$item["~VALUE"]];
                else
                    unset($item["~VALUE"]);
            }

        }

        else if($item["PROPERTY_TYPE"] == "F")
        {

            if(is_array($item["~VALUE"]))
            {
                foreach ($item["~VALUE"] as $keyValue => $itemValue){
                    $arFile = CFile::GetByID($itemValue);
                    $resFile = $arFile->Fetch();

                    $item["~VALUE"][$keyValue] = "<a href=\"".CFile::GetPath($itemValue)."\" target=\"_blank\">".$resFile["FILE_NAME"]."</a>";
                }

            }
            else
            {
                $arFile = CFile::GetByID($item["VALUE"]);
                $resFile = $arFile->Fetch();

                $item["~VALUE"] = "<a href=\"".CFile::GetPath($item["VALUE"])."\" target=\"_blank\">".$resFile["FILE_NAME"]."</a>";
            }
            
            
        }

        $resValue = (is_array($item["VALUE"]))?implode(", ", $item["~VALUE"]) : $item["~VALUE"];

        if(strlen($resValue)>0)
            $arResult["PROPS_CHARS"][] = array("NAME"=>$item["~NAME"], "DESCRIPTION"=>$resValue);



    }

    $arSortChars["props_chars"] = $KRAKEN_TEMPLATE_ARRAY["ITEMS"]["CATALOG_SORT_PROP_CHARS"]["VALUE"];

}

if(!empty($arResult["PROPERTIES"]["CHARS"]["VALUE"]))
{
    foreach ($arResult["PROPERTIES"]["CHARS"]["~VALUE"] as $key => $value) {
        $arTmp = array();

        if(strlen($value)>0)
        {
            $arTmp["NAME"] = $value;
            $arTmp["DESCRIPTION"] = "";
            if(strlen($arResult["PROPERTIES"]["CHARS"]["DESCRIPTION"][$key])>0)
                $arTmp["DESCRIPTION"] = $arResult["PROPERTIES"]["CHARS"]["~DESCRIPTION"][$key];

            $arResult["PROP_CHARS"][]=$arTmp;
        }
    }

    $arSortChars["prop_chars"] = $KRAKEN_TEMPLATE_ARRAY["ITEMS"]["CATALOG_SORT_PROP_CHARS"]["VALUE"];
}

if($skuCharsFlag)
    $arSortChars["sku_chars"] = $KRAKEN_TEMPLATE_ARRAY["ITEMS"]["CATALOG_SORT_SKU_CHARS"]["VALUE"];


$arResult["CHARS"] = array(
    "ITEMS"=>array(),
    "COUNT"=>0
);

$arResult["CHARS"]["ITEMS"] = array_merge($arResult["PROPS_CHARS"], $arResult["PROP_CHARS"]);
$arResult["CHARS"]["COUNT"] = (!empty($arResult["CHARS"]["ITEMS"]))?count($arResult["CHARS"]["ITEMS"]):0;



if(!empty($arResult["CATALOG_ADV"]))
{
    
    $arElements = Array();

    $arSelect = Array("ID", "IBLOCK_ID", "NAME", "PREVIEW_PICTURE", "PROPERTY_*");
    $arFilter = Array("ID"=>$arResult["CATALOG_ADV"], "ACTIVE"=>"Y");

    $res = CIBlockElement::GetList(Array("SORT"=>"ASC"), $arFilter, false, false, $arSelect);
    while($ob = $res->GetNextElement())
    { 
        $arElem = $ob->GetFields();  
        $arElem["PROPERTIES"] = $ob->GetProperties();
        
        $arElements[] = $arElem;
    }
    
    $arResult["PROPERTIES"]["ADVANTAGES"]["VALUE"] = $arElements;

}



//stuff
$arResult["PROPERTIES"]["STUFF"]["VALUE"] = GetIBlockElement($arResult["PROPERTIES"]["STUFF"]["VALUE"]);


// BLOG, NEWS, ACTIONS SECTIONS

$code = array('concept_kraken_site_history_'.SITE_ID, 'concept_kraken_site_news_'.SITE_ID, 'concept_kraken_site_action_'.SITE_ID);

$SectList = CIBlockSection::GetList(array(), array("IBLOCK_CODE"=>$code, "ACTIVE"=>"Y"), false, array("ID","NAME","SECTION_PAGE_URL"));
while ($SectListGet = $SectList->GetNext())
{
    $arResult["BNA"][$SectListGet["ID"]]=$SectListGet;
}

$arNews = array();

if(!empty($arResult["PROPERTIES"]["NEWS"]["VALUE"]))
    $arNews = array_merge($arNews, $arResult["PROPERTIES"]["NEWS"]["VALUE"]);

if(!empty($arResult["PROPERTIES"]["BLOGS"]["VALUE"]))
    $arNews = array_merge($arNews, $arResult["PROPERTIES"]["BLOGS"]["VALUE"]);

if(!empty($arResult["PROPERTIES"]["SPECIALS"]["VALUE"]))
    $arNews = array_merge($arNews, $arResult["PROPERTIES"]["SPECIALS"]["VALUE"]);

$arResult["PARENT_ON"] = "N";
                

if(!empty($arNews))
{

    $filterOr = array(
            "LOGIC" => "OR",
            array("ACTIVE_DATE"=>"Y"),
            array("<=DATE_ACTIVE_FROM" => date($DB->DateFormatToPHP(CLang::GetDateFormat("FULL")), mktime())) 
        );

    $arSort = Array("ACTIVE_FROM" => "DESC", "ID" => "DESC");
    $arFilter = Array("ID"=> $arNews, "ACTIVE"=>"Y", $filterOr);
    $res = CIBlockElement::GetList($arSort, $arFilter);
    
    $arNews = Array();
    
    while($ob = $res->GetNextElement())
    {
        $arElement = Array();
        
        $arElement = $ob->GetFields();  
        $arElement["PROPERTIES"] = $ob->GetProperties();
    
        $arNews[] = $arElement;
        
        if(strlen($arElement["IBLOCK_SECTION_ID"]) > 0 || $arElement["IBLOCK_CODE"] == "concept_kraken_site_action_".SITE_ID)
            $arResult["PARENT_ON"] = "Y";
       
    }

}

if(!empty($arNews))
{
    $arNewsTmp = Array();
    
    foreach($arNews as $key=>$arN)
    {
        if($arN["IBLOCK_CODE"] == "concept_kraken_site_history_".SITE_ID)
        {
            $arNewsTmp[] = $arN;
            unset($arNews[$key]);
        }
    }
    
    $arNewsArray = Array();
    
    if(!empty($arNewsTmp))
        $arNewsArray = array_merge($arNewsArray, $arNewsTmp);
        
    if(!empty($arNews))
        $arNewsArray = array_merge($arNewsArray, $arNews);
    
}

if(!empty($arNewsArray))
    $arResult["PROPERTIES"]["REVIEWS"]["VALUE"] = array_values($arNewsArray);


//faq
if(!empty($arResult["PROPERTIES"]["FAQ_QUESTIONS"]["VALUE"]))
{
    $code_faq = "concept_kraken_site_faq_".SITE_ID;
    $arFilter = Array("IBLOCK_CODE"=>$code_faq, "SECTION_ID" => $arResult["PROPERTIES"]["FAQ_QUESTIONS"]["VALUE"], "ACTIVE"=>"Y", "INCLUDE_SUBSECTIONS" => "N");
    $res = CIBlockElement::GetList(Array("sort" => "asc"), $arFilter);

    while($ob = $res->GetNextElement())
    {

        $arElement = Array();
        
        $arElement = $ob->GetFields();  
        $arElement["PROPERTIES"] = $ob->GetProperties();

        $arResult["PROPERTIES"]["FAQ"]["VALUE"][] = $arElement;
       
    } 
}






$arMenu = Array();
$arTmpMenu = Array();
$arTmpMenuSort = Array();

$arSort = Array();

$arBlocks = false;

//main
if($arResult["PROPERTIES"]["SHOWMENU_BLOCK1"]["VALUE"] == "Y")
{
    $arMenu["main"]["NAME"] = $arResult["PROPERTIES"]["MENUTITLE_BLOCK1"]["~VALUE"];
}


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

$arSort["chars"] = ((strlen($arResult["PROPERTIES"]["POSITION_BLOCK3"]["VALUE"]) > 0) ? $arResult["PROPERTIES"]["POSITION_BLOCK3"]["VALUE"] : 10);



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

$arSort["gallery"] = ((strlen($arResult["PROPERTIES"]["POSITION_BLOCK10"]["VALUE"]) > 0) ? $arResult["PROPERTIES"]["POSITION_BLOCK10"]["VALUE"] : 10);



function cmp($a, $b) 
{
    if ($a == $b) {
        return 0;
    }
    return ($a < $b) ? -1 : 1;
}

uasort($arTmpMenuSort, "cmp");
uasort($arSort, "cmp");
uasort($arSortChars, "cmp");




foreach($arTmpMenuSort as $key=>$value)
    $arMenu[$key] = $arTmpMenu[$key];
    

$arResult["SIDE_MENU"] = $arMenu;
$arResult["BLOCK_SORT"] = $arSort;
$arResult["CHARS_SORT"] = $arSortChars;
$arResult["BLOCKS"] = $arBlocks;



$arResult["FIRST_ITEM"]["SCROLL2BLOCKS"]= (!empty($arResult["BLOCKS"]))?"Y":"N";




$cp = $this->__component; 

if (is_object($cp))
{
    $cp->arResult['SECTIONS_ID'] = $arResult["SECTIONS_ID"];
    $cp->SetResultCacheKeys(array('SECTIONS_ID'));

    $arResult['SECTIONS_ID'] = $cp->arResult['SECTIONS_ID'];
}
?>