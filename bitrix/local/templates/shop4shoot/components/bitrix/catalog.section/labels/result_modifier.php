<?if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED!==true) die();?>

<?

global $KRAKEN_TEMPLATE_ARRAY;

CKraken::getIblockIDs(array("CODES"=>array("concept_kraken_site_catalog_".SITE_ID), "SITE_ID"=>SITE_ID));
CKraken::getMess(array("catalog"));
$arResult = $arItemsID = Array();

$property_enums = CIBlockPropertyEnum::GetList(Array("SORT"=>"ASC"), Array("IBLOCK_ID"=>$KRAKEN_TEMPLATE_ARRAY['CATALOG']["IBLOCK_ID"], "CODE"=>"LABELS"));

while($enum_fields = $property_enums->GetNext())
    $arResult["LABELS"][$enum_fields["XML_ID"]] = $enum_fields["ID"];


foreach($arResult["LABELS"] as $label=>$id)
{
    $arFilter = Array("IBLOCK_ID"=>$KRAKEN_TEMPLATE_ARRAY['CATALOG']["IBLOCK_ID"], "ACTIVE_DATE"=>"Y", "SECTION_GLOBAL_ACTIVE" => "Y", "ACTIVE"=>"Y", "PROPERTY_LABELS"=>$id);
    $res = CIBlockElement::GetList(Array("SORT"=>"ASC"), $arFilter, false, Array("nTopCount"=>12), array("ID"));
    $arItemsID[$id] = array();
    while($ob = $res->GetNextElement())
    {
        $arElement = $ob->GetFields();
        $arItemsID[$id][] = $arElement["ID"];
    }
}

$elementsID = array();
if(!empty($arItemsID))
{
    foreach($arItemsID as $key=>$arItem)
    {
        if(empty($arItem))
            unset($arItemsID[$key]);
        
        else
        {
        	foreach($arItem as $item)
        		$elementsID[$item]=$item;
        }
        
    }
}

if(!empty($arResult["LABELS"]))
{
    foreach ($arResult["LABELS"] as $key => $value) {
        if(!isset($arItemsID[$value]))
            unset($arResult["LABELS"][$key]);
    }
}


$arItems = array();

if(!empty($elementsID))
{
    $arFilter = Array("IBLOCK_ID"=>$KRAKEN_TEMPLATE_ARRAY['CATALOG']["IBLOCK_ID"], "ID" => $elementsID);
    $res = CIBlockElement::GetList(Array("SORT"=>"ASC"), $arFilter, false);

    while($ob = $res->GetNextElement())
    {
        $item = $ob->GetFields();
        $item["PROPERTIES"] = $ob->GetProperties(); 
        $arItems[$item["ID"]] = $item;
    }
}

if(!empty($arItems))
{
	foreach($arItemsID as $key=>$arItem)
    {
        if(!empty($arItem))
        {
        	foreach($arItem as $item)
        	{
        		$arResult["ITEMS"][$key][]=$arItems[$item];
        	}
        }
    }

}


if(!empty($arResult["ITEMS"]))
{
    $arOffersSectionIDs = $arOffers = array();

    foreach ($arResult["ITEMS"] as $key => $arItem)
    {
        if(!empty($arItem))
        {
            foreach($arItem as $item)
            {
                if(strlen($item["PROPERTIES"]["OFFERS"]["VALUE"])>0)
                    $arOffersSectionIDs[$item["PROPERTIES"]["OFFERS"]["VALUE"]]=$item["PROPERTIES"]["OFFERS"]["VALUE"];
            }
        }
    }

}



if(!empty($arOffersSectionIDs))
{
    CKraken::getIblockIDs(
        array(
            "CODES" => array("concept_kraken_site_catalog_offers_".SITE_ID), 
            "SITE_ID"=>SITE_ID
        )
    );
    
    $arFilter = Array("IBLOCK_ID"=>$KRAKEN_TEMPLATE_ARRAY['OFFERS']["IBLOCK_ID"], "SECTION_ID" => $arOffersSectionIDs, "ACTIVE"=>"Y", "SECTION_ACTIVE"=>"Y");
    $res = CIBlockElement::GetList(Array("SORT"=>"ASC"), $arFilter, false);

    while($ob = $res->GetNextElement())
    {
        $item = $ob->GetFields();
        $item["PROPERTIES"] = $ob->GetProperties(); 
        $arOffers[$item["IBLOCK_SECTION_ID"]][] = $item;
    }
}


if(!empty($arOffers))
{
    $foundOffers = false;
    foreach ($arResult["ITEMS"] as $key => $arItem)
    {
        foreach($arItem as $keyItem=>$item)
        {
            if(strlen($item["PROPERTIES"]["OFFERS"]["VALUE"])>0)
            {
                $arResult["ITEMS"][$key][$keyItem]["OFFERS"] = $arOffers[$item["PROPERTIES"]["OFFERS"]["VALUE"]];
                $foundOffers = true;
            }
        }
        
    }
}



if($foundOffers)
{
    CKraken::getSkuList(SITE_ID);
    $isEmptySku = empty($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["SKU_LIST"]["VALUE_SKU"]);
    $isEmptySkuShowList = empty($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["SKU_LIST"]["VALUE_SHOW_LIST"]);

    if(!$isEmptySku)
    {
        foreach($arResult["ITEMS"] as $key=>$arItem)
        {
            foreach($arItem as $keyItem=>$item)
            {
                if($item["HAVEOFFERS"] = !empty($item["OFFERS"]))
                {
                    $arSku = CKraken::getSkuOffers($item["OFFERS"]);
                    $isEmptySkuValues = empty($arSku["OFFERS_VALUES"]);

                    if(!$isEmptySkuValues)
                    {

                        foreach ($item["OFFERS"] as $keyOffer => $arOffer)
                        {

                            if(!$isEmptySku)
                            {
                                foreach ($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["SKU_LIST"]["VALUE_SKU"] as $idProp => $codeProp)
                                {
                                    if(strlen($arSku["OFFERS_VALUES"][$keyOffer]["TREE"][$idProp]["VALUE"])>0)
                                    {
                                        $arOffer["TREE"]["PROP_".$idProp]=$arSku["OFFERS_VALUES"][$keyOffer]["TREE"][$idProp]["ID"];
                                        $arOffer["TREE_NAME"][]=$arSku["OFFERS_VALUES"][$keyOffer]["TREE"][$idProp]["NAME"];
                                        $arOffer["TREE_VALUE"][]=$arSku["OFFERS_VALUES"][$keyOffer]["TREE"][$idProp]["VALUE"]; 
                                        $arOffer["TREE_NAME_VALUE"][]=$arSku["OFFERS_VALUES"][$keyOffer]["TREE"][$idProp]["NAME"].":&nbsp;".$arSku["OFFERS_VALUES"][$keyOffer]["TREE"][$idProp]["VALUE"];
                                    }
                                }
                            }

                            if(!$isEmptySkuShowDetail)
                            {
                                foreach ($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["SKU_LIST"]["VALUE_SHOW_DETAIL"] as $idProp => $codeProp)
                                {
                                    if(strlen($arSku["OFFERS_VALUES"][$keyOffer]["TREE"][$idProp]["VALUE"])>0)
                                    {
                                        $arOffer["SKU_CHARS"][]=
                                            array(
                                                "NAME"=>$arSku["OFFERS_VALUES"][$keyOffer]["TREE"][$idProp]["NAME"],
                                                "VALUE"=>$arSku["OFFERS_VALUES"][$keyOffer]["TREE"][$idProp]["VALUE"],
                                                "NAME_VALUE"=>$arSku["OFFERS_VALUES"][$keyOffer]["TREE"][$idProp]["NAME"].":&nbsp;".$arSku["OFFERS_VALUES"][$keyOffer]["TREE"][$idProp]["VALUE"]
                                            ); 
                                    }
                                }
                            }


                            $item["OFFERS"][$keyOffer] = $arOffer;
                            
                        }
                    }

                    $item["OFFERS_SKU"] = $arSku["VALUE_SKU"];

                    $arResult["ITEMS"][$key][$keyItem] = $item;
                }
            }
        }
    }
}

if(!empty($arResult["ITEMS"]))
{

    foreach ($arResult["ITEMS"] as $key => $arItem)
    {

        if(!empty($arItem))
        {
            foreach($arItem as $keyItem=>$item)
            {

                $item["FIRST_ITEM"] = array();

                if($item["HAVEOFFERS"])
                {    
                    foreach ($item["OFFERS"] as $keyOffer => $arOffer)
                    {
                        $item["OFFERS"][$keyOffer] = array_merge(
                            $item["OFFERS"][$keyOffer], CKraken::getProductInfoFormated(
                                array(
                                    "ITEM"=>$arOffer, 
                                    "IS_OFFER"=>"Y",
                                    "MAIN_GALLERY"=>$item["PROPERTIES"]["MORE_PHOTO"],
                                    "DETAIL_PAGE_URL"=>$item["DETAIL_PAGE_URL"],
                                    "MAIN_ID"=>$item["ID"],
                                    "MAIN_NAME"=>$item["~NAME"],
                                    "COOKIE_BASKET"=>$KRAKEN_TEMPLATE_ARRAY["BASKET"]["ITEMS"],
                                    "CART_PRICE_STEP"=> $item["PROPERTIES"]["CART_PRICE_STEP"]["VALUE"],
                                    "CART_MIN_COUNT"=> $item["PROPERTIES"]["CART_MIN_COUNT"]["VALUE"],
                                    "RESIZE_IMAGES"=> $arItem["PROPERTIES"]["RESIZE_IMAGES"]["VALUE_XML_ID"],
                                    "IPROPERTY_VALUES"=>$arItem["IPROPERTY_VALUES"]
                                )
                            )
                        );
                    }

                    foreach ($item["OFFERS"] as $arOffer)
                    {
                        $item["PRODUCT_INFO"][] = $arOffer["PRODUCT_INFO"];
                    }

                    $item["FIRST_ITEM"] = $item["OFFERS"][0]["PRODUCT_INFO"];

                    $item["OFFER_SELECTED"] = 0;
                    
                }
                else
                {
                    $item = array_merge(
                        $item, CKraken::getProductInfoFormated(
                        array(
                            "ITEM"=>$item,
                            "COOKIE_BASKET"=>$KRAKEN_TEMPLATE_ARRAY["BASKET"]["ITEMS"],
                            "CURRENCY_BLOCK_ID"=>$currencyMainBlock
                        ))
                    );



                    $item["FIRST_ITEM"] = $item["PRODUCT_INFO"];
                }


                $item["FORM_FAST_ORDER"] = ($item["PROPERTIES"]["ORDER_FORM"]["VALUE"]>0) ? $item["PROPERTIES"]["ORDER_FORM"]["VALUE"] : $KRAKEN_TEMPLATE_ARRAY['FORMS']['VALUE_CATALOG'];



                $item["BTN_ADD2BASKET_NAME"] = $KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["ELEMENT_BTN_ADD_NAME"];

                if(strlen($item["PROPERTIES"]["CART_BTN_NAME"]["~VALUE"]) > 0)
                    $item["BTN_ADD2BASKET_NAME"] = $item["PROPERTIES"]["CART_BTN_NAME"]["~VALUE"];

                else if(strlen($KRAKEN_TEMPLATE_ARRAY["CART_BTN_ADD_NAME"]["~VALUE"]) > 0)
                    $item["BTN_ADD2BASKET_NAME"] = $KRAKEN_TEMPLATE_ARRAY["CART_BTN_ADD_NAME"]["~VALUE"];



                $item["BTN_ADDED2BASKET_NAME"] = $KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["ELEMENT_BTN_ADDED_NAME"];

                if(strlen($item["PROPERTIES"]["CART_BTN_NAME_ADDED"]["~VALUE"]) > 0)
                    $item["BTN_ADDED2BASKET_NAME"] = $item["PROPERTIES"]["CART_BTN_NAME_ADDED"]["~VALUE"];

                else if(strlen($KRAKEN_TEMPLATE_ARRAY["CART_BTN_ADDED_NAME"]["~VALUE"]) > 0)
                    $item["BTN_ADDED2BASKET_NAME"] = $KRAKEN_TEMPLATE_ARRAY["CART_BTN_ADDED_NAME"]["~VALUE"];




                $item["BTN_FAST_ORDER_NAME"] = $KRAKEN_TEMPLATE_ARRAY["CTLG_BTN"]["~VALUE"];

                if(strlen($item["PROPERTIES"]["BUTTON_NAME"]["VALUE"]) > 0)
                    $item["BTN_FAST_ORDER_NAME"] = $item["PROPERTIES"]["BUTTON_NAME"]["~VALUE"];

               

                $arResult["ITEMS"][$key][$keyItem] = $item;
            }
        }
    }
}
?>