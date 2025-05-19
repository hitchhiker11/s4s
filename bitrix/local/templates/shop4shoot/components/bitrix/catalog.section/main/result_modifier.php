<?if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED!==true) die();?>

<?


if(!empty($arResult["ITEMS"]))
{
	global $KRAKEN_TEMPLATE_ARRAY;
	CKraken::getMess(array("catalog"));

	$getProps = empty($arResult["ITEMS"][0]["PROPERTIES"]);
	
	foreach($arResult["ITEMS"] as $key=>$arItem)
	{
	    $arFilter = Array("IBLOCK_ID"=>$arItem["IBLOCK_ID"], "ID" => $arItem["ID"]);
	    $res = CIBlockElement::GetList(Array("SORT"=>"ASC"), $arFilter, false, false, array("DETAIL_PAGE_URL"));

	    while($ob = $res->GetNextElement())
	    {
	    	$item = $ob->GetFields();
	    	$arResult["ITEMS"][$key]["DETAIL_PAGE_URL"] = $item["DETAIL_PAGE_URL"];

	    	if($getProps)
        		$arResult["ITEMS"][$key]["PROPERTIES"] = $ob->GetProperties();
	    }
	}

	$arOffersSectionIDs = $arOffers = array();

	foreach($arResult["ITEMS"] as $key=>$arItem)
	{
		if(strlen($arItem["PROPERTIES"]["OFFERS"]["VALUE"])>0)
			$arOffersSectionIDs[]=$arItem["PROPERTIES"]["OFFERS"]["VALUE"];
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
		foreach($arResult["ITEMS"] as $key=>$arItem)
		{
			if(strlen($arItem["PROPERTIES"]["OFFERS"]["VALUE"])>0)
			{
				$arResult["ITEMS"][$key]["OFFERS"] = $arOffers[$arItem["PROPERTIES"]["OFFERS"]["VALUE"]];
				$foundOffers = true;
			}
			
		}
	}
	unset($arOffers,$arOffersSectionIDs);


	if($foundOffers)
	{
		CKraken::getSkuList(SITE_ID);
		$isEmptySku = empty($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["SKU_LIST"]["VALUE_SKU"]);
		$isEmptySkuShowList = empty($KRAKEN_TEMPLATE_ARRAY["ITEMS"]["SKU_LIST"]["VALUE_SHOW_LIST"]);

		if(!$isEmptySku)
		{
			foreach($arResult["ITEMS"] as $key=>$arItem)
			{
				if($arItem["HAVEOFFERS"] = !empty($arItem["OFFERS"]))
				{
					$arSku = CKraken::getSkuOffers($arItem["OFFERS"]);
					$isEmptySkuValues = empty($arSku["OFFERS_VALUES"]);

					if(!$isEmptySkuValues)
					{

						foreach ($arItem["OFFERS"] as $keyOffer => $arOffer)
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


				            $arItem["OFFERS"][$keyOffer] = $arOffer;
							
						}
					}

					$arItem["OFFERS_SKU"] = $arSku["VALUE_SKU"];

					$arResult["ITEMS"][$key] = $arItem;
				}
			}
		}
	}


	$currencyMainBlock = (isset($arParams["CURRENCY_BLOCK_ID"]))?$arParams["CURRENCY_BLOCK_ID"]:NULL;

	foreach($arResult["ITEMS"] as $key=>$arItem)
	{
		$arItem["FIRST_ITEM"] = array();

		if($arItem["HAVEOFFERS"])
		{    
		    foreach ($arItem["OFFERS"] as $keyOffer => $arOffer)
		    {
		        $arItem["OFFERS"][$keyOffer] = array_merge(
		            $arItem["OFFERS"][$keyOffer], CKraken::getProductInfoFormated(
		                array(
		                	"ITEM"=>$arOffer, 
		                	"IS_OFFER"=>"Y",
		                	"MAIN_GALLERY"=>$arItem["PROPERTIES"]["MORE_PHOTO"],
		                	"DETAIL_PAGE_URL"=>$arItem["DETAIL_PAGE_URL"],
		                	"MAIN_ID"=>$arItem["ID"],
		                	"MAIN_NAME"=>$arItem["~NAME"],
		                	"COOKIE_BASKET"=>$KRAKEN_TEMPLATE_ARRAY["BASKET"]["ITEMS"],
                            "CART_PRICE_STEP"=> $arItem["PROPERTIES"]["CART_PRICE_STEP"]["VALUE"],
                            "CART_MIN_COUNT"=> $arItem["PROPERTIES"]["CART_MIN_COUNT"]["VALUE"],
                            "CURRENCY_BLOCK_ID"=>$currencyMainBlock,
                            "RESIZE_IMAGES"=> $arItem["PROPERTIES"]["RESIZE_IMAGES"]["VALUE_XML_ID"],
                			"IPROPERTY_VALUES"=>$arItem["IPROPERTY_VALUES"]
		                )
		            )
		        );

		        
		    }

		    $arItem["FIRST_ITEM"] = $arItem["OFFERS"][0]["PRODUCT_INFO"];


		    foreach ($arItem["OFFERS"] as $arOffer)
		    {
				$arItem["PRODUCT_INFO"][] = $arOffer["PRODUCT_INFO"];
			}

		    $arItem["OFFER_SELECTED"] = 0;
		    
		}
		else
		{
		    $arItem = array_merge(
		    	$arItem, CKraken::getProductInfoFormated(
		    	array(
		    		"ITEM"=>$arItem,
		    		"COOKIE_BASKET"=>$KRAKEN_TEMPLATE_ARRAY["BASKET"]["ITEMS"],
		    		"CURRENCY_BLOCK_ID"=>$currencyMainBlock
		    	))
		    );



		    $arItem["FIRST_ITEM"] = $arItem["PRODUCT_INFO"];
		}


		$arItem["FORM_FAST_ORDER"] = ($arItem["PROPERTIES"]["ORDER_FORM"]["VALUE"]>0) ? $arItem["PROPERTIES"]["ORDER_FORM"]["VALUE"] : $KRAKEN_TEMPLATE_ARRAY['FORMS']['VALUE_CATALOG'];



		$arItem["BTN_ADD2BASKET_NAME"] = $KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["ELEMENT_BTN_ADD_NAME"];

		if(strlen($arItem["PROPERTIES"]["CART_BTN_NAME"]["~VALUE"]) > 0)
		    $arItem["BTN_ADD2BASKET_NAME"] = $arItem["PROPERTIES"]["CART_BTN_NAME"]["~VALUE"];

		else if(strlen($KRAKEN_TEMPLATE_ARRAY["CART_BTN_ADD_NAME"]["~VALUE"]) > 0)
		    $arItem["BTN_ADD2BASKET_NAME"] = $KRAKEN_TEMPLATE_ARRAY["CART_BTN_ADD_NAME"]["~VALUE"];



		$arItem["BTN_ADDED2BASKET_NAME"] = $KRAKEN_TEMPLATE_ARRAY["MESS"]["CATALOG"]["ELEMENT_BTN_ADDED_NAME"];

		if(strlen($arItem["PROPERTIES"]["CART_BTN_NAME_ADDED"]["~VALUE"]) > 0)
		    $arItem["BTN_ADDED2BASKET_NAME"] = $arItem["PROPERTIES"]["CART_BTN_NAME_ADDED"]["~VALUE"];

		else if(strlen($KRAKEN_TEMPLATE_ARRAY["CART_BTN_ADDED_NAME"]["~VALUE"]) > 0)
		    $arItem["BTN_ADDED2BASKET_NAME"] = $KRAKEN_TEMPLATE_ARRAY["CART_BTN_ADDED_NAME"]["~VALUE"];




		$arItem["BTN_FAST_ORDER_NAME"] = $KRAKEN_TEMPLATE_ARRAY["CTLG_BTN"]["~VALUE"];

		if(strlen($arItem["PROPERTIES"]["BUTTON_NAME"]["VALUE"]) > 0)
		    $arItem["BTN_FAST_ORDER_NAME"] = $arItem["PROPERTIES"]["BUTTON_NAME"]["~VALUE"];

		$arResult["ITEMS"][$key] = $arItem;
	}


	if(isset($arParams["SEARCH_ELEMENTS_ID"]))
	{

	    if(!empty($arParams["SEARCH_ELEMENTS_ID"]))
	    {

	        foreach ($arParams["SEARCH_ELEMENTS_ID"] as $key => $value) {
	           $arParams["SEARCH_ELEMENTS_ID"][$key] = intval($value);
	        }


	        $newArResult = array();

	        if(!empty($arResult["ITEMS"]))
	        {
	            foreach ($arResult["ITEMS"] as $key => $value)
	            {
	                $newKey = array_search(intval($value["ID"]), $arParams["SEARCH_ELEMENTS_ID"]);

	                $newArResult[$newKey] = $value;
	            }
	        }
	        
	        ksort($newArResult);

	        $arResult["ITEMS"] = array_values($newArResult);

	    }
	}

}